(function(){
  var $ = jQuery.noConflict(true);

  function GameClient(){
    //カード操作用
    this.card = [];
    for(var i=0; i<5; i++){
      var col = [];
      for(var j=0; j<5; j++){
        col.push($('.row' + j + ' .col' + i));
      }
      this.card.push(col);
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
        console.log("receive init");
        var data = JSON.parse(msg);
        console.log(data);
        console.log("data length :" + data.length);
        //self.drawAllHist(data);
      });

      //ボール取得結果
      socket.on('getBallResult', function(msg){
        console.log("receive getBallResult");
        var data = JSON.parse(msg);
        console.log(data);
      });

      //ゲームリセット結果取得
      socket.on('resetResult', function(msg){
        console.log("receive resetResult");
        var data = JSON.parse(msg);
        console.log(data);
        //self.resetHist();
      });

      socket.on('cardInfo', function(msg){
        console.log("reseive cardInfo");
        console.log(msg);
        var data = JSON.parse(msg);
        for(var i=0; i<5; i++){
          for(var j=0; j<5; j++){
            //console.log(self.card[i][j].find(".ballWrap .ball p").text());
            //console.log(data.nums[i].cell[j]);
            self.card[i][j].find(".ballWrap .ball p").text(data.nums[i].cell[j]);
          }
        }
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
