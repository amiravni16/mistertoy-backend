import { toyService } from '../services/toy.service.js'
import { logger } from '../services/logger.service.js'

export const toyController = {
    async getToys(req, res) {
        try {
            const filterBy = req.query
            const toys = await toyService.query(filterBy)
            res.json(toys)
        } catch (err) {
            logger.error('Failed to get toys', err)
            res.status(500).send({ err: 'Failed to get toys' })
        }
    },

    async getToyById(req, res) {
        try {
            const { toyId } = req.params
            const toy = await toyService.getById(toyId)
            res.json(toy)
        } catch (err) {
            logger.error('Failed to get toy', err)
            res.status(500).send({ err: 'Failed to get toy' })
        }
    },

    async addToy(req, res) {
        try {
            const toy = req.body
            const addedToy = await toyService.save(toy)
            res.json(addedToy)
        } catch (err) {
            logger.error('Failed to add toy', err)
            res.status(500).send({ err: 'Failed to add toy' })
        }
    },

    async updateToy(req, res) {
        try {
            const toy = req.body
            const updatedToy = await toyService.save(toy)
            res.json(updatedToy)
        } catch (err) {
            logger.error('Failed to update toy', err)
            res.status(500).send({ err: 'Failed to update toy' })
        }
    },

    async removeToy(req, res) {
        try {
            const { toyId } = req.params
            await toyService.remove(toyId)
            res.send('Deleted successfully')
        } catch (err) {
            logger.error('Failed to remove toy', err)
            res.status(500).send({ err: 'Failed to remove toy' })
        }
    },

    async getLabelCounts(req, res) {
        try {
            const labelCounts = await toyService.getLabelCounts()
            res.json(labelCounts)
        } catch (err) {
            logger.error('Failed to get label counts', err)
            res.status(500).send({ err: 'Failed to get label counts' })
        }
    }
}
