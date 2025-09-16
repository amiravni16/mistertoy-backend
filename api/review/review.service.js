import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const reviewService = {
    query,
    getById,
    remove,
    add,
    update,
    getReviewsByToyId,
    getReviewStats,
    getReviewsWithToysAndUsers
}

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('review')
        const reviews = await collection.find(filterBy).toArray()
        return reviews
    } catch (error) {
        logger.error('cannot find reviews', error)
        throw error
    }
}

async function getById(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        const review = await collection.findOne({ _id: ObjectId.createFromHexString(reviewId) })
        return review
    } catch (error) {
        logger.error(`while finding review ${reviewId}`, error)
        throw error
    }
}

async function remove(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(reviewId) })
    } catch (error) {
        logger.error(`cannot remove review ${reviewId}`, error)
        throw error
    }
}

async function add(review) {
    try {
        review.createdAt = Date.now()
        const collection = await dbService.getCollection('review')
        await collection.insertOne(review)
        return review
    } catch (error) {
        logger.error('cannot insert review', error)
        throw error
    }
}

async function update(review) {
    try {
        const { txt } = review
        const reviewToUpdate = { txt }
        
        const collection = await dbService.getCollection('review')
        await collection.updateOne(
            { _id: ObjectId.createFromHexString(review._id) },
            { $set: reviewToUpdate }
        )
        return review
    } catch (error) {
        logger.error(`cannot update review ${review._id}`, error)
        throw error
    }
}

async function getReviewsByToyId(toyId) {
    try {
        const collection = await dbService.getCollection('review')
        const reviews = await collection
            .aggregate([
                { $match: { toyId: toyId } },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        txt: 1,
                        createdAt: 1,
                        userId: 1,
                        toyId: 1,
                        'user.fullname': 1,
                        'user.username': 1
                    }
                },
                { $sort: { createdAt: -1 } }
            ])
            .toArray()
        return reviews
    } catch (error) {
        logger.error(`cannot get reviews for toy ${toyId}`, error)
        throw error
    }
}

async function getReviewStats(toyId) {
    try {
        const collection = await dbService.getCollection('review')
        const stats = await collection
            .aggregate([
                { $match: { toyId: toyId } },
                {
                    $group: {
                        _id: null,
                        totalReviews: { $sum: 1 },
                        avgRating: { $avg: '$rating' }
                    }
                }
            ])
            .toArray()
        
        return stats[0] || { totalReviews: 0, avgRating: 0 }
    } catch (error) {
        logger.error(`cannot get review stats for toy ${toyId}`, error)
        throw error
    }
}

async function getReviewsWithToysAndUsers(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('review')
        
        // Build match criteria
        const matchCriteria = {}
        if (filterBy.toyId) {
            matchCriteria.toyId = filterBy.toyId
        }
        if (filterBy.userId) {
            matchCriteria.userId = filterBy.userId
        }
        
        const reviews = await collection
            .aggregate([
                // Match reviews based on criteria
                { $match: matchCriteria },
                
                // Add fields to convert string IDs to ObjectIds for lookup
                {
                    $addFields: {
                        toyObjectId: { $toObjectId: '$toyId' },
                        userObjectId: { $toObjectId: '$userId' }
                    }
                },
                
                // Lookup toys using the converted ObjectId
                {
                    $lookup: {
                        from: 'toy',
                        localField: 'toyObjectId',
                        foreignField: '_id',
                        as: 'toy'
                    }
                },
                
                // Lookup users using the converted ObjectId
                {
                    $lookup: {
                        from: 'user',
                        localField: 'userObjectId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                
                // Unwind the arrays (since lookup returns arrays)
                { $unwind: '$toy' },
                { $unwind: '$user' },
                
                // Project the desired output structure
                {
                    $project: {
                        _id: 1,
                        txt: 1,
                        createdAt: 1,
                        toy: {
                            _id: '$toy._id',
                            name: '$toy.name',
                            price: '$toy.price'
                        },
                        user: {
                            _id: '$user._id',
                            fullname: '$user.fullname',
                            username: '$user.username'
                        }
                    }
                },
                
                // Sort by creation date (newest first)
                { $sort: { createdAt: -1 } },
                
                // Apply limit if specified
                ...(filterBy.limit ? [{ $limit: filterBy.limit }] : [])
            ])
            .toArray()
        
        return reviews
    } catch (error) {
        logger.error('cannot get reviews with toys and users', error)
        throw error
    }
}
