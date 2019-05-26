const log4js = require('log4js');
const configservice = require('./configservice');

// Application level logging.
log4js.configure({
  appenders: {
    out:{ type: 'console' },
    app:{ type: 'file', filename: configservice.log4jFile }
  },
  categories: {
    default: { appenders: [ 'out', 'app' ], level: configservice.log4jLevel }
  }
});

const logger = log4js.getLogger('app');

module.exports = logger;
