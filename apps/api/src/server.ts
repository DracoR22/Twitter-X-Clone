import { app } from "./app"
import dotenv from "dotenv"

dotenv.config()

// Create Server
app.listen(process.env.PORT, () => {
    // connectDB()
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})