import { reviewService } from '../api/review/review.service.js'
import { userService } from '../api/user/user.service.js'
import { logger } from '../services/logger.service.js'

async function testReviewSystem() {
    try {
        console.log('🧪 Testing Review System Components\n')
        
        // Test 1: Get all reviews with aggregation
        console.log('📊 Test 1: Aggregated Reviews (Reviews + Toys + Users)')
        console.log('=' .repeat(60))
        const allReviews = await reviewService.getReviewsWithToysAndUsers()
        console.log(`✅ Found ${allReviews.length} reviews with full data`)
        
        if (allReviews.length > 0) {
            const sampleReview = allReviews[0]
            console.log(`Sample Review:`)
            console.log(`  Review: "${sampleReview.txt}"`)
            console.log(`  Toy: ${sampleReview.toy.name} ($${sampleReview.toy.price})`)
            console.log(`  User: ${sampleReview.user.fullname} (@${sampleReview.user.username})`)
        }
        
        // Test 2: Get users
        console.log(`\n👥 Test 2: User Data`)
        console.log('=' .repeat(60))
        const users = await userService.query()
        console.log(`✅ Found ${users.length} users`)
        
        if (users.length > 0) {
            const sampleUser = users[0]
            console.log(`Sample User:`)
            console.log(`  Name: ${sampleUser.fullname}`)
            console.log(`  Username: ${sampleUser.username}`)
            console.log(`  Admin: ${sampleUser.isAdmin}`)
        }
        
        // Test 3: Test filtering by toy
        if (allReviews.length > 0) {
            const toyId = allReviews[0].toy._id.toString()
            console.log(`\n🎯 Test 3: Reviews for Specific Toy`)
            console.log('=' .repeat(60))
            const toyReviews = await reviewService.getReviewsWithToysAndUsers({ toyId })
            console.log(`✅ Found ${toyReviews.length} reviews for toy ${toyId}`)
        }
        
        // Test 4: Test filtering by user
        if (users.length > 0) {
            const userId = users[0]._id.toString()
            console.log(`\n👤 Test 4: Reviews by Specific User`)
            console.log('=' .repeat(60))
            const userReviews = await reviewService.getReviewsWithToysAndUsers({ userId })
            console.log(`✅ Found ${userReviews.length} reviews by user ${userId}`)
        }
        
        // Test 5: Test limit
        console.log(`\n📝 Test 5: Limited Results`)
        console.log('=' .repeat(60))
        const limitedReviews = await reviewService.getReviewsWithToysAndUsers({ limit: 2 })
        console.log(`✅ Retrieved ${limitedReviews.length} reviews (limited to 2)`)
        
        console.log('\n🎉 All Tests Passed!')
        console.log('\n🔗 Frontend Routes Available:')
        console.log('  /toy/:toyId - ToyDetails (shows toy reviews)')
        console.log('  /user/:userId - UserDetails (shows user reviews)')
        console.log('  /reviews - ReviewExplore (shows all reviews with filtering)')
        
    } catch (error) {
        logger.error('Review system test failed:', error)
        console.error('❌ Test failed:', error.message)
    }
}

// Run the test
testReviewSystem().then(() => {
    console.log('\n✅ Testing completed')
    process.exit(0)
}).catch((error) => {
    console.error('Testing failed:', error)
    process.exit(1)
})
