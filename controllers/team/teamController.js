import team from './../../models/Team.js';

export const createTeam = async(req,res) => {
    try {
        const {name, type} = req.body;

        if(!name || !type)  return res.status(400).send({success: false, message: 'Insufficient information'})

        if(type.toLowerCase()!='year'&&type.toLowerCase()!='branch'&&type.toLowerCase()!='college'&&type.toLowerCase()!='other'){
            return res.status(400).send({
                success: false,
                message: 'Invalid Team type'
            })
        }
        const teamExists = await team.findOne({name});

        if(teamExists){
            return res. status(400).send({
                success: false,
                message: 'Team already exists'
            })
        }

        team.create({
            name,
            type
        })

        return res.status(200).send({
            success: true,
            message: 'Team created'
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const addPlayersInTeam = async(req,res) => {
    try {
        const id = req.params.id;

        const {players} = req.body;

        const Team = await team.findById(id);

        if(!Team){
            return res.status(404).send({
                success: false,
                message: 'Team not found'
            })
        }

        players.forEach(playerId => {
            if(!Team.players || !Team.players.includes(playerId)){
                Team.players.push(playerId)
            }
        });

        Team.save();
        console.log(Team)
        return res.status(200).send({
            success: true,
            message: 'Players added successfully'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getTeamDetails = async(req,res) => {
    try {
        const id = req.params.id;

        const teamDetails = await team.findById(id).populate('players');

        if(!teamDetails){
            return res.status(404).send({
                success: false,
                message: 'Team Not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Team details fetched successfully',
            teamDetails
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}