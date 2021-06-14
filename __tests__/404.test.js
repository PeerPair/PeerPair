'use strict';
process.env.SECRET = "toes";
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);


//Testing for '/notfound' route
describe(' Tests `/notfound` route', () => {
    it('should return 404 status', async () => {
        const notfound = await mockRequest.get(`/notfound`);
        expect(notfound.status).toBe(404);
    })
    //Testing for bad method request route
    it('should return 404 status', async () => {
        const badMethodRequest = await mockRequest.post('/');
        expect(badMethodRequest.status).toBe(404);
    })
});
