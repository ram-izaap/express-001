const _ = require("lodash");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const configservice = require('./configservice');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = configservice.secretOrKey;

// Get the user login credentials array from configuration file
const usersArray = configservice.loginCredentials;

// Strategy for the JWT login
const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
	// usually this would be a database call:
	const user = usersArray[_.findIndex(usersArray, {id: jwt_payload.id})];
	if (user) {
		next(null, user);
	} else {
		next(null, false);
	}
});

passport.use(strategy);

const getTokenUsingPayload = function(userId){
	// get the user profile id from decrypted token
	const payload = {id: userId};
	// create the token again to make the actual call
	const token = jwt.sign(payload, jwtOptions.secretOrKey);
	// return the signed token
	return token;
}

module.exports = {
  	passport: passport,
  	jwtOptions: jwtOptions,
	getTokenUsingPayload: getTokenUsingPayload
}
