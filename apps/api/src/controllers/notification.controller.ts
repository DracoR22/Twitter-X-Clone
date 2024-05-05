import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catch-async-errors";
import { ErrorHandler } from "@twitter-clone/utils";
import Notification from "../models/notification.model";

export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id

        const notification = await Notification.find({ to: userId }).populate({
            path: 'from',
            select: 'username profileImg'
        })

        await Notification.updateMany({ to: userId }, { read: true })

        res.status(200).json(notification)
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const deleteNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id

        await Notification.deleteMany({ to: userId })

        res.status(200).json({ success: true, message: 'Notifications deleted' })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})

export const deleteNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notificationId = req.params._id
        const userId = req.user?._id

        const notification = await Notification.findById(notificationId)

        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404))
        }

        if (notification.to.toString() !== userId.toString()) {
            return next(new ErrorHandler('You are not allowed to delete this notification', 403))
        }

        await Notification.findByIdAndDelete(notificationId)

        res.status(200).json({ success: true, message: 'Notification deleted succesfully' })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500)) 
    }
})