import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string
    email: string
    password: string
    fullname: string
    followers: Array<any>
    following: Array<any>
    profileImg: string
    coverImg: string
    bio: string
    link: string
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,  
            ref: "User",
            default: []

        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,  
            ref: "User",
            default: []

        }
    ],
    profileImg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User