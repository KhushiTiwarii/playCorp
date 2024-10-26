import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./Routes/auth.js";
dotenv.config()
const app = express()
const port = process.env.PORT || 8000
// CORS options
const corsOptions = {
    origin: true
}
app.get('/', (req, res) => {
    res.send("API is working")
})
// DB connection
mongoose.set("strictQuery", false)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB database is connected");
    } catch (error) {
        console.log("MongoDB database connection failed");
    }
}
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// Routes
app.use('/api/v1/auth', authRouter);
app.listen(port, () => {
    connectDB();
    console.log("Server is running on port " + port);
})