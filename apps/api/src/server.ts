import { app } from "./app"
import dotenv from "dotenv"
import connectDB from "./db/connect-mongo"

dotenv.config()

// Create Server
app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})