'use strict';
process.env.SECRET = "toes";
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const {userData, requestsData} = require('../src/tests-data.js');

let usersTokens = [];
let usersIDs = [];
let requestID =[];

beforeAll(async () => {
    //create users [user 1]
    let responseUser1 = await mockRequest.post('/signup').send(userData[0]);
    usersIDs.push(responseUser1.body.user._id);
    usersTokens.push(responseUser1.body.token);
    //create users [user 2]
    let responseUser2 = await mockRequest.post('/signup').send(userData[1]);
    usersIDs.push(responseUser2.body.user._id);
    usersTokens.push(responseUser2.body.token);
    //create requests
    let responseRequest;
    // user 1 Requests
    // request 1
    responseRequest = await mockRequest.post('/request').send(requestsData[0]).set('Authorization', usersTokens[0]);
    requestID.push(responseRequest.body._id);
    // request 2
    responseRequest = await mockRequest.post('/request').send(requestsData[1]).set('Authorization', usersTokens[0]);
    requestID.push(responseRequest.body._id);
    // request 3
    responseRequest = await mockRequest.post('/request').send(requestsData[2]).set('Authorization', usersTokens[0]);
    requestID.push(responseRequest.body._id);
     // user 2 Requests
    // request 4
    responseRequest = await mockRequest.post('/request').send(requestsData[3]).set('Authorization', usersTokens[1]);
    requestID.push(responseRequest.body._id);
    // request 5
    responseRequest = await mockRequest.post('/request').send(requestsData[4]).set('Authorization', usersTokens[1]);
    requestID.push(responseRequest.body._id);
    // request 6
    responseRequest = await mockRequest.post('/request').send(requestsData[5]).set('Authorization', usersTokens[1]);
    requestID.push(responseRequest.body._id);
    //request 7
    responseRequest = await mockRequest.post('/request').send(requestsData[6]).set('Authorization', usersTokens[0]);
    requestID.push(responseRequest.body._id);
    });
//Testing for '/request' route
describe(' Tests `/request` route', () => {
    //getAllRequests 
    it('should return all request for user1 and user2', async () => {
        //for 1st user
        const getUser1Request = await mockRequest.get('/request').set('Authorization', usersTokens[0]);
        expect(getUser1Request.status).toBe(200);
        expect(getUser1Request.body.length).toEqual(4);
        //for 2nd user
        const getUser2Request = await mockRequest.get('/request').set('Authorization', usersTokens[1]);
        expect(getUser2Request.status).toBe(200);
        expect(getUser2Request.body.length).toEqual(3);
    });
    //getOneRequest
    it('should return one request according to the request id', async () => {
        const getOneRequest = await mockRequest.get(`/request/${requestID[1]}`).set('Authorization', usersTokens[0]);
        expect(getOneRequest.status).toBe(200);
        expect(getOneRequest.body._id).toEqual(requestID[1]);
    });
    //updateRequest
    it('should update request data', async () => {
        requestsData[0] = {
            keyword: 'science',
            category: 'Study Group',
            description: 'need partner to study with me',
        }
        const updateRequest = await mockRequest.put(`/request/${requestID[0]}`).set('Authorization', usersTokens[0])
            .send(requestsData[0]);
        expect(updateRequest.status).toBe(200);
        expect(updateRequest.body.keyword).toEqual('science');
    });
    it('should throw error', async () => {
        const updateRequest = await mockRequest.put(`/request/`).set('Authorization', usersTokens[0]);
        expect(updateRequest.status).toBe(404);
        });
    //deleteRequest
    it('should delete request', async () => {
        //(get requestID[4])
        let removedRequestID = requestID[4];
        const deleteRequest = await mockRequest.delete(`/request/${requestID[4]}`).set('Authorization', usersTokens[1]);
        const userRequest2 = await mockRequest.get(`/request/${removedRequestID}`).set('Authorization', usersTokens[1]);
        expect(deleteRequest.status).toBe(200);
        expect(userRequest2.body).toEqual(null);
    });
    it('should throw error', async () => {
        const deleteRequest = await mockRequest.delete(`/request/${requestID[4]}`).set('Authorization', usersTokens[0]);
        expect(deleteRequest.status).toBe(500);
        });
});



