import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import { PrismaClient } from '@prisma/client';

import app from '../../src/index';

const expect = chai.expect;
chai.use(chaiHttp);

const client = new PrismaClient();

let mockurl1: nock.Scope, mockurl2: nock.Scope;

describe('Integration Tests', () => {
  before(async () => {
    // Seed database
    await client.subscription.create({ data: { topic: 'topic1', url: 'http://mockurl1' } });
    await client.subscription.create({ data: { topic: 'topic1', url: 'http://mockurl2' } });
    await client.subscription.create({ data: { topic: 'topic2', url: 'http://mockurl3' } });

    // Mock urls
    mockurl1 = nock('http://mockurl1')
      .post('/')
      .reply((uri, body) => {
        expect(body).to.deep.equal({
          topic: 'topic1',
          data: {
            message: 'ping'
          }
        });

        return [200, 'Recieved'];
      });

    mockurl2 = nock('http://mockurl2')
      .post('/')
      .reply((uri, body) => {
        expect(body).to.deep.equal({
          topic: 'topic1',
          data: {
            message: 'ping'
          }
        });

        return [200, 'Recieved'];
      });
  });

  describe('POST /subscribe/{topic}', () => {
    it('Should successfully subscribe to a new topic', async () => {
      const topic = 'topic3';
      const data = { url: 'http://mockurl3' };

      const res = await chai.request(app).post(`/subscribe/${topic}`).send(data);

      expect(res.status).to.be.equal(200);
      expect(res.body).to.deep.equal({
        topic: topic,
        url: data.url
      });

      // Ensure data was inserted to db
      const result = await client.subscription.findFirst({ where: { topic: topic } });
      expect(result).to.be.a('Object');
      expect(result.url).to.be.equal(data.url);
    });
    it('Should successfully subscribe to an existing topic using a new url', async () => {
      const topic = 'topic2';
      const data = { url: 'http://mockurl4' };

      const res = await chai.request(app).post(`/subscribe/${topic}`).send(data);

      expect(res.status).to.be.equal(200);
      expect(res.body).to.deep.equal({
        topic: topic,
        url: data.url
      });

      // Ensure data was inserted to db
      const result = await client.subscription.findMany({ where: { topic: 'topic2' } });
      expect(result).to.be.an('Array');
      expect(result.map((x) => x.url)).to.contain(data.url);
    });
    it('Should fail to subscribe to the same topic with the same url twice', async () => {
      const res = await chai
        .request(app)
        .post(`/subscribe/topic1`)
        .send({ url: 'http://mockurl1' });

      expect(res.status).to.be.equal(400);
      expect(res.body).to.deep.equal({
        error: 'Already subscribed!'
      });
    });
  });

  describe('POST /publish/{topic}', () => {
    it('Should successfully send to valid urls', async () => {
      const res = await chai.request(app).post(`/publish/topic1`).send({
        message: 'ping'
      });
      expect(res.status).to.be.equal(200);

      expect(mockurl1.isDone()).to.be.equal(true);
      expect(mockurl2.isDone()).to.be.equal(true);
    });
    it('Should fail if any to send to invalid urls', async () => {
      const res = await chai.request(app).post(`/publish/topic2`).send({
        message: 'ping'
      });
      expect(res.status).to.be.equal(503);
    });
  });

  after(async () => {
    await client.subscription.deleteMany({ where: {} });
  });
});
