import express from "express"
import { protectedRoute } from "../middleware/protected-route"
import { deleteNotification, deleteNotifications, getNotifications } from "../controllers/notification.controller"

const notificationRouter = express.Router()

notificationRouter.get("/get", protectedRoute, getNotifications)
notificationRouter.delete("/delete", protectedRoute, deleteNotifications)
notificationRouter.delete("/delete/:id", protectedRoute, deleteNotification)

export default notificationRouter