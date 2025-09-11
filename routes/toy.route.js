import express from 'express'
import { toyController } from '../controllers/toy.controller.js'

export const toyRoutes = express.Router()

// GET /api/toy - get all toys with filtering
toyRoutes.get('/', toyController.getToys)

// GET /api/toy/label-counts - get label counts for filtering
toyRoutes.get('/label-counts', toyController.getLabelCounts)

// GET /api/toy/:toyId - get toy by id
toyRoutes.get('/:toyId', toyController.getToyById)

// POST /api/toy - add new toy
toyRoutes.post('/', toyController.addToy)

// PUT /api/toy/:toyId - update toy
toyRoutes.put('/:toyId', toyController.updateToy)

// DELETE /api/toy/:toyId - remove toy
toyRoutes.delete('/:toyId', toyController.removeToy)
