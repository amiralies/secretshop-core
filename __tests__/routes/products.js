import request from 'supertest';
import app from '../../src/app';

const server = request.agent(app);

describe('/products route', () => {
  it('should get list of products with no filter ', async () => {
    const { statusCode, body } = await server.get('/products');
    expect(statusCode).toBe(200);
    expect(body.offset).toBeDefined();
    expect(body.totalResult).toBeDefined();
    expect(body.currentResult).toBeDefined();
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBe(body.currentResult);
  });

  it('should fail on sending negative offset parameter', async () => {
    const { statusCode, body } = await server.get('/products?offset=-1');
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "query" fails because [child "offset" fails because ["offset" must be larger than or equal to 0]]');
  });

  it('should fail on sending string as offset parameter', async () => {
    const { statusCode, body } = await server.get('/products?offset=foo');
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "query" fails because [child "offset" fails because ["offset" must be a number]]');
  });

  it('should fail on sending less than min limit parameter', async () => {
    const { statusCode, body } = await server.get('/products?limit=0');
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "query" fails because [child "limit" fails because ["limit" must be larger than or equal to 1]]');
  });

  it('should fail on sending more than max limit parameter', async () => {
    const { statusCode, body } = await server.get('/products?limit=201');
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "query" fails because [child "limit" fails because ["limit" must be less than or equal to 200]]');
  });

  it('should fail on sending string as offset parameter', async () => {
    const { statusCode, body } = await server.get('/products?limit=foo');
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "query" fails because [child "limit" fails because ["limit" must be a number]]');
  });
});
