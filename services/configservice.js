// default value for this plugin will be dev
const env = require('get-env')({
	dev: 'dev',
	qa: 'qa',
	stage: 'stage',
	prod: ['pr', 'prod', 'production']
});


console.log('env',env);
const configservice = require('../config/'+env+'.js');

module.exports = configservice;
