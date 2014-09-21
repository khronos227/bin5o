(function(){
  var $ = jQuery.noConflict(true);

  function GameClient(){
    //カード操作用
    this.card = [];
    this.numbers = [];
    this.clicked = [];
    this.counts = [[],[],[]];
    this.length = 5;
    //履歴用
    this.hist = [];
    this.waiting = false;

    for(var i=0; i<this.length; i++){
      var col = [];
      var ccol = [];
      for(var j=0; j<this.length; j++){
        col.push($('.row' + j + ' .col' + i + ' .ballWrap'));
        ccol.push(0);
      }
      this.card.push(col);
      this.clicked.push(ccol);
      this.counts[0][i] = 0;
      this.counts[1][i] = 0;
    }
    this.counts[2] = [0, 0];
  }

  GameClient.prototype = {
    initialize: function(){
      var self = this;

      //set click event
      for(var i=0; i<self.length; i++){
        for(var j=0; j<self.length; j++){
          self.card[i][j].click(self.getClickCheckFunc(i, j));
        }
      }

      var socket = io.connect();
      //mode 設定の返りから現状のhistを取得
      socket.on('init', function(msg){
        console.log("receive init");
        var data = JSON.parse(msg);
        console.log(data);
        console.log("data length :" + data.length);
        self.hist = data;
        //self.drawAllHist(data);
      });

      //ボール取得結果
      socket.on('getBallResult', function(msg){
        console.log("receive getBallResult");
        var data = JSON.parse(msg);
        console.log(data);
        self.hist = data.hist;
      });

      //ゲームリセット結果取得
      socket.on('resetResult', function(msg){
        console.log("receive resetResult");
        var data = JSON.parse(msg);
        console.log(data);
        self.hist = data;
        self.reset();
      });

      socket.on('cardInfo', function(msg){
        console.log("reseive cardInfo");
        console.log(msg);
        var data = JSON.parse(msg);
        self.numbers = [];
        for(var i=0; i<self.length; i++){
          self.numbers.push(data.nums[i].cell);
          for(var j=0; j<self.length; j++){
            self.card[i][j].find('.ball p').text(data.nums[i].cell[j]);
          }
        }
      });

      //mode 設定
      socket.emit('mode','client');
    },
    //クリックされたボールをチェックする
    getClickCheckFunc: function(x, y){
      var self = this;
      return function(){
        if(self.hist.indexOf(self.numbers[x][y]) >= 0 && self.clicked[x][y] == 0){
          self.toClickedColor(this);
          self.clicked[x][y] = 1;
          self.counts[0][x] = self.counts[0][x] + 1;
          self.counts[1][y] = self.counts[1][y] + 1;
          //右下への対角
          if(x == y){
            self.counts[2][0] = self.counts[2][0] + 1;
          }
          //左下への対角
          if(x + y + 1 == self.length){
            self.counts[2][1] = self.counts[2][1] + 1;
          }
        }
        self.judgeBingo();
      }
    },
    //指定された要素(ボール)の背景をグレイアウトする
    toClickedColor: function(ballWrap){
      $(ballWrap).css(
        {
          'background-color': '#999999',
          'background-image': 'radial-gradient(at 100px 100px, white, #999999)',
          'background-image': '-webkit-gradient(radial, 30% 30%, 0, 30% 30%, 30, from(white), to(#999999))'
        }
      );
    },
    //ゲームリセット
    reset: function(){
      var self = this;
      for(var i=0; i<self.length; i++){
        for(var j=0; j<self.length; j++){
          self.card[i][j].css(
            {
              'background-color': '',
              'background-image': ''
            }
          );
          self.clicked[i][j] = 0;
          self.card[i][j].parent().removeClass('waiting');
        }
        self.counts[0][i] = 0;
        self.counts[1][i] = 0;
      }
      self.counts[2] = [0, 0];
    },
    //ビンゴ判定
    judgeBingo: function(){
      var self = this;
      //縦に関してリーチかどうか
      for(var i=0; i<self.length; i++){
        if(self.counts[0][i] == self.length - 1){
          for(var j=0; j<self.length; j++){
            self.card[i][j].parent().addClass('waiting');
          }
          console.log("リーチ");
          self.drawWaiting();
          self.waiting = true;
        }
      }
      //横に関してリーチかどうか
      for(var i=0; i<self.length; i++){
        if(self.counts[1][i] == self.length - 1){
          for(var j=0; j<self.length; j++){
            self.card[j][i].parent().addClass('waiting');
          }
          console.log("リーチ");
          self.drawWaiting();
          self.waiting = true;
        }
      }
      //右下への対角に関してリーチかどうか
      if(self.counts[2][0] == self.length - 1){
        for(var i=0; i<self.length; i++){
          self.card[i][i].parent().addClass('waiting');
        }
        console.log("リーチ");
        self.drawWaiting();
        self.waiting = true;
      }
      //左下への対角に関してリーチかどうか
      if(self.counts[2][1] == self.length - 1){
        for(var i=0; i<self.length; i++){
          self.card[i][self.length - i - 1].parent().addClass('waiting');
        }
        console.log("リーチ");
        self.drawWaiting();
        self.waiting = true;
      }
    },
    //点滅リセット
    resetWaitingAnimation: function(){
      var self = this;
      for(var i=0; i<self.length; i++){
        for(var j=0; j<self.length; j++){
          self.card[i][j].parent().removeClass('waiting');
        }
      }
    },
    //リーチ描画
    drawWaiting: function(){
      var self = this;
      if(!self.waiting){
        console.log("リーチ描画");
      }
    }
  }

  $(function(){
    var client = new GameClient();
    client.initialize();
  });
}());
