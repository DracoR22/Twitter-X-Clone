import express from "express"
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUser } from "../controllers/user.controller"
import { protectedRoute } from "../middleware/protected-route"
import { updateUserValidation } from "../validations/user.validation"

const userRouter = express.Router()

userRouter.get("/profile/:username", protectedRoute, getUserProfile)
userRouter.get("/suggested", protectedRoute, getSuggestedUser)
userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)
userRouter.post("/update", protectedRoute, updateUserValidation, updateUser)

export default userRouter