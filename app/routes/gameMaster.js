var express = require('express');
var router = express.Router();
var config = require('config');

var numbers = config.get('balls');
var hist = [];

/* GET home page. */
router.get('/', function(req, res) {
  res.render('master', { title: 'bin5o ~GM~' });
});

router.get('/get', function(req, res) {
  var jsonObj = {};
  if(numbers.length > 0){
    var index = Math.floor(Math.random() * numbers.length);
    var num = numbers[index];
    jsonObj.latest = num;
    hist.push(num);
    console.log("selected number(index) : " + num + "(" + index + ")");
    numbers.splice(index, 1);
    console.log(hist);
  }else{
    jsonObj.num = -1;
  }
  res.json(jsonObj);
});

module.exports = router;
