"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const bearerAuth = require("../auth/middleware/bearer");
const request = new DataCollection(RequestModel);
const router = express.Router();
const generateID = require('../middleware/generateID');
const accepted = require('../middleware/accepted.js')


//Routing methods
router.put("/submit/:id/", bearerAuth,accepted,generateID, updateRequest);
router.put("/unsubmit/:id/", bearerAuth,accepted,generateID, removeSubmitter);
router.put("/cancelsubmit/:id/", bearerAuth,accepted,generateID, cancelSubmit);

async function cancelSubmit(req, res, next) {
    try {
      let submitterID = req.body.id;
      const reqID = req.params.id;
      const reqObj = req.data;
      const reqOwnerID = reqObj.user_ID;
      if (reqOwnerID === req.userID) {
          const newInfo = submitterID;
          let submittersObj = { $pull: { submitters: { $in: [newInfo] } } };
          const updatedInfo = await request.update(req.params.id, submittersObj);
          res.json(updatedInfo);
      } else {
          throw new Error('Access Denied for this action')
        };
      }
  
    catch (error) {
      next(error);
    }
  }

async function updateRequest(req, res, next) {
  try {
    let reqId = req.params.id;
    const reqObj = req.data;
    const idFromObj = reqObj.user_ID;
    if (idFromObj === req.userID) {
      const newInfo = req.body;
      const updatedInfo = await request.update(req.params.id, newInfo);
      res.json(updatedInfo);
    } else {
      const newInfo = req.userID;
      let submittersObj = { $addToSet: { submitters: newInfo } };
      const updatedInfo = await request.update(req.params.id, submittersObj);
      res.json(updatedInfo);
    }
  } catch (error) {
    next(error);
  }
}
async function removeSubmitter(req, res, next) {

  let reqId = req.params.id;
  const reqObj = req.data;
  const idFromObj = reqObj.user_ID;
  if (idFromObj !== req.userID) {
    const newInfo = req.userID;
    let submittersObj = { $pull: { submitters: { $in: [newInfo] } } };
    const updatedInfo = await request.update(req.params.id, submittersObj);
    res.json(updatedInfo);
  }
}


module.exports = router;
