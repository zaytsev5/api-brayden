import app from './app';

import { expect } from 'chai';
import { agent as request } from 'supertest';
import { describe, it } from 'mocha';

describe('Index Route', () => {
  it('should GET', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(res.body.message).to.equal('Server is running');
  });
});
