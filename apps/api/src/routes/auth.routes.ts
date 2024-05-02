import express from "express"
import { getMe, loginUser, logoutUser, signupUser } from "../controllers/auth.controller"
import { loginValidation, registerValidation } from "../validations/auth.validation"
import { protectedRoute } from "../middleware/protected-route"

const authRouter = express.Router()

authRouter.get("/me", protectedRoute, getMe)
authRouter.post("/signup", registerValidation, signupUser)
authRouter.post("/login", loginValidation, loginUser)
authRouter.post("/logout", logoutUser)

export default authRouter