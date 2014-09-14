# bin5o
This is bingo app based on Node.js.

# environments
- nginx : 静的ファイルアクセス / app本体への逆proxy
- nodejs : app本体
- mysql : ビンゴデータ格納

## how to make environment
    (vagrant box add opscode-centos-6.5 http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_centos-6.5_chef-provisionerless.box)
    bundle install
    bundle exec berks vendor cookbooks
    vagrant up

## how to run app
    ./bin/www

## about Sass
- CSSの作成にはSassを利用。<br>
(参考：http://liginc.co.jp/web/html-css/css/56599)
  1. sassをインストール
          gem install sass
  2. Koalaをダウンロード<br>
     http://koala-app.com/
- CSSをプログラミングライクに構築することが可能
  - 変数
  - 四則演算
  - 制御フロー
  - 外部sassのインポート
  - etc...

[memo]
- ボタン1<br>
http://coliss.com/articles/build-websites/operation/css/css3-brushed-metal-style.html
- 斜線<br>
http://www.panarea-is.com/css3%EF%BC%9Acss%E3%81%AE%E3%81%BF%E3%81%A7%E6%96%9C%E7%B7%9A%E8%83%8C%E6%99%AF%E3%82%92%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B/
- 球体<br>
http://buckamargeblog.wordpress.com/2013/06/03/css3%E3%81%A7%E7%AB%8B%E4%BD%93%E7%9A%84%E3%81%AA%E7%90%83%E4%BD%93%E4%BD%9C%E6%88%90/
- スケールアウト<br>
https://gist.github.com/nulltask/89e6f36e194c951697a0
