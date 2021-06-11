'use strict';
const express = require('express');
const DataCollection = require('../models/data-collection.js');
const RequestModel = require('../models/requests/model.js');
const users = require('../auth/models/users');
const bearerAuth = require('../auth/middleware/bearer')
const request = new DataCollection(RequestModel);
const router = express.Router();

//Routing methods 
router.get('/request',getAllRequests)
router.get('/request/:id', bearerAuth ,getOneRequest)
router.post('/request',addRequest)
router.put('/request/:id',bearerAuth,updateRequest)
router.delete('/request/:id',bearerAuth,deleteRequest)
router.put('/submit/:id/', bearerAuth, updateRequest);
router.delete('/unsubmit/:id/', bearerAuth, removeSubmitter);
router.get('/profile/:id', bearerAuth, renderProfile);

//Routing Controller Functions
async function getAllRequests(req, res, next) {
  try {
    if (!req.headers.authorization) { _authError() }
    const token = req.headers.authorization.split(' ').pop();
    const userID = await users.getUserIdFromToken(token);
    console.log(userID)
    const allRequestsData = await request.getMyRequests(userID);
      res.json(allRequestsData);
  } catch (error) {
      next(error);
  }
}

async function getOneRequest(req, res, next) {
  try {
      const requestData = await request.get(req.params.id);
      console.log(requestData);
      res.json(requestData);
  } catch (error) {
      next(error);
  }
}

async function addRequest(req, res, next) {
  try {
    if (!req.headers.authorization) { _authError() }
    const token = req.headers.authorization.split(' ').pop();
    console.log(token);
    const userID = await users.getUserIdFromToken(token);
      const requestInfo = req.body;
      requestInfo.user_ID = userID;
      console.log(requestInfo);
      const newRequest = await request.create(requestInfo);
      res.status(201).json(newRequest);
  } catch (error) {
      next(error);
  }
}

async function updateRequest(req, res, next) {
  try {
      const token = req.headers.authorization.split(' ').pop();
      const userID = await users.getUserIdFromToken(token)
      // console.log("token",token)
      // console.log("userId", userID)
      let reqId = req.params.id;
      // console.log('reqId******', reqId)
      // console.log(await request.get( reqId ));
      const reqObj = await request.get( reqId );
      const idFromObj = reqObj.user_ID;
      if(idFromObj === userID ){
      const newInfo = req.body;
      const updatedInfo = await request.update(req.params.id, newInfo);
      res.json(updatedInfo);
      } else  {
        // const newInfo = req.body.submitters;
        const newInfo = userID;
        let submittersObj = { $push: {'submitters' : newInfo} } 
        console.log('NEWINFO', submittersObj)

      const updatedInfo = await request.update(req.params.id, submittersObj);
      res.json(updatedInfo);
      console.log("UPDATED",updatedInfo)
      }
      // new Error('YOU ARE NOT ALLOWED TO EDIT');
  } catch (error) {
      next(error);
  }
}
async function removeSubmitter(req, res, next){
  const token = req.headers.authorization.split(' ').pop();
      const userID = await users.getUserIdFromToken(token)
      let reqId = req.params.id;
      const reqObj = await request.get( reqId );
      const idFromObj = reqObj.user_ID;
      if(idFromObj !== userID ){
      const newInfo = userID;
      let submittersObj = { $pull: {'submitters': {$in : [newInfo]}}};
      console.log('submittersObj', submittersObj);
      const updatedInfo = await request.update(req.params.id, submittersObj);
      res.json(updatedInfo)
      console.log('updatedInfo', updatedInfo);
}}

async function deleteRequest(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ').pop();
    const userID = await users.getUserIdFromToken(token)
    let reqId = req.params.id;
    const reqObj = await request.get( reqId );
    const idFromObj = reqObj.user_ID;
    if(idFromObj === userID ){
      const deletedRequest = await request.delete(req.params.id);
      res.json(await request.get());
    } else throw new Error('YOU ARE NOT ALLOWED TO DELETE')
  } catch (error) {
      next(error);
  }
}
async function renderProfile(req, res, next){
  try{
    const token = req.headers.authorization.split(' ').pop();
    const userID = await users.getUserIdFromToken(token)
    let paramsId = req.params.id;
    if(paramsId === userID ){
      const requestData = await users.read(req.params.id);
      res.json(requestData)
    } 
    else {
    const requestData = await users.read(req.params.id);
    const allowedData = {'first_name' : requestData.first_name,
    "last_name" : requestData.last_name,
    "age" : requestData.age,
    "user_bio" : requestData.user_bio,
    "profile_image" : requestData.profile_image,
    "education" : requestData.education
  }
  res.json(allowedData);
}
  } catch (error) {
      next(error);
  }
}


module.exports=router;