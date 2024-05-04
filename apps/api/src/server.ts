import { app } from "./app"
import dotenv from "dotenv"
import connectDB from "./db/connect-mongo"
import { v2 as cloudinary } from "cloudinary";

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Create Server
app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})