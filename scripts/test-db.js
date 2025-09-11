import { dbService } from '../services/db.service.js'
import { logger } from '../services/logger.service.js'

async function testDatabase() {
    try {
        logger.info('Testing database...')
        
        const toyCollection = await dbService.getCollection('toy')
        const toys = await toyCollection.find({}).toArray()
        
        logger.info(`Found ${toys.length} toys in database:`)
        toys.forEach(toy => {
            logger.info(`- ${toy.name} (${toy.price})`)
        })
        
        const userCollection = await dbService.getCollection('user')
        const users = await userCollection.find({}).toArray()
        
        logger.info(`Found ${users.length} users in database:`)
        users.forEach(user => {
            logger.info(`- ${user.username} (${user.fullname})`)
        })
        
        process.exit(0)
    } catch (err) {
        logger.error('Failed to test database', err)
        process.exit(1)
    }
}

testDatabase()
