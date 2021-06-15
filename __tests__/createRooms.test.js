"use strict";

process.env.SECRET = "toes";
const server = require("../src/server.js").server;
const supergoose = require("@code-fellows/supergoose");
const bearer = require("../src/auth/middleware/bearer.js");
const mockRequest = supergoose(server);

let users = {
  user1: {
    first_name: "tasnim",
    last_name: "ali",
    password: "12345678u",
    email: "tasnim@yahoo.com",
    interests: "music",
    age: 19,
  },
  user2: {
    first_name: "furat",
    last_name: "ali",
    password: "12345678u",
    email: "furat@yahoo.com",
    interests: "art",
    age: 20,
  },
};
let usersData = [];
Object.keys(users).forEach((userType) => {
  it("can create one", async () => {
    const response = await mockRequest.post("/signup").send(users[userType]);
    const userObject = response.body;
    usersData.push(userObject);
  });
});

describe('Create a room to messaging',()=>{

    it('should create a unique room for messaging',async ()=>{
        const room = await mockRequest.post(`/messege/${usersData[1].user._id}`).set('Authorization', usersData[0].token);
        console.log(room.body);
        expect(room.body._id).toBeTruthy();
        // users: [ '60c90db53ce3d41f9bf3da69', '60c90db53ce3d41f9bf3da6b' ]
        expect(room.body.users).toEqual([ usersData[0].user._id, usersData[1].user._id ]);
    })


})