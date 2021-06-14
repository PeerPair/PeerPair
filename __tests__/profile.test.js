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

//Testing for '/profile/id' route
describe(' Tests `/profile/id` route', () => {
    //when user1 go to his own profile
    it('should redirect user1 to his homepage', async () => {
        const getUser1Profile = await mockRequest.get(`/profile/${usersIDs[0]}`).set('Authorization', usersTokens[0]);
        //302 for redirect
        expect(getUser1Profile.status).toBe(302);
        expect(getUser1Profile.redirect).toBe(true);
    });
    //when user1 go to user2 profile
    it('should render profile for user2', async () => {
        const getUser2Profile = await mockRequest.get(`/profile/${usersIDs[1]}`).set('Authorization', usersTokens[0]);
        console.log(getUser2Profile.body);
        expect(getUser2Profile.status).toBe(200);
        expect(getUser2Profile.redirect).toBe(false);
        expect(getUser2Profile.body.first_name).toEqual(userData[1].first_name);
        expect(getUser2Profile.body.last_name).toEqual(userData[1].last_name);
        expect(getUser2Profile.body.age).toEqual(userData[1].age);
        expect(getUser2Profile.body.interests).toEqual(userData[1].interests);
    });
});