(function(){
  var $ = jQuery.noConflict(true);

  function GameClient(){
    //カード操作用
    this.card = [];
    for(var i=0; i<5; i++){
      var row = [];
      for(var j=0; j<5; j++){
        row.push($('.row' + i + ' .col' + j));
      }
      this.card.push(row);
    }
    //履歴用
    this.hist = [];
  }

  GameClient.prototype = {
    initialize: function(){
      var self = this;

      var socket = io.connect();
      //mode 設定の返りから現状のhistを取得
      socket.on('init', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
        console.log(data.length);
        //self.drawAllHist(data);
      });

      //ボール取得結果
      socket.on('getBallResult', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
      });

      //ゲームリセット結果取得
      socket.on('resetResult', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
        //self.resetHist();
      });

      //mode 設定
      socket.emit('mode','client');
    }
  }

  $(function(){
    var client = new GameClient();
    client.initialize();
  });
}());
