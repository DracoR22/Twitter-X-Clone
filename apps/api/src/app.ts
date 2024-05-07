import express, { NextFunction, Request, Response } from "express"
import { ErrorMiddleware } from "./middleware/error"
import authRouter from "./routes/auth.routes"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes"
import postRouter from "./routes/post.routes"
import notificationRouter from "./routes/notification.routes"

export const app = express()

app.use(express.json({ limit: "50mb" })) // to parse req.body
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
 }))

// Routes
app.use("/v1/api/auth", authRouter)
app.use("/v1/api/users", userRouter)
app.use("/v1/api/posts", postRouter)
app.use("/api/notifications", notificationRouter)

// Test Api
app.get('/', async (req, res) => {
    res.send('Hello World')
})

// Unknown Route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any
    err.statusCode = 404
    next(err)
})


app.use(ErrorMiddleware)