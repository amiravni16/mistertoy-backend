import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || undefined,
            inStock: req.query.inStock || undefined,
            labels: req.query.labels || [],
            sortBy: req.query.sortBy || { type: '', sortDir: 1 },
            pageIdx: req.query.pageIdx || 0
        }
        const result = await toyService.query(filterBy)
        res.json(result)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req

    try {
        const toy = {
            ...req.body,
            owner: loggedinUser,
            createdAt: Date.now(),
            labels: req.body.labels || []
        }
        const addedToy = await toyService.add(toy)
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    const { loggedinUser } = req
    
    try {
        const toy = { ...req.body, _id: req.params.id }
        const updatedToy = await toyService.update(toy, loggedinUser)
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    const { loggedinUser } = req
    
    try {
        const toyId = req.params.id
        const deletedCount = await toyService.remove(toyId, loggedinUser)
        res.send(`${deletedCount} toys removed`)
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await toyService.addMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to add toy msg', err)
        res.status(500).send({ err: 'Failed to add toy msg' })
    }
}

export async function removeToyMsg(req, res) {
    try {
        const { id: toyId, msgId } = req.params
        const removedId = await toyService.removeMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}

export async function getLabelCounts(req, res) {
    try {
        const labelCounts = await toyService.getLabelCounts()
        res.json(labelCounts)
    } catch (err) {
        logger.error('Failed to get label counts', err)
        res.status(500).send({ err: 'Failed to get label counts' })
    }
}
