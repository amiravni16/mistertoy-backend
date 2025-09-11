import { toyService } from '../api/toy/toy.service.js'
import { logger } from '../services/logger.service.js'

async function testQuery() {
    try {
        logger.info('Testing toy query...')
        
        // Test with empty filter
        const result1 = await toyService.query({})
        logger.info(`Empty filter result: ${JSON.stringify(result1)}`)
        
        // Test with txt = ''
        const result2 = await toyService.query({ txt: '' })
        logger.info(`Empty txt result: ${JSON.stringify(result2)}`)
        
        // Test with txt = undefined
        const result3 = await toyService.query({ txt: undefined })
        logger.info(`Undefined txt result: ${JSON.stringify(result3)}`)
        
        process.exit(0)
    } catch (err) {
        logger.error('Failed to test query', err)
        process.exit(1)
    }
}

testQuery()
