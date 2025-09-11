import { Toy } from '../models/toy.model.js'
import { logger } from './logger.service.js' 
import { utilService } from './util.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabelCounts
}

async function query(filterBy = {}) {
    try {
        const { txt, inStock, labels, sortBy, pageIdx = 0 } = filterBy
        const PAGE_SIZE = 5

        // Build MongoDB query
        const query = {}

        if (txt) {
            query.name = { $regex: txt, $options: 'i' }
        }

        if (inStock !== undefined) {
            query.inStock = JSON.parse(inStock)
        }

        if (labels && labels.length) {
            query.labels = { $all: labels }
        }

        // Build sort object
        let sort = { createdAt: -1 } // Default sort
        if (sortBy && sortBy.type) {
            sort = { [sortBy.type]: +sortBy.sortDir }
        }

        // Calculate pagination
        const skip = pageIdx * PAGE_SIZE

        // Execute query with pagination
        const toys = await Toy.find(query)
            .sort(sort)
            .skip(skip)
            .limit(PAGE_SIZE)
            .lean()

        // Get total count for pagination
        const totalCount = await Toy.countDocuments(query)

        return {
            toys,
            totalCount,
            pageIdx,
            pageSize: PAGE_SIZE
        }
    } catch (err) {
        logger.error('Error in toyService.query', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const toy = await Toy.findById(toyId).lean()
        if (!toy) {
            throw new Error('Toy not found')
        }
        return toy
    } catch (err) {
        logger.error('Error in toyService.getById', err)
        throw err
    }
}

async function remove(toyId, loggedinUser) {
    try {
        const toy = await Toy.findById(toyId)
        if (!toy) {
            throw new Error('Toy not found')
        }

        // Check permissions
        if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser._id) {
            throw new Error('Not your toy')
        }

        await Toy.findByIdAndDelete(toyId)
        return 'Deleted successfully'
    } catch (err) {
        logger.error('Error in toyService.remove', err)
        throw err
    }
}

async function save(toy, loggedinUser) {
    try {
        if (toy._id) {
            // Update existing toy
            const toyToUpdate = await Toy.findById(toy._id)
            if (!toyToUpdate) {
                throw new Error('Toy not found')
            }

            // Check permissions
            if (!loggedinUser.isAdmin && toyToUpdate.owner._id !== loggedinUser._id) {
                throw new Error('Not your toy')
            }

            // Update fields
            toyToUpdate.name = toy.name
            toyToUpdate.labels = toy.labels || []
            toyToUpdate.price = toy.price
            toyToUpdate.description = toy.description
            toyToUpdate.ageRange = toy.ageRange
            toyToUpdate.imageUrl = toy.imageUrl
            toyToUpdate.inStock = toy.inStock

            const savedToy = await toyToUpdate.save()
            return savedToy.toObject()
        } else {
            // Create new toy
            const newToy = new Toy({
                ...toy,
                _id: utilService.makeId(),
                owner: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname,
                    isAdmin: loggedinUser.isAdmin || false
                },
                createdAt: Date.now(),
                labels: toy.labels || []
            })

            const savedToy = await newToy.save()
            return savedToy.toObject()
        }
    } catch (err) {
        logger.error('Error in toyService.save', err)
        throw err
    }
}

async function getLabelCounts() {
    try {
        const toys = await Toy.find({}).lean()
        
        const labelCountMap = toys.reduce((acc, toy) => {
            toy.labels.forEach(label => {
                acc[label] = (acc[label] || 0) + 1
            })
            return acc
        }, {})

        const labelCountArray = Object.entries(labelCountMap).map(
            ([label, count]) => ({
                label,
                count,
            })
        )
        
        return labelCountArray
    } catch (err) {
        logger.error('Error in toyService.getLabelCounts', err)
        throw err
    }
}