import mongoose from 'mongoose';
import { Counter } from '../../src/models';

const mockDoc = { _id: 'mockId' };
/* eslint-disable  no-underscore-dangle */
describe('Counter model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/secretshopTEST');
  });

  it('should fail on adding mock doc with no _id', async () => {
    const noIdMockDoc = {};
    const counter = new Counter(noIdMockDoc);
    try {
      await counter.save();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.name).toBe('ValidationError');
    }
  });

  it('should add mock doc to collection', async () => {
    const counter = await new Counter(mockDoc).save();
    expect(counter).toBeDefined();
    expect(counter._id).toBe(mockDoc._id);
    expect(counter.seq).toBe(0);
  });

  it('should increase mockId\'s seq by one', async () => {
    const counter = await Counter.findOne({ _id: mockDoc._id });
    const updatedCounter = await Counter.findByIdAndUpdate(
      { _id: mockDoc._id },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    expect(updatedCounter.seq).toBe(counter.seq + 1);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
});
