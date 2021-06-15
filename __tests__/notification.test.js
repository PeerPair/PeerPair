'use strict';

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

describe('The notification route', ()=>{
        it('Should Push to the new notification array when a request has a new submitter ', async()=>{
            let user2Req = requestID[3];
           await mockRequest.put(`/submit/${user2Req}/`).set('Authorization', usersTokens[0]);
           let submitterID = usersIDs[0];
           let response = await mockRequest.put(`/accept/${user2Req}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[1]);
           let notificationResponse = await mockRequest.get(`/myNotification/${usersIDs[0]}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[0]);
           jest.setTimeout(() => {
            expect(notificationResponse.status).toBe(200);
            expect(notificationResponse.body.newMessages[0]).toBeTruthy();
            expect(notificationResponse.body.all.length).toBe(0);
        }, 3000);
        })
        it('Should push the old notification to the old notification array', async()=>{
            let submitterID = usersIDs[0];
            let notificationResponse = await mockRequest.get(`/myNotification/${usersIDs[0]}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[0]);
            jest.setTimeout(() => {
            expect(notificationResponse.status).toBe(200);
            expect(notificationResponse.body.newMessages.length).toBe(0);
            expect(notificationResponse.body.all.length).toBe(1);
        }, 3000);

        })
        it('Should throw an error if access was denied', async()=>{
            let submitterID = usersIDs[1];
            let notificationResponse = await mockRequest.get(`/myNotification/${usersIDs[1]}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[0]);
            jest.setTimeout(() => {
            expect(notificationResponse.status).toBe(500);
            expect(notificationResponse.error).toBeTruthy();
        }, 3000);
        })
})

