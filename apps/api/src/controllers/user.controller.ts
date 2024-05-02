import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { ErrorHandler } from "@twitter-clone/utils";
import { Types } from 'mongoose';
import User from "../models/user.model";

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

            res.status(200).json({ success: true, message: 'User followed succesfully'})
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})