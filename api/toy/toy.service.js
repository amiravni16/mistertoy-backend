import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addMsg,
    removeMsg,
    getLabelCounts
}

async function query(filterBy = {}) {
    try {
        const { txt, inStock, labels, sortBy, pageIdx = 0 } = filterBy
        const PAGE_SIZE = 5

        // Build MongoDB query
        const criteria = {}

        if (txt && txt.trim()) {
            criteria.name = { $regex: txt, $options: 'i' }
        }

        if (inStock !== undefined) {
            criteria.inStock = JSON.parse(inStock)
        }

        if (labels && labels.length) {
            criteria.labels = { $all: labels }
        }

        const collection = await dbService.getCollection('toy')
        
        // Get total count
        const totalCount = await collection.countDocuments(criteria)

        // Build sort object
        let sort = { createdAt: -1 } // Default sort
        if (sortBy && sortBy.type) {
            sort = { [sortBy.type]: +sortBy.sortDir }
        }

        // Calculate pagination
        const skip = pageIdx * PAGE_SIZE

        // Execute query with pagination
        const toys = await collection.find(criteria)
            .sort(sort)
            .skip(skip)
            .limit(PAGE_SIZE)
            .toArray()

        return {
            toys,
            totalCount,
            pageIdx,
            pageSize: PAGE_SIZE
        }
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        if (!toy) {
            throw new Error('Toy not found')
        }
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId, loggedinUser) {
    try {
        const collection = await dbService.getCollection('toy')
        
        // Check if user has permission to delete
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        if (!toy) {
            throw new Error('Toy not found')
        }

        if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser._id) {
            throw new Error('Not your toy')
        }

        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(toyId) })
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy, loggedinUser) {
    try {
        const collection = await dbService.getCollection('toy')
        
        // Check if user has permission to update
        const existingToy = await collection.findOne({ _id: new ObjectId(toy._id) })
        if (!existingToy) {
            throw new Error('Toy not found')
        }

        if (!loggedinUser.isAdmin && existingToy.owner._id !== loggedinUser._id) {
            throw new Error('Not your toy')
        }

        const toyToSave = {
            name: toy.name,
            price: toy.price,
            labels: toy.labels || [],
            description: toy.description,
            ageRange: toy.ageRange,
            imageUrl: toy.imageUrl,
            inStock: toy.inStock
        }

        await collection.updateOne(
            { _id: new ObjectId(toy._id) }, 
            { $set: toyToSave }
        )
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        
        const collection = await dbService.getCollection('toy')
        
        await collection.updateOne(
            { _id: new ObjectId(toyId) },
            { $push: { msgs: msg } }
        )
        return msg
    } catch (err) {
        logger.error(`cannot add message to toy ${toyId}`, err)
        throw err
    }
}

async function removeMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne(
            { _id: new ObjectId(toyId) },
            { $pull: { msgs: { id: msgId } } }
        )
        return msgId
    } catch (err) {
        logger.error(`cannot remove message from toy ${toyId}`, err)
        throw err
    }
}

async function getLabelCounts() {
    try {
        const collection = await dbService.getCollection('toy')
        const toys = await collection.find({}).toArray()
        
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
        logger.error('cannot get label counts', err)
        throw err
    }
}
