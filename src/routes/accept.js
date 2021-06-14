"use strict";
const express = require("express");
const users = require("../auth/models/users");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const generateID = require('../middleware/generateID');
const accepted = require('../middleware/accepted.js');
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const request = new DataCollection(RequestModel);
const noti = require("../models/notification/notification.js");

//Routing methods
router.put("/accept/:id", bearerAuth,accepted,generateID, accept);
router.put("/cancelaccept/:id", bearerAuth,generateID, cancel);



async function accept(req, res, next) {
  try {
    let submitterID = req.body.id;
    const reqObj = req.data;
    const reqOwnerID = reqObj.user_ID;

    if (reqOwnerID === req.userID && reqObj.submitters.includes(submitterID)) { 
        const newInfo = submitterID;
        let submittersObj = {  accepted:true,current_partner:newInfo } ;
        const updatedInfo = await request.update(req.params.id, submittersObj);
        let notiMessage = { $addToSet: { newMessages: `(${req.userID})${req.userData.first_name} Accept your submission`}  }; 
        const newNoti = await noti.findOneAndUpdate({user: submitterID}, notiMessage); 
        res.json(updatedInfo);
    } else {
        throw new Error('Access Denied for this action')
      };
    }

  catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
    try {
      const reqID = req.params.id;
      const reqObj = await request.get(reqID);
      const reqOwnerID = reqObj.user_ID;
      if (reqOwnerID === req.userID) {
          let submittersObj = {  accepted:false,current_partner:'none' } ;
          const updatedInfo = await request.update(req.params.id, submittersObj);
          let notiMessage = { $addToSet: { newMessages: `(${req.userID})${req.userData.first_name} : Not your partner anymore `}  }; 
          const newNoti = await noti.findOneAndUpdate({user: submitterID}, notiMessage); 
          res.json(updatedInfo);
      } else {
          throw new Error('Access Denied for this action')
        };
      }
  
    catch (error) {
      next(error);
    }
  }

module.exports = router;
