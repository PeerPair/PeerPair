'use strict';


process.env.SECRET = "toes";


require('@code-fellows/supergoose');
const middleware = require('../src/auth/middleware/bearer.js');
const Users = require('../src/auth/models/users.js');
const jwt = require('jsonwebtoken')

let users = {
  user1: { "first_name": "tasnim",
  "last_name": "ali",
  "password": "12345678u",
  "email": "tasnim@yahoo.com",
  "interests": "music",
  "age": 19 },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await new Users(users.user1).save();
});


describe('Auth Middleware', () => {


  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();


  describe('user authentication', () => {

    it('fails a login for a user (admin) with an incorrect token', () => {

      req.headers = {
        authorization: 'Bearer thisisabadtoken',
      };


      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });


    });

    // it('logs in a user with a proper token', () => {

    //   const user2 = { username: 'admin' };
    //   const token = jwt.sign(user2, process.env.SECRET);

    //   req.headers = {
    //     authorization: `Bearer ${token}`,
    //   };


    //   return middleware(req, res, next)
    //     .then(() => {
    //       expect(next).toHaveBeenCalledWith();
    //     });


    // });

  });

});

