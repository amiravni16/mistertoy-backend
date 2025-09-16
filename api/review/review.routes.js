import express from 'express'
import { 
    getReviews, 
    getReviewById, 
    addReview, 
    updateReview, 
    removeReview,
    getReviewsByToyId,
    getReviewStats,
    getReviewsWithToysAndUsers
} from './review.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getReviews)
router.get('/aggregate', getReviewsWithToysAndUsers)
router.get('/toy/:toyId', getReviewsByToyId)
router.get('/toy/:toyId/stats', getReviewStats)
router.get('/:id', getReviewById)

// Protected routes (require authentication)
router.post('/', requireAuth, addReview)
router.put('/', requireAuth, updateReview)
router.delete('/:id', requireAuth, removeReview)

export { router as reviewRoutes }
