import mongoose from "mongoose";

const database = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ MongoDB connection established successfully.");
    } catch (error) {
        console.log("Failed to connect to MongoDB database:", error.message);
    }
}
export default database