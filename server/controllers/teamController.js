import Team from '../model/Team.js';
import User from '../model/User.js';

export const createTeam = async (req, res) => {
  try {
    const { teamCode, teamLeaderId, eventId } = req.body;
    const newTeam = new Team({
      teamCode,
      teamLeader: teamLeaderId,
      members: [teamLeaderId],
      events: [eventId]
    });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinTeam = async (req, res) => {
  try {
    const { teamCode, userId } = req.body;
    const team = await Team.findOne({ teamCode });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in team' });
    }
    
    team.members.push(userId);
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeamsByEvent = async (req, res) => {
  try {
    const teams = await Team.find({ events: req.params.eventId }).populate('members', 'email');
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};