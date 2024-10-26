import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamCode: { type: String, required: true, unique: true },
  teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

const Team = mongoose.model('Team', teamSchema);
export default Team;