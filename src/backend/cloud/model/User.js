import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    userLocalId: {
        
    },
}, {timestamps: true})

export const User = mongoose.model("User", userSchema)

