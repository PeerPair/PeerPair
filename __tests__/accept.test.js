'use strict';

process.env.SECRET = "toes";

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

const {userData, requestsData} = require('../src/tests-data.js');

let usersTokens = [];
let usersIDs = [];

let requestID =[];


    describe(' Tests routs related to request acception', () => {
    

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

        
        it('["/accept/:id] : should accept a certain submition and return the updated request info', async () => {

          //ARRANGE
          //user1 submits request of user2 
          let user2Req = requestID[3];
           await mockRequest.put(`/submit/${user2Req}/`).set('Authorization', usersTokens[0]);
           let submitterID = usersIDs[0];

          //ACTION
         //user2 accepts user1's submition
           let response = await mockRequest.put(`/accept/${user2Req}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[1]);

           //ASSERT
          expect(response.status).toBe(200);
          expect(response.body.accepted).toBeTruthy();
          expect(response.body.current_partner).toEqual(submitterID);

        });
        it('Should throw error if access was not allowed', async () => {

          //ARRANGE
          //user1 submits request of user2 
          let user2Req = requestID[1];
           await mockRequest.put(`/submit/${user2Req}/`).set('Authorization', usersTokens[0]);
           let submitterID = usersIDs[0];

          //ACTION
         //user2 accepts user1's submition
           let response = await mockRequest.put(`/accept/${user2Req}/`).send({id: usersIDs[0]}).set('Authorization', usersTokens[0]);
           //ASSERT
          expect(response.status).toBe(500);
        });


        it('["/cancelaccept/:id]: should cancel the acception of certain submition and return the updated request info', async () => {

          //ARRANGE
          //user1 submits request of user2 
          let user2Req = requestID[4];
           await mockRequest.put(`/submit/${user2Req}/`).set('Authorization', usersTokens[0]);
           let submitterID = usersIDs[0];

           //user2 accepts user1 submition
           await mockRequest.put(`/accept/${user2Req}/`).send({id: submitterID}).set('Authorization', usersTokens[1]);

          //ACTION
         //user2 canceles his accepts for user1 submition
           let response = await mockRequest.put(`/cancelaccept/${user2Req}/`).set('Authorization', usersTokens[1]);

           //ASSERT
          expect(response.status).toBe(200);
          expect(response.body.accepted).toBeFalsy();
          expect(response.body.current_partner).toEqual('none');

        });
      });