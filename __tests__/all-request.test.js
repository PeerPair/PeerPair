'use strict';

process.env.SECRET = "toes";

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

const {userData, requestsData} = require('../src/tests-data.js');

let usersTokens = [];
let usersIDs = [];

let requestID =[];


    describe(' Tests `/allRequests` rout', () => {
    

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

        
        it('should return all `unaccepted requests` in database', async () => {

          //ARRANGE
          //user1 submits request of user2 
          let user2Req = requestID[3];
           await mockRequest.put(`/submit/${user2Req}/`).set('Authorization', usersTokens[0]);

          //user2 accepts user1's submition
           await mockRequest.put(`/accept/${user2Req}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[1]);

          //ACTION
          //user1 gets all 'unaccepted requests' in db
          const response = await mockRequest.get('/allRequest').set('Authorization', usersTokens[1]);

          expect(response.status).toBe(200);
          expect(response.body.length).toBe(6);
        });
      });
