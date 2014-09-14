var config = require('config');
var data = {
            numbers: config.get('balls'),
            hist: []
           }; 

module.exports = data;
