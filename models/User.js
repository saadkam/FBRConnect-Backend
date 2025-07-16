import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fbrToken: { type: String }, // stored securely per user
}, { timestamps: true });

export default mongoose.model('User', userSchema);
