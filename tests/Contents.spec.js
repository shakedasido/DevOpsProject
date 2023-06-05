import {expect} from "chai";
import request from 'supertest';
import app from '../server';

describe('Test suit 1:', () => {
  test('test 1:', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });

  test('test 2:', async () => {
    const res = await request(app).get('/3023');
    expect(res.statusCode).toEqual(404);
  });
});



