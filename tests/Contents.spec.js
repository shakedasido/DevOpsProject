import {expect} from "chai";
import request from 'supertest';
import {app} from '../src/index.js';


describe('Main page', async () =>{
    let server;
    before((done) => {
        server = app.listen(80, done);
    });
    
      after((done) => {
        server.close(done);
    });
    it('Test 1', async () =>{
        const res = await request(app).get('/');
        expect(res.statusCode).to.be.eql(200);
    })
    it('Test 2', async () =>{
        const res = await request(app).get('/3485');
        expect(res.statusCode).to.be.eql(404);
    })
})
// process.exit(0);



