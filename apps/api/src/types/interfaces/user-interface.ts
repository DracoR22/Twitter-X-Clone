import { Document } from "mongoose"

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