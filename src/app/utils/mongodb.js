// utils/mongodb.js
import mongoose from 'mongoose';


export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error(error)
    }

}