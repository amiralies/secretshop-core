import mongoose from 'mongoose';
import '../../src/models';

const User = mongoose.model('User');

jest.setTimeout(10000);

const mockDoc = {
  name: 'Jeff Loomis',
  email: 'loomis@live.com',
  password: 'myStrongPassWord',
};

describe('User model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/secretshopTEST');
  });

  it('should fail on adding mock doc without a required field', async () => {
    // here we only test with missing unit price, assume it will behave same with others
    const inCompleteMockDoc = {
      name: 'Jeff Loomis',
      password: 'myStrongPassWord',
    };

    const user = new User(inCompleteMockDoc);
    try {
      await user.save();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.name).toBe('ValidationError');
    }
  });

  it('should add mock doc to collection', async () => {
    const user = await new User(mockDoc).save();
    expect(user._id).toBeDefined(); // eslint-disable-line  no-underscore-dangle
    expect(user.name).toBe(mockDoc.name);
    expect(user.email).toBe(mockDoc.email);
    expect(user.password).toBeDefined();
    expect(user.registeredAt).toBeDefined();
  });

  it('should check password is not stored plainly', async () => {
    const user = await User.findOne({ email: mockDoc.email });
    expect(user.password).not.toBe(mockDoc.password);
  });

  it('should check comparePassword method to return true', async () => {
    const user = await User.findOne({ email: mockDoc.email });
    const isPasswordMatch = await user.comparePassword(mockDoc.password);
    expect(isPasswordMatch).toBeTruthy();
  });

  it('should check comparePassword method to return false', async () => {
    const user = await User.findOne({ email: mockDoc.email });
    const isPasswordMatch = await user.comparePassword('wrongPassword');
    expect(isPasswordMatch).toBeFalsy();
  });

  it('should fail on adding a user with used email', async () => {
    const mockDockWithUsedEmail = {
      name: 'John Petrucci',
      email: 'loomis@live.com',
      password: 'justAnotherStrongPassword',
    };

    const user = new User(mockDockWithUsedEmail);
    try {
      await user.save();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.name).toBe('BulkWriteError');
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
});
