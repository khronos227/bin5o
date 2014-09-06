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

[memo]
ボタン1
http://coliss.com/articles/build-websites/operation/css/css3-brushed-metal-style.html
