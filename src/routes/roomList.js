'use strict';
const express = require('express');
const users = require('../auth/models/users');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const router = express.Router();
const generateID = require('../middleware/generateID');
const room = require('../models/chat/room');

//Routing methods
router.get('/chatList', bearerAuth, generateID, permissions('read'), chatList);

async function chatList(req, res, next) {
  try {
    const rooms = await room.find({ users: req.userID });
    const response = [];
    for (let i = 0; i < rooms.length; i++) {
      console.log(rooms[i]);
      if (rooms[i].users[0] !== req.userID) {
        try{

          const userINFO = await users.read(rooms[i].users[0]);
          
          if (userINFO) {
            userINFO.password='*';
            response.push(userINFO)
          };
        }catch{
          
        }
      }
      if (rooms[i].users[1] !== req.userID) {
        try{

          const userINFO = await users.read(rooms[i].users[1]);
          
          if (userINFO) {
            userINFO.password='*';
            response.push(userINFO)
          };
        }catch{
          
        }
      }
    }


    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = router;

/*
      const response = rooms.map( async (room) =>{
          console.log(room);
          console.log(req.userID);
          if(room.users[0] !== req.userID){
            
          return room.users[0];
           
        }
          if(room.users[1] !== req.userID){
            return room.users[1];
           
        }


        })
        */
