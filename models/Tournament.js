import mongoose, { Schema } from "mongoose";

const tournamentSchema = new Schema({
    type:{
        type: String,
        enum: ['interyear', 'interbranch', 'friendly', 'other']
    },
    startYear:{
        type: Number,
        required: true
    },
    endYear:{
        type: Number
    },
    name:{
        type: String
    },
    schedule:{
        type: String 
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'match'
    }],
    winner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'team'
    },
    runnerUp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team'
    },
    status:{
        type: String,
        enum: ['upcoming','ongoing','ended'],
        default: 'upcoming'
    }
})

const tournament = mongoose.model('tournament', tournamentSchema)

export default tournament;