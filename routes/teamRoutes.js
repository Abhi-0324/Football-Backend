import express from 'express'
import { addPlayersInTeam, createTeam, getTeamDetails } from '../controllers/team/teamController.js';

const router = express.Router();

router.post('/create-team', createTeam);

router.put('/add-players/:id', addPlayersInTeam)

router.get('/:id', getTeamDetails)

export default router;