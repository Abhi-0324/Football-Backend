import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema({
    name: {
        type: String 
    }
})

const branch = mongoose.model('branch', branchSchema)

export default branch;