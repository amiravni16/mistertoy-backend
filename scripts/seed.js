import { dbService } from '../services/db.service.js'
import { logger } from '../services/logger.service.js'

async function seedDatabase() {
    try {
        logger.info('Starting database seeding...')
        
        // Seed users
        const userCollection = await dbService.getCollection('user')
        await userCollection.insertMany([
            {
                username: 'admin',
                password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
                fullname: 'Admin User',
                score: 10000,
                isAdmin: true
            },
            {
                username: 'user1',
                password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
                fullname: 'Regular User',
                score: 10000,
                isAdmin: false
            }
        ])
        
        // Seed toys
        const toyCollection = await dbService.getCollection('toy')
        await toyCollection.insertMany([
            {
                name: 'Teddy Bear',
                price: 29.99,
                labels: ['Stuffed Animals', 'Baby'],
                createdAt: Date.now(),
                inStock: true,
                description: 'A soft and cuddly teddy bear perfect for children',
                ageRange: '0-5',
                imageUrl: 'https://example.com/teddy-bear.jpg',
                owner: {
                    _id: 'user1',
                    fullname: 'Regular User',
                    isAdmin: false
                }
            },
            {
                name: 'LEGO City Police Station',
                price: 89.99,
                labels: ['Building Blocks', 'Box game'],
                createdAt: Date.now(),
                inStock: true,
                description: 'Build your own police station with this detailed LEGO set',
                ageRange: '6-12',
                imageUrl: 'https://example.com/lego-police.jpg',
                owner: {
                    _id: 'user1',
                    fullname: 'Regular User',
                    isAdmin: false
                }
            },
            {
                name: 'Remote Control Car',
                price: 45.99,
                labels: ['Remote Control', 'Battery Powered', 'Outdoor'],
                createdAt: Date.now(),
                inStock: false,
                description: 'Fast and fun remote control car with rechargeable battery',
                ageRange: '8-14',
                imageUrl: 'https://example.com/rc-car.jpg',
                owner: {
                    _id: 'admin',
                    fullname: 'Admin User',
                    isAdmin: true
                }
            }
        ])
        
        logger.info('Database seeded successfully!')
        process.exit(0)
    } catch (err) {
        logger.error('Failed to seed database', err)
        process.exit(1)
    }
}

seedDatabase()
