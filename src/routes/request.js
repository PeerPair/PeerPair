"use strict";
const express = require("express");
const DataCollection = require("../models/data-collection.js");
const RequestModel = require("../models/requests/model.js");
const bearerAuth = require("../auth/middleware/bearer");
const generateID = require('../middleware/generateID');
const request = new DataCollection(RequestModel);
const router = express.Router();
const accepted = require('../middleware/accepted.js')


//Routing methods
router.get("/request",bearerAuth, generateID, getAllRequests);
router.get("/request/:id", bearerAuth,generateID, getOneRequest);
router.post("/request", bearerAuth,generateID, addRequest);
router.put("/request/:id", bearerAuth,accepted,generateID, updateRequest);
router.delete("/request/:id", bearerAuth,generateID, deleteRequest);

//Routing Controller Functions
async function getAllRequests(req, res, next) {
  try {
    const allRequestsData = await request.getMyRequests(req.userID);
    res.json(allRequestsData);
  } catch (error) {
    next(error);
  }
}

async function getOneRequest(req, res, next) {
  try {
    const requestData = await request.get(req.params.id);
    res.json(requestData);
  } catch (error) {
    next(error);
  }
}

async function addRequest(req, res, next) {
  try {
    if (!req.headers.authorization) {
      _authError();
    }

    const requestInfo = req.body;
    requestInfo.user_ID = req.userID;
    const newRequest = await request.create(requestInfo);
    res.status(201).json(newRequest);
  } catch (error) {
    next(error);
  }
}

async function updateRequest(req, res, next) {
  try {

    let reqId = req.params.id;
    const reqObj = await request.get(reqId);
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


async function deleteRequest(req, res, next) {
  try {
    if (req.user.capabilities.includes("delete")) {
      console.log('in');
      const deletedRequest = await request.delete(req.params.id);
      res.json(await request.get());
    } else {
      let reqId = req.params.id;
      const reqObj = await request.get(reqId);
      console.log(reqObj);
      const idFromObj = reqObj.user_ID;
      if (idFromObj === req.userID) {
        const deletedRequest = await request.delete(req.params.id);
        res.json(await request.get());
      } else throw new Error("YOU ARE NOT ALLOWED TO DELETE");
    }
  } catch (error) {
    next(error);
  }
}


module.exports = router;
