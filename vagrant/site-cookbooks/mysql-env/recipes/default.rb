#
# Cookbook Name:: mysql-env
# Recipe:: default
#
# Copyright 2014, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
include_recipe 'database::mysql'

mysql_connection_info = {:host => "localhost",
                         :username => 'root',
                         :password => node['mysql']['server_root_password']}

mysql_database "bin5o" do
  connection mysql_connection_info
  action :create
end

mysql_database_user "bin5o_admin" do
  connection mysql_connection_info
  password "123456"
  database_name "bin5o"
  privileges [:all]
  action [:create, :grant]
end
