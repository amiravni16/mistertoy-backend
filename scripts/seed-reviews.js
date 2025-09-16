import { dbService } from '../services/db.service.js'
import { logger } from '../services/logger.service.js'

async function seedReviews() {
    try {
        console.log('Starting review seeding...')
        
        const collection = await dbService.getCollection('review')
        
        // Get a toy ID from the existing toys
        const toyCollection = await dbService.getCollection('toy')
        const toys = await toyCollection.find({}).toArray()
        
        if (toys.length === 0) {
            console.log('No toys found. Please run toy seeding first.')
            return
        }
        
        const toyId = toys[0]._id.toString()
        
        // Get user IDs
        const userCollection = await dbService.getCollection('user')
        const users = await userCollection.find({}).toArray()
        
        if (users.length === 0) {
            console.log('No users found. Please run user seeding first.')
            return
        }
        
        const adminUserId = users.find(u => u.isAdmin)?._id.toString()
        const regularUserId = users.find(u => !u.isAdmin)?._id.toString()
        
        // Sample reviews
        const reviews = [
            {
                userId: adminUserId,
                toyId: toyId,
                txt: "This is an amazing toy! My kids love it and it's very well made. Highly recommended!",
                createdAt: Date.now() - 86400000 // 1 day ago
            },
            {
                userId: regularUserId,
                toyId: toyId,
                txt: "Great quality and fun to play with. The price is reasonable too.",
                createdAt: Date.now() - 172800000 // 2 days ago
            },
            {
                userId: adminUserId,
                toyId: toyId,
                txt: "Perfect for the age range specified. Educational and entertaining.",
                createdAt: Date.now() - 259200000 // 3 days ago
            }
        ]
        
        // Insert reviews
        await collection.insertMany(reviews)
        
        console.log(`Successfully seeded ${reviews.length} reviews`)
        
        // Add reviews to another toy if available
        if (toys.length > 1) {
            const secondToyId = toys[1]._id.toString()
            const additionalReviews = [
                {
                    userId: regularUserId,
                    toyId: secondToyId,
                    txt: "This toy exceeded my expectations. Very durable and engaging!",
                    createdAt: Date.now() - 432000000 // 5 days ago
                }
            ]
            
            await collection.insertMany(additionalReviews)
            console.log(`Added ${additionalReviews.length} more reviews for second toy`)
        }
        
        console.log('Review seeding completed successfully!')
        
    } catch (error) {
        logger.error('Error seeding reviews:', error)
        console.error('Error seeding reviews:', error)
    }
}

// Run the seeding function
seedReviews().then(() => {
    console.log('Review seeding finished')
    process.exit(0)
}).catch((error) => {
    console.error('Review seeding failed:', error)
    process.exit(1)
})
