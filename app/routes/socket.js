var config = require('config');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/bin5o');

var Schema = mongoose.Schema;
var CardCols = new Schema({
  cell: [Number]
});
var Cards = new Schema({
  address: String,
  nums: [CardCols]
});
mongoose.model('Col', CardCols);
mongoose.model('Card', Cards);

exports.makeSocketIo = function(server){
  var numbers = [].concat(config.get('balls'));
  var hist = []; 
  var Card = mongoose.model('Card');
  Card.remove({}, function(err){
    if(err){
      console.log("fail to remove Card info");
    }else{
      console.log("removed Card info");
    }
  });

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
          io.emit('resetResult', JSON.stringify(hist));
        });
      }else{ //それ以外はClientとして扱う
        var address = socket.conn.remoteAddress;
        Card.find({'address': address}, function(err, cards){
          if(cards.length > 0){
            console.log("card was found");
            console.log(cards[0]);
            var card = cards[0];
          }else{
            console.log("create new card for " . address);
            var newCard = new Card();
            newCard.address = address;
            var CardCol = mongoose.model('Col');
            for(var i=0; i<5; i++){
              var newCol = new CardCol();
              for(var j=0; j<5; j++){
                do{
                  var n = Math.floor(Math.random() * 15) + (15 * i) + 1;
                }while(newCol.cell.indexOf(n) >= 0);
                newCol.cell[j] = n;
              }
              newCard.nums[i] = newCol;
              console.log(newCol);
            }
            newCard.save(function(err){
              if(err){
                console.log(err);
                throw err;
              }
              console.log("card saved");
            });
            var card = newCard;
          }
          socket.emit('cardInfo', JSON.stringify(card));
        });
      }
      socket.emit('init', JSON.stringify(hist));
    });
  });

  return io;
}
