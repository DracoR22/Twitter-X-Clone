import express from "express"
import { signupUser } from "../controllers/auth.controller"
import { registerValidation } from "../validations/auth.validation"

const authRouter = express.Router()

authRouter.post("/signup", registerValidation, signupUser)

export default authRouter