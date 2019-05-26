const _ = require("lodash");
const express = require('express');
const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const jwt = require('jsonwebtoken');
// custom objects
const configservice = require('../services/configservice');
const log4jservice = require('../services/log4jservice');
// custom jwt configure object
const jwtservice = require('../services/jwtservice');
const router = express.Router();

// Get the user login credentials array from configuration file
const usersArray = configservice.loginCredentials;

/**
 * Function to log user into the application. Looks at the users object to validate the credentials
 * Returns token when the credentials match and token is stored in local storage for subsequent access.
 */
router.post('/login', function(req, res) {

	if(req.body.username && req.body.password){
		const name = req.body.username;
		const password = req.body.password;

		// usually this would be a database call:
		const user = usersArray[_.findIndex(usersArray, {name: name})];
		if( ! user ){
			log4jservice.error("no such user found");
			res.status(401).json({message:"no such user found"});
		}

		// now check the password
		if(user.password === password) {
			// from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
			const token = jwtservice.getTokenUsingPayload(user.id);
			res.status(200).json({message: "ok", token: token});
		} else {
			log4jservice.error("passwords did not match");
			res.status(401).json({message:"passwords did not match"});
		}
	}else{
		log4jservice.error("Enter login credentials");
		res.status(500).json({message:"Enter login credentials"});
	}

});

module.exports = router;
