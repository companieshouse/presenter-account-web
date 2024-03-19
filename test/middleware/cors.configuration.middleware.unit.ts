import request from 'supertest';
import app from '../../src/app';

describe('CORS Configuration', () => {
    it('Should allow CORS for all origins', async () => {
        const res = await request(app).get('/');
        expect(res.headers['access-control-allow-origin']).toEqual('*');
    });
});
