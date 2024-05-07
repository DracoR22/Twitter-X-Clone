import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { ErrorHandler, generateTokenAndSetCookie } from "@twitter-clone/utils";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs"
import User from "../models/user.model";

export const signupUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const err = validationResult(req) // Validate req.body

        if (!err.isEmpty()) {
            return next(new ErrorHandler(err.array()[0].msg, 400))
        }

        const { fullname, username, email, password } = req.body

        const existingUser = await User.findOne({ username })

        if (existingUser) {
            return next(new ErrorHandler('Username is already taken', 400))
        }

        const existingEmail = await User.findOne({ email })

        if (existingEmail) {
            return next(new ErrorHandler('Email is already taken', 400))
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(password, salt)

        // Create The User
        const newUser = await User.create({
            fullname,
            username,
            email,
            password: hashedPassword
        })

        if (newUser) {
          generateTokenAndSetCookie(newUser._id, res, process.env.JWT_SECRET!)

          res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg
          })
        } else {
            return next(new ErrorHandler('Invalid user data', 400))
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const err = validationResult(req) // Validate req.body

        if (!err.isEmpty()) {
            return next(new ErrorHandler(err.array()[0].msg, 400))
        }

        const { username, password } = req.body

        const user = await User.findOne({ username })

        // Validate password
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

        if (!user || !isPasswordCorrect) {
            return next(new ErrorHandler('Invalid username or password', 400))
        }

        generateTokenAndSetCookie(user._id, res, process.env.JWT_SECRET!)

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })

        res.status(200).json({ 
            success: true,
            message: "Logged out succesfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getMe = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id

        const user = await User.findById(userId).select("-password")

        res.status(200).json(user)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})