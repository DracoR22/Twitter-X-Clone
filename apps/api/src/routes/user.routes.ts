import express from "express"
import { followUnfollowUser, getUserProfile } from "../controllers/user.controller"
import { protectedRoute } from "../middleware/protected-route"

const userRouter = express.Router()

userRouter.get("/profile/:username", protectedRoute, getUserProfile)
userRouter.get("/suggested", protectedRoute)
userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)
userRouter.post("/update", protectedRoute)

export default userRouter