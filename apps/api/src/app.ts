import express from "express"
import { ErrorMiddleware } from "./middleware/error"
import authRouter from "./routes/auth.routes"

export const app = express()

app.use(express.json({ limit: "50mb" }))

// Routes
app.use("/v1/api/auth", authRouter)

// Test Api
app.get('/', async (req, res) => {
    res.send('Hello World')
})

app.use(ErrorMiddleware)