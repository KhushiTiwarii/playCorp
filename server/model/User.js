import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  role: { type: String, required: true },
  companyName: { type: String }
});

// // Remove any indexes that might have been created for the old userId field
// userSchema.index({ userId: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);
export default User;