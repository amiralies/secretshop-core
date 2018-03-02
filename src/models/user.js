import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 8;

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now(), required: true },
});

userSchema.pre('save', async function handler(next) {
  const user = this;

  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    } catch (err) {
      return next(err);
    }
  }

  return next();
});

userSchema.methods.comparePassword = async function handler(inputPassword) {
  const user = this;

  try {
    const isMatch = await bcrypt.compare(inputPassword, user.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

export default mongoose.model('User', userSchema);
