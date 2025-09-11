import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        default: 10000
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema)
