import express, { NextFunction, Request, Response } from "express"
import { ErrorMiddleware } from "./middleware/error"
import authRouter from "./routes/auth.routes"
import cors from "cors"

export const app = express()

app.use(express.json({ limit: "50mb" })) // to parse req.body
app.use(cors({
    origin: "*"
 }))

// Routes
app.use("/v1/api/auth", authRouter)

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