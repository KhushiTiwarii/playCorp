import express from 'express';
import { getUser, updateUserPoints, getLeaderboard } from '../controllers/userController.js';

const router = express.Router();

router.get('/board', getLeaderboard);    // Route to get the leaderboard
router.get('/:userId', getUser);               // Route to get user by ID
router.put('/points', updateUserPoints);       // Route to update user points

export default router;
