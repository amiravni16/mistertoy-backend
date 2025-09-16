import { reviewService } from '../api/review/review.service.js'
import { logger } from '../services/logger.service.js'

async function demoAggregation() {
    try {
        console.log('🚀 MongoDB Aggregation Demo - Reviews with Toys and Users\n')
        
        // Demo 1: Get all reviews with toys and users
        console.log('📊 Demo 1: All Reviews with Toy and User Details')
        console.log('=' .repeat(60))
        const allReviews = await reviewService.getReviewsWithToysAndUsers()
        
        allReviews.forEach((review, index) => {
            console.log(`\n${index + 1}. Review ID: ${review._id}`)
            console.log(`   Review: "${review.txt}"`)
            console.log(`   Toy: ${review.toy.name} ($${review.toy.price})`)
            console.log(`   User: ${review.user.fullname} (@${review.user.username})`)
            console.log(`   Date: ${new Date(review.createdAt).toLocaleDateString()}`)
        })
        
        // Demo 2: Get reviews for a specific toy
        if (allReviews.length > 0) {
            const toyId = allReviews[0].toy._id.toString()
            console.log(`\n\n🎯 Demo 2: Reviews for Toy ID: ${toyId}`)
            console.log('=' .repeat(60))
            
            const toyReviews = await reviewService.getReviewsWithToysAndUsers({ toyId })
            console.log(`Found ${toyReviews.length} review(s) for this toy:`)
            
            toyReviews.forEach((review, index) => {
                console.log(`\n${index + 1}. "${review.txt}" - by ${review.user.fullname}`)
            })
        }
        
        // Demo 3: Get reviews with limit
        console.log(`\n\n📝 Demo 3: Latest 2 Reviews`)
        console.log('=' .repeat(60))
        
        const limitedReviews = await reviewService.getReviewsWithToysAndUsers({ limit: 2 })
        limitedReviews.forEach((review, index) => {
            console.log(`\n${index + 1}. Review: "${review.txt}"`)
            console.log(`   Toy: ${review.toy.name}`)
            console.log(`   User: ${review.user.fullname}`)
        })
        
        // Demo 4: Show aggregation statistics
        console.log(`\n\n📈 Demo 4: Aggregation Statistics`)
        console.log('=' .repeat(60))
        console.log(`Total Reviews: ${allReviews.length}`)
        
        const toyCounts = {}
        const userCounts = {}
        
        allReviews.forEach(review => {
            toyCounts[review.toy.name] = (toyCounts[review.toy.name] || 0) + 1
            userCounts[review.user.fullname] = (userCounts[review.user.fullname] || 0) + 1
        })
        
        console.log('\nReviews per Toy:')
        Object.entries(toyCounts).forEach(([toy, count]) => {
            console.log(`  ${toy}: ${count} review(s)`)
        })
        
        console.log('\nReviews per User:')
        Object.entries(userCounts).forEach(([user, count]) => {
            console.log(`  ${user}: ${count} review(s)`)
        })
        
        console.log('\n✅ Aggregation Demo Completed Successfully!')
        console.log('\n🔗 API Endpoints Available:')
        console.log('  GET /api/review/aggregate - All reviews with toys and users')
        console.log('  GET /api/review/aggregate?toyId=<id> - Reviews for specific toy')
        console.log('  GET /api/review/aggregate?userId=<id> - Reviews by specific user')
        console.log('  GET /api/review/aggregate?limit=<number> - Limit results')
        
    } catch (error) {
        logger.error('Demo aggregation failed:', error)
        console.error('❌ Demo failed:', error.message)
    }
}

// Run the demo
demoAggregation().then(() => {
    console.log('\n🎉 Demo finished')
    process.exit(0)
}).catch((error) => {
    console.error('Demo failed:', error)
    process.exit(1)
})
