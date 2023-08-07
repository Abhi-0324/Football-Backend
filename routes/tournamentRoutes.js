import express from 'express'
import { addTeams, changeTournamentStatus, createTournament, getTournamentDetails, getTournaments, updateTournamentDetails } from '../controllers/tournament/tournamentController.js';

const router = express.Router();

router.post('/new', createTournament)

router.put('/add-teams/:id', addTeams)

router.put('/change-status/:id',changeTournamentStatus)

router.put('/update-tournament/:id', updateTournamentDetails)

router.get('/details/:id', getTournamentDetails)

router.get('/list/:status', getTournaments)

export default router;
