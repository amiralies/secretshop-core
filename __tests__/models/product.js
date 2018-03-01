import mongoose from 'mongoose';
import '../../src/models';

const Product = mongoose.model('Product');

jest.setTimeout(10000);

const mockDoc = {
  name: 'Dunlop jazz iii',
  description: 'Small guitar pick',
  unitsInStock: 45,
  unitPrice: 5000,
};

describe('Product model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/secretshopTEST');
  });

  it('should fail on adding mock doc without a required field', async () => {
    // here we only test with missing unit price, assume it will behave same with others
    const inCompleteMockDoc = {
      name: 'Dunlop jazz iii',
      description: 'Small guitar pick',
      unitsInStock: 45,
    };
    const product = new Product(inCompleteMockDoc);
    try {
      await product.save();
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.name).toBe('ValidationError');
    }
  });

  it('should add mock doc to collection', async () => {
    const product = new Product(mockDoc);
    const savedProduct = await product.save();
    expect(savedProduct).toBeDefined();
    expect(savedProduct._id).toBeDefined(); // eslint-disable-line  no-underscore-dangle
    expect(savedProduct.productId).toBeDefined();
    expect(savedProduct.name).toBe(mockDoc.name);
    expect(savedProduct.description).toBe(mockDoc.description);
    expect(savedProduct.unitsInStock).toBe(mockDoc.unitsInStock);
    expect(savedProduct.unitsInStock).toBe(mockDoc.unitsInStock);
    expect(savedProduct.dateAdded).toBeDefined();
  });

  test('check incremental product ids', async () => {
    const firstMockDoc = Object.assign({}, mockDoc, { name: 'Dunlop jazz iii Kirk Hammet' });
    const secondMockDoc = Object.assign({}, mockDoc, { name: 'Dunlop jazz iii Eric Johnson' });
    const firstProduct = await new Product(firstMockDoc).save();
    const secondProduct = await new Product(secondMockDoc).save();
    const productIdDifference = secondProduct.productId - firstProduct.productId;
    expect(productIdDifference).toBe(1);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
});
