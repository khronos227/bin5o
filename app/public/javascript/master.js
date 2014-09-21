(function(){
  var $ = jQuery.noConflict(true);

  function GameMaster(){
    this.getButton = $('#getBall');
    this.quickGetButton = $('#quickGetBall');
    this.resetButton = $('#resetGame');
    this.boardRow = $('.boardRow');
    //履歴用
    this.hist = [];
  }

  GameMaster.prototype = {
    initialize: function(){
      var self = this;

      var socket = io.connect();
      //mode 設定の返りから現状のhistを取得
      socket.on('init', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
        console.log(data.length);
        self.drawAllHist(data);
      });

      //ボール取得結果
      socket.on('getBallResult', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
        if(data.num != -1){
          self.drawHist(data.hist);
        }
      });

      //ゲームリセット結果取得
      socket.on('resetResult', function(msg){
        var data = JSON.parse(msg);
        console.log(data);
        self.resetHist();
      });

      //mode 設定
      socket.emit('mode','master');

      //ボール取得
      $(self.getButton).click(function(){
        socket.emit('get');
      });
      $(self.quickGetButton).click(function(){
        socket.emit('get');
      });

      //ゲームリセット
      $(self.resetButton).click(function(){
        socket.emit('reset');
      });
    },

    resetHist: function(){
      var self = this;
      $(self.boardRow).each(function(){
        $(this).empty();
      });
    },

    addBall: function(index, value){
      var self = this;
      var row = Math.floor(index / 15);
      var color = Math.floor((value - 1) / 15) + 1;
      var elem = $('<div class="histBallWrap"><div class="histBall"><div class="ball ballColor' + color + '"><p>' + value + '</p></div></div></div>');
      $(self.boardRow[row]).append(elem);
    },

    drawAllHist: function(data){
      var self = this;
      self.hist = data;
      console.log(self.hist);
      self.resetHist();
      $(self.hist).each(function(index, value){
        console.log(index + " : " + value);
        self.addBall(index, value);
      });
    },

    drawHist: function(data){
      var self = this;
      self.hist = data;
      var index = data.length - 1;
      self.addBall(index, data[index]);
    }
  }

  $(function(){
    var master = new GameMaster();
    master.initialize();
  });
}());
