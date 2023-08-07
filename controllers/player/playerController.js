import player from './../../models/Player.js';

export const createPlayer = async(req,res) => {
    try {
        const {name, rollNo, branch, startYear, endYear, position} = req.body;
        const image = req.files;

        if(!name || !rollNo){
            return res.status(400).send({
                success: false,
                message: 'Name and Roll Number are required'
            })
        }

        if(await player.findOne({rollNo}))
        {
            return res.status(400).send({
                success: false,
                message: 'Player is already registered'
            })
        }

        const Player = await player.create({
            name,
            rollNo,
            branch,
            startYear,
            endYear,
            position
        })

        //add profile image here 


        return res.status(200).send({
            success: true,
            message: 'Player created successfully'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const updatePlayer = async(req,res) => {
    try {
        const {name, rollNo, branch, startYear, endYear, position} = req.body;
        const id = req.params.id;
        const image = req.files;

        const Player = await player.findById(id);

        if(!Player){
            return res.status(404).send({
                success: false,
                message: 'Player not found'
            })
        }

        if(name)    Player.name = name;
        if(rollNo)  Player.rollNo = rollNo;
        if(branch)  Player.branch = branch;
        if(startYear)   Player.startYear = startYear;
        if(endYear)     Player.endYear = endYear;
        if(position)    Player.position = position;


        //update profile image here

        Player.save();
        
        return res.status(200).send({
            success: true,
            message: 'Player details updated successfully'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getPlayerDetails = async(req,res) => {
    try {
        const id = req.params.id;

        const playerDetails = await player.findById(id);

        if(!playerDetails){
            return res.status(404).send({
                success: false,
                message: 'Player Not found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Player details fetched successfully',
            playerDetails
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getAllPlayers = async(req,res) => {
    try {
        const {branchYear} = req.params
        let year='', branch='';
        if(branchYear>2000&&branchYear<3000)    year = branchYear
        else if(branchYear!='all')   branch = branchYear

        if(year.length!=0){
            const playersList = await player.find({startYear: year})
            return res.status(200).send({
                success: true,
                playersList
            })
        }
        else if(branch.length!=0){
            const playersList = await player.find({branch})
            return res.status(200).send({
                success: true,
                playersList
            })
        }
        else{
            const playersList = await player.find({})
            return res.status(200).send({
                success: true,
                playersList
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message:'Internal Server Error'
        })
    }
}