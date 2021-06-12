"use strict";
const express = require("express");
const users = require("../auth/models/users");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const generateID = require('../middleware/generateID');
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const request = new DataCollection(RequestModel);



router.get("/", bearerAuth , generateID, renderHome );



async function renderHome (req,res,next){
try {
 const allRequestsData = await request.getMyRequests(req.userID);

 let usertData = await users.read(req.userID);

 usertData.password = "*****";
 let reponseObj = {
   allRequest : allRequestsData,
   usertData : usertData
 };

 res.json(reponseObj);
} catch (error) {
  next(error);
}

}

module.exports = router;




