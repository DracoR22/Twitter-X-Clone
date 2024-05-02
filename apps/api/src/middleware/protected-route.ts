import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./catch-async-errors";
import { ErrorHandler } from "@twitter-clone/utils";
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/user.model";

export const protectedRoute = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
     return next(new ErrorHandler("You need to login first", 401))
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

    if (!decoded) {
        return next(new ErrorHandler("Invalid token", 401))
    }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    req.user = user

    next()
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})