'use strict';
const express = require('express');
const DataCollection = require('../models/data-collection.js');
const RequestModel = require('../models/requests/model.js');
const request = new DataCollection(RequestModel);
const router = express.Router();

//Routing methods 
router.get('/',getAllRequests)
router.get('/:id',getOneRequest)
router.post('/',addRequest)
router.put('/:id',updateRequest)
router.delete('/:id',deleteRequest)


//Routing Controller Functions
async function getAllRequests(req, res, next) {
  try {
      const allRequestsData = await request.read();
      res.json(allRequestsData);
  } catch (error) {
      next(error);
  }
}

async function getOneRequest(req, res, next) {
  try {
      const requestData = await request.read(req.params.id);
      res.json(requestData);
  } catch (error) {
      next(error);
  }
}

async function addRequest(req, res, next) {
  try {
      const requestInfo = req.body;
      const newRequest = await request.create(requestInfo);
      res.status(201).json(newRequest);
  } catch (error) {
      next(error);
  }
}

async function updateRequest(req, res, next) {
  try {
      const newInfo = req.body;
      const updatedInfo = await request.update(req.params.id, newInfo);
      res.json(updatedInfo);
  } catch (error) {
      next(error);
  }
}

async function deleteRequest(req, res, next) {
  try {
      const deletedRequest = await request.delete(req.params.id);
      res.json(await request.read());
  } catch (error) {
      next(error);
  }
}


module.exports=router;