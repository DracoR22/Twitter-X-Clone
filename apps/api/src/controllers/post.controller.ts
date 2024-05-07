import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { validationResult } from "express-validator";
import { ErrorHandler } from "@twitter-clone/utils";
import User from "../models/user.model";
import Post from "../models/post.model";
import { v2 as cloudinary } from "cloudinary"
import Notification from "../models/notification.model";

export const createPost = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const err = validationResult(req) // Validate req.body

        if (!err.isEmpty()) {
            return next(new ErrorHandler(err.array()[0].msg, 400))
        }

        const { text } = req.body
        let { img } = req.body

        const userId = req.user?.id.toString()

        const user = await User.findById(userId)

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        if (!text && !img) {
            return next(new ErrorHandler("Either text or img is required", 400))
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img, { folder: 'twitter-clone/posts' })
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save()

        res.status(201).json(newPost)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))   
    }
})

export const deletePost = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return next(new ErrorHandler('Post nort found', 404))
        }

        if (post.user.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler('You are not authorized to delete this post', 401))
        }

        if (post.img) {
            const imgId = post.img.split('/').pop()!.split('.')[0]
            await cloudinary.uploader.destroy(imgId)
        }

        await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({ success: true, message: 'Post deleted succesfully' })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))  
    }
})

export const commentPost = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const err = validationResult(req) // Validate req.body

        if (!err.isEmpty()) {
            return next(new ErrorHandler(err.array()[0].msg, 400))
        }

        const { text } = req.body
        const postId = req.params.id
        const userId = req.user?._id

        if (!text) {
            return next(new ErrorHandler('Text field is required', 400))
        }

        const post = await Post.findById(postId)

        if (!post) {
            return next(new ErrorHandler('Post not found', 404))
        }

        const comment = { user: userId, text }

        post.comments.push(comment)

        await post.save()

        res.status(200).json(post)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const likeUnlikePost = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id
        const postId = req.params.id

        const post = await Post.findById(postId)

        if (!post) {
            return next(new ErrorHandler('Post not found', 404))
        }

        const userLikedPost = post.likes.includes(userId)

        if (userLikedPost) {
           // Unlike Post
           await Post.updateOne({ _id: postId }, { $pull: { likes: userId }})
           await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId }})

           const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString())
           
           res.status(200).json(updatedLikes)
        } else {
          // Like Post
          post.likes.push(userId)

          await Post.updateOne({ _id: postId }, { $push: { likes: userId }})
          await User.updateOne({ _id: userId }, { $push: { likedPosts: postId }})

          const notification = new Notification({
            from: userId,
            to: post.user,
            type: 'like'
          })

          await notification.save()
           
          const updatedLikes = post.likes

          res.status(200).json(updatedLikes)
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const getAllPosts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        if (posts.length === 0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const getLikedPosts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id

        const user = await User.findById(userId)

        if (!user) {
            return next(new ErrorHandler('User not found', 404))
        }

        const likedPosts = Post.find({ _id: { $in: user.likedPosts }}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(likedPosts)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const getFollowingPosts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id

        const user = await User.findById(userId)

        if (!user) {
            return next(new ErrorHandler('User not found', 404))
        }

        const following = user.following

        const feedPosts = await Post.find({ user: { $in: following }}).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(feedPosts)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const getUserPosts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username

        const user = await User.findOne({ username })

        if (!user) {
            return next(new ErrorHandler('User not found.', 404))
        }

        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(posts)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})