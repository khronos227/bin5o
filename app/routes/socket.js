var config = require('config');

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
        
      }
      socket.emit('init', JSON.stringify(hist));
    });
  });

  return io;
}
