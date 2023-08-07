import tournament from '../../models/Tournament.js'

export const createTournament = async(req,res) => {
    try {
        const {type, startYear, endYear, name, schedule, teams, status} = req.body;
        
        if(!type || !startYear || !name ){
            return res.status(400).send({
                success: false,
                message: 'Insufficient details to create a tournament'
            })
        }

        if(status&&status!='upcoming'&&status!='ongoing'&&status!='ended'){
            return res.status(400).send({
                success: false,
                message: 'Invalid status'
            })
        }

        await tournament.create({
            type,
            startYear,
            endYear,
            name,
            schedule,
            teams,
            status
        })

        return res.status(200).send({
            success: true,
            message: 'Tournament created'
        })
        
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const addTeams = async(req,res) => {
    try {
        const id = req.params.id;
        const {teams} = req.body;

        const Tournament = await tournament.findById(id);

        if(!Tournament){
            return res.status(404).send({
                success: false,
                message: 'Tournament does not exist'
            })
        }

        teams.forEach(team => {
            if(!Tournament.teams.includes(team)){
                Tournament.teams.push(team);
            }
        });

        Tournament.save();

        return res.status(200).send({
            success: true,
            message: 'Teams added into the tournament'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const changeTournamentStatus = async(req,res) => {
    try {
        const id = req.params.id;
        const {status} = req.body;

        if(status!='upcoming'&&status!='ongoing'&&status!='ended'){
            return res.status(400).send({
                success: false,
                message: 'Invalid status'
            })
        }
        const Tournament = await tournament.findById(id);
        if(!Tournament){
            return res.status(404).send({
                success: false,
                message: 'Tournament does not exist'
            })
        }
        Tournament.status = status;
        Tournament.save();

        return res.status(200).send({
            success: true,
            message: 'Status of Tournament changed'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const updateTournamentDetails = async(req,res) => {
    try {
        const id = req.params.id;
        const dataToUpdate = req.body;

        const Tournament = await tournament.findOneAndUpdate(
            { _id: id},
            { $set: dataToUpdate},
            { new: true}
        );

        if(!Tournament){
            return res.status(404).send({
                success: false,
                message: 'Tournament not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Tournament updated successfully'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getTournamentDetails = async(req,res) => {
    try {
        const id = req.params.id;

        const tournamentDetails = await tournament.findById(id).populate({
            path:'teams',
            populate:{
                path: 'players'
            }
        });

        if(!tournament){
            return res.status(404).send({
                success: false,
                message: 'Tournament not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Tournament details fetched successfully',
            tournamentDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getTournaments = async(req,res) => {
    try {
        const status = req.params.status;

        if(!status) return res.status(400).send({success: false, message: 'Status is empty'})

        if(status!='all'&&status!='upcoming'&&status!='ongoing'&&status!='ended'){
            return res.status(400).send({
                success: false,
                message: 'Invalid status'
            })
        }
        if(status==='all'){
            const tournamentList = await tournament.find({})
            return res.status(200).send({
                success: false,
                tournamentList
            })
        }
        else{
            const tournamentList = await tournament.find({status})
            return res.status(200).send({
                success: true,
                tournamentList
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}