'use strict';

process.env.SECRET = "toes";

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

const {userData, requestsData} = require('../src/tests-data.js');

let usersTokens = [];
let usersIDs = [];

let requestID =[];


    describe(' Tests `/search` rout', () => {
    

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

        
        it('should return requests that matches the given category and keyword', async () => {

          //ACTION
         //user1 searchs for requests
         //search 1
           let response1 = await mockRequest.post(`/search/`).send({keyword: "play pubgi", category: "Sports" }).set('Authorization', usersTokens[1]);
         
           //search 2
           let response2 = await mockRequest.post(`/search/`).send({keyword: "math", category: "Study Group"}).set('Authorization', usersTokens[1]);

           //ASSERT
          expect(response1.status).toBe(200);
          expect(response1.body.length).toBe(2);
          expect(response1.body[0].category).toEqual("Sports");


          expect(response2.status).toBe(200);
          expect(response2.body.length).toBe(1);
          expect(response2.body[0].category).toEqual("Study Group");

        });



    
      });