"use strict";
const express = require("express");
const users = require("../auth/models/users");
const bearerAuth = require("../auth/middleware/bearer");
const router = express.Router();
const generateID = require('../middleware/generateID');

//Routing methods
router.get("/profile/:id", bearerAuth,generateID, renderProfile);



async function renderProfile(req, res, next) {
  try {
    let paramsId = req.params.id;
    if (paramsId === req.userID) {
      const requestData = await users.read(req.params.id);
      res.json(requestData);
    } else {
      const requestData = await users.read(req.params.id);
      const allowedData = {
        first_name: requestData.first_name,
        last_name: requestData.last_name,
        age: requestData.age,
        user_bio: requestData.user_bio,
        profile_image: requestData.profile_image,
        education: requestData.education,
      };
      res.json(allowedData);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = router;
