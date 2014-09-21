var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('master', { title: 'bin5o ~GM~' });
});

module.exports = router;
