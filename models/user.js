import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String 
    },
    email: {
        type: String 
    },
    phone: {
        type: String 
    },
    password:{
        type: String
    }
})

const user = mongoose.model('user', userSchema)

export default user;