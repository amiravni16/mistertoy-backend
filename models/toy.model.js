import mongoose from 'mongoose'

const toySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    labels: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Number,
        default: Date.now
    },
    inStock: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    },
    ageRange: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    owner: {
        _id: {
            type: String,
            required: true
        },
        fullname: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: false // We're using createdAt as Number
})

export const Toy = mongoose.model('Toy', toySchema)
