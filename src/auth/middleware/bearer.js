'use strict';

const users = require('../models/users.js')
const LocalStorage = require('node-localstorage').LocalStorage,localStorage = new LocalStorage('./scratch');
localStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGM2MWY1N2IwYjA1YzBmMzU3OWUxYmIiLCJpYXQiOjE2MjM2MjA0NzB9.frxSiOvq5W8uXfPsiBy2rwRfe3HzBeZpVNDK14Ux3n8');
const storage = require('node-sessionstorage')

// storage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MGM2MWY1N2IwYjA1YzBmMzU3OWUxYmIiLCJpYXQiOjE2MjM2MjA0NzB9.frxSiOvq5W8uXfPsiBy2rwRfe3HzBeZpVNDK14Ux3n8')

console.log('item set:', storage.getItem('foo'))
module.exports = async (req, res, next) => {

  try {
    const localToken = await storage.getItem('token');
    if (!req.headers.authorization && !localToken) {res.status(403).send('invalid login') }
    const token = localToken || req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token);
    req.user = validUser;
    req.token = validUser.token;

    next();

  } catch (e) {
    res.status(403).send(e);
  }

}
