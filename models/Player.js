import mongoose, { Schema } from "mongoose";

const playerSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    rollNo:{
        type: String,
        required: true
    },
    branch:{
        type: String
    },
    startYear:{
        type: Number
    },
    endYear:{
        type: Number
    },
    matches: {
        type: Number,
        default: 0
    },
    goals:{
        type: Number,
        default: 0
    },
    assists:{
        type: Number,
        default: 0
    },
    position:{
        type: String 
    },
    image: {
        type: String
    },
    yellowCards:{
        type: Number,
        default: 0
    },
    redCards: {
        type: Number,
        default: 0
    }
})

const player = mongoose.model('player', playerSchema)

export default player;