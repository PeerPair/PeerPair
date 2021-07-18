'use strict';
const express = require('express');
const bearerAuth = require('../auth/middleware/bearer');
const router = express.Router();
const DataCollection = require('../models/data-collection.js');
const RequestModel = require('../models/requests/model.js');
const request = new DataCollection(RequestModel);

//Routing methods
router.get('/allRequest', bearerAuth, allRequest);

async function allRequest(req, res, next) {
  try {
    const allRequestsData = await request.get();
    let unacceptedReq = allRequestsData.filter((item) => {
      return !item.accepted;
    });
    res.json(unacceptedReq);
  } catch (error) {
    next(error);
  }
}

module.exports = router;
