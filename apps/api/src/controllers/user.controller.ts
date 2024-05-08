import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { ErrorHandler } from "@twitter-clone/utils";
import { Types } from 'mongoose';
import User from "../models/user.model";
import Notification from "../models/notification.model";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username }).select("-password")

        if (!user) {
            return next(new ErrorHandler('User not found', 404))
        }

        res.status(200).json(user)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const followUnfollowUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        // Convert id to ObjectId
        const id = new Types.ObjectId(req.params.id);

        const userToModify = await User.findById(id)

        const currentUser = await User.findById(req.user?._id)


        if (req.params.id === req.user?._id.toString()) {
            return next(new ErrorHandler('You cannot follow or unfollow yourself', 400))
        }

        if (!userToModify || !currentUser) {
            return next(new ErrorHandler('User not found', 404))
        }

        // See if current user is already following that user
        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user?._id }}) // Delete the current user from requested user followers
            await User.findByIdAndUpdate(req.user?.id, { $pull: { following: id }})  // Delete the following from current user account

            res.status(200).json({ success: true, message: 'User unfollowed succesfully'})
        } else {
            // Follow the user

            await User.findByIdAndUpdate(id, { $push: { followers: req.user?._id }}) // Set the follower as the current user
            await User.findByIdAndUpdate(req.user?.id, { $push: { following: id }}) // Set the following as the user followed

            // Send notification
            const newNotification = new Notification({
                type: 'follow',
                from: req.user?._id,
                to: userToModify._id
            })

            await newNotification.save()

            res.status(200).json({ success: true, message: 'User followed succesfully'})
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getSuggestedUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id

        const usersFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            {$sample: { size: 10 }}
        ])

        const filteredUsers = users.filter((user) => !usersFollowedByMe?.following.includes(user._id))
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach(user => user.password = null)

        res.status(200).json(suggestedUsers)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))   
    }
})

export const updateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const err = validationResult(req) // Validate req.body

        // if (!err.isEmpty()) {
        //     return next(new ErrorHandler(err.array()[0].msg, 400))
        // }

        const { fullname, username, email, currentPassword, newPassword, bio, link } = req.body

        let { profileImg, coverImg } = req.body

        const userId = req.user?._id

        let user = await User.findById(userId)

        if (!user) {
            return next(new ErrorHandler('User not found', 404)) 
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return next(new ErrorHandler('Please provide both current password and new password', 400)) 
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if (!isMatch) {
                return next(new ErrorHandler('Current password is incorrect', 400))
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)

            user.password = hashedPassword
        }

        if (profileImg) {
           if (user.profileImg) {
               await cloudinary.uploader.destroy(user.profileImg.split('/').pop()!.split('.')[0])
           }

           const uploadedResponse = await cloudinary.uploader.upload(profileImg, { folder: 'twitter-clone/users', width: 150, height: 150, crop: 'fill'})
           profileImg = uploadedResponse.secure_url
        }

        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop()!.split('.')[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg, { folder: 'twitter-clone/users', width: 150, height: 150, crop: 'fill'})
            coverImg = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname
        user.username = username || user.username
        user.email = email || user.email
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImg = profileImg || user.profileImg
        user.coverImg = coverImg || user.coverImg

        user = await user.save()

        user.password = ''

        res.status(200).json(user)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))   
    }
})