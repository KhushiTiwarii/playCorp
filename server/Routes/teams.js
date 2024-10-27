import express from 'express';
import { createTeam, joinTeam, getTeam, getTeamsByEvent,getTeamsByUser, getAllTeams } from '../controllers/teamController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createTeam);
router.get('/', getAllTeams);
router.post('/join', joinTeam);
router.get('/:id', getTeam);
router.get('/user/:userId', getTeamsByUser);
router.get('/event/:eventId', getTeamsByEvent);

export default router;