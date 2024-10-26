import mongoose from "mongoose";

const judgeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
      },
})

export default mongoose.model("Judge",judgeSchema);