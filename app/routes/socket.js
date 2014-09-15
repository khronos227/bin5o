var config = require('config');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/bin5o');

var Schema = mongoose.Schema;
var CardRows = new Schema({
  row: [Number]
});
var Cards = new Schema({
  address: String,
  nums: [CardRows]
});
mongoose.model('Row', CardRows);
mongoose.model('Card', Cards);

exports.makeSocketIo = function(server){
  var numbers = [].concat(config.get('balls'));
  var hist = []; 

  console.log("create socket.io instance");
  var io = require('socket.io')(server);

  io.on('connection', function(socket){
    console.log("connection");
    socket.on('mode', function(msg){
      console.log("mode: " + msg);
      if(msg === 'master'){
        //ボール取得
        socket.on('get', function(){
          var num = -1;
          if(numbers.length > 0){
            var index = Math.floor(Math.random() * numbers.length);
            num = numbers[index];
            numbers.splice(index, 1);
            hist.push(num);
          }
          //ボール取得結果返却
          io.emit('getBallResult', JSON.stringify({"num": num, "hist": hist}));
        });

        //リセット
        socket.on('reset', function(){
          numbers = [].concat(config.get('balls'));
          hist = [];
          //リセット結果返却
          socket.emit('resetResult', JSON.stringify(hist));
        });
      }else{ //それ以外はClientとして扱う
        var address = socket.conn.remoteAddress;
        var Card = mongoose.model('Card');
        Card.find({'address': address}, function(err, cards){
          if(cards.length > 0){
            console.log("card was found");
            console.log(cards[0]);
          }else{
            var newCard = new Card();
            newCard.address = address;
            var CardRow = mongoose.model('Row');
            for(var i=0; i<5; i++){
              var newRow = new CardRow();
              for(var j=0; j<5; j++){
                newRow.row[j] = Math.floor(Math.random() * 15) + (15 * i);
              }
              newCard.nums[i] = newRow;
              console.log(newRow);
            }
            console.log(newCard);
            newCard.save(function(err){
              if(err){
                console.log(err);
                throw err;
              }
              console.log("card saved");
            });
          }
        });
      }
      socket.emit('init', JSON.stringify(hist));
    });
  });

  return io;
}
