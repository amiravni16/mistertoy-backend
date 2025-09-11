import { logger } from '../services/logger.service.js'

export function log(req, res, next) {
    logger.info('Req was made', req.method, req.url)
    next()
}
