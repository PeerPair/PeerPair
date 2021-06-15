'use strict';

process.env.SECRET = "toes";
const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');
const bearer = require('../src/auth/middleware/bearer.js');
const mockRequest = supergoose(server);

let users = {
  user1: {
    "first_name": "tasnim",
    "last_name": "ali",
    "password": "12345678u",
    "email": "tasnim@yahoo.com",
    "interests": "music",
    "age": 19
},
  user2: {"first_name": "furat",
  "last_name": "ali",
  "password": "12345678u",
  "email": "furat@yahoo.com",
  "interests": "art",
  "age": 20 },
};


describe('Auth Router', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {

      it('cannot read the all users if the user doesn\'t has a permission', async () => {

        const response = await mockRequest.get('/users').send(users[userType]);
        const userObject = response.body;
       expect(response.status).toBe(403);

      });


      it('can create one', async () => {

        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;


        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.email).toEqual(users[userType].email)


      });

      it('can signin with basic', async () => {

        const response = await mockRequest.post('/signin')
          .auth(users[userType].email, users[userType].password);


        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user._id).toBeDefined();
        expect(userObject.user.email).toEqual(users[userType].email)


      });


    });

    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async () => {

        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();

      });

      it('basic fails with unknown user', async () => {

        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()

      });

      it('bearer fails with an invalid token', async () => {


        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer foobar`)


        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);

      })
    })

  });

});

