import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Technical", "Indoor", "Outdoor", "Fun Sports"], 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  participantLimit: { type: Number, required: true },
  description: { type: String },
  scoringCriteria: { type: String }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;