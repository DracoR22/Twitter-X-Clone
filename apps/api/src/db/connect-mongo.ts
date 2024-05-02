import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error: any) {
        console.log(`Error conneting to MongoDB: ${error.message}`)
    }
}

export default connectDB