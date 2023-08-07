import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        enum: ['year','branch','college','other']
    },
    players:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'player'
    }],
    numberOfMatches:{
        type: Number,
        default: 0
    },
    wins:{
        type: Number,
        default: 0
    },
    loses: {
        type: Number,
        default: 0
    },
    draw: {
        type: Number,
        default: 0
    },
    goals: {
        type: Number,
        default: 0
    },
    cleanSheets: {
        type: Number,
        default: 0
    }
})

const team = mongoose.model('team', teamSchema)

export default team;