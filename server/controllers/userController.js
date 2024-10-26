import User from '../model/User.js';

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.points += points;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  // console.log("Fetching leaderboard");
  try {
    const leaderboard = await User.find({ role: { $ne: 'admin' } }, 'email points role')
      .sort({ points: -1 })
      .limit(10);
    
    // console.log("Leaderboard fetched:", leaderboard);
    res.status(200).json(leaderboard);
  } catch (error) {
    // console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error: error.message });
  }
};
