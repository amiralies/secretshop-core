import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
  refreshToken: { type: 'String', required: true },
});

export default mongoose.model('Session', sessionSchema);
