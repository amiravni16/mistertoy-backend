import { reviewService } from './review.service.js'
import { logger } from '../../services/logger.service.js'

export async function getReviews(req, res) {
    try {
        const reviews = await reviewService.query()
        res.json(reviews)
    } catch (err) {
        logger.error('Failed to get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

export async function getReviewById(req, res) {
    try {
        const reviewId = req.params.id
        const review = await reviewService.getById(reviewId)
        res.json(review)
    } catch (err) {
        logger.error('Failed to get review', err)
        res.status(500).send({ err: 'Failed to get review' })
    }
}

export async function addReview(req, res) {
    try {
        const review = req.body
        const loggedinUser = req.loggedinUser
        
        review.userId = loggedinUser._id
        
        const savedReview = await reviewService.add(review)
        res.json(savedReview)
    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

export async function updateReview(req, res) {
    try {
        const review = req.body
        const savedReview = await reviewService.update(review)
        res.json(savedReview)
    } catch (err) {
        logger.error('Failed to update review', err)
        res.status(500).send({ err: 'Failed to update review' })
    }
}

export async function removeReview(req, res) {
    try {
        const reviewId = req.params.id
        await reviewService.remove(reviewId)
        res.send('Review removed successfully')
    } catch (err) {
        logger.error('Failed to remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}

export async function getReviewsByToyId(req, res) {
    try {
        const toyId = req.params.toyId
        const reviews = await reviewService.getReviewsByToyId(toyId)
        res.json(reviews)
    } catch (err) {
        logger.error('Failed to get reviews for toy', err)
        res.status(500).send({ err: 'Failed to get reviews for toy' })
    }
}

export async function getReviewStats(req, res) {
    try {
        const toyId = req.params.toyId
        const stats = await reviewService.getReviewStats(toyId)
        res.json(stats)
    } catch (err) {
        logger.error('Failed to get review stats', err)
        res.status(500).send({ err: 'Failed to get review stats' })
    }
}

export async function getReviewsWithToysAndUsers(req, res) {
    try {
        const filterBy = {
            toyId: req.query.toyId,
            userId: req.query.userId,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined
        }
        
        const reviews = await reviewService.getReviewsWithToysAndUsers(filterBy)
        res.json(reviews)
    } catch (err) {
        logger.error('Failed to get reviews with toys and users', err)
        res.status(500).send({ err: 'Failed to get reviews with toys and users' })
    }
}
