## InstaaSnap &middot; [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

```
1. InstaaSnap is a Open Source IG Post Downloader API.
2. Privacy friendly, no database, no analytics, no logs, no cookies.
3. React frontend and cross-platform React Native app is coming soon. 
4. InstaaSnap is built with Node.js, Express.js, React.js and Next.js and React Native. 
5. InstaaSnap is fully maintained and will be available in future with all the updates.  
```

## Screenshots

![alt text](https://github.com/twoabd/InstaaSnap/blob/main/webapp/docs/webapp.gif?raw=true)   

![alt text](https://github.com/twoabd/InstaaSnap/blob/main/nativeapp/docs/nativeapp.gif?raw=true)


## Authors

* **Choudhary Abdullah** - API, Frontend - [LinkedIn](https://www.linkedin.com/in/abdullahchoudhary/)  


## Built With

* [Node.js](https://nodejs.org) - Backend Runtime Environment
* [Express.js](https://expressjs.com) - Backend Framework
* [React.js](https://nodejs.org) - Frontend Library
* [Next.js](https://expressjs.com) - React Framework
* [React Native](https://reactnative.dev) - Cross Plateform Apps


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/twoabd/CompressioWeb/tags). 


## To-do list before deployment

```
1. Add login cookie to webapi's and nativeapi's app.js
2. Serve output folder using Nginx and add correct Access-Control-Allow-Origin header.
3. Change CORS from * to instaasnap.app in app.js
4. For React Native App, open XCode and Android Studio to do suitable adjustments like App Icons, Splash Screen, and Production Build.
```
## Deployment, API & Web

#### Install Nginx and NodeJ 17 on Ubuntu 20.04
```
sudo apt update
sudo apt install nginx -y

curl -sL https://deb.nodesource.com/setup_17.x | sudo bash -
cat /etc/apt/sources.list.d/nodesource.list
sudo apt  install nodejs -y
node  -v
```

#### Updating Nginx conf in etc/nginx/nginx.conf
```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	multi_accept on;
}

http {

	# Basic Settings
	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
  client_max_body_size 20M;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;


	# SSL Settings
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
	ssl_prefer_server_ciphers on;


	# Logging Settings
	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;


	# Gzip Settings
	gzip on; 
	gzip_disable "msie6";
	gzip_vary on;
	gzip_proxied any;
	gzip_comp_level 6;
	gzip_buffers 16 8k;
	gzip_http_version 1.1;
  gzip_types 
	application/javascript application/rss+xml application/vnd.ms-fontobject application/x-font 
	application/x-font-opentype application/x-font-otf application/x-font-truetype application/x-font-ttf 
	application/x-javascript application/xhtml+xml application/xml font/opentype font/otf font/ttf 
	image/svg+xml image/x-icon text/css text/html text/javascript text/plain text/xml;

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
```

#### Creating API Directory

```
sudo mkdir -p /var/www/downloaderexpert.com/nativeapi
sudo mkdir -p /var/www/downloaderexpert.com/webapi
sudo mkdir -p /var/www/downloaderexpert.com/webapp

sudo chown -R www-data:www-data /var/www/downloaderexpert.com
sudo chmod -R 755 /var/www/downloaderexpert.com
```

#### Creating Virtual Host
```
sudo nano /etc/nginx/sites-available/downloaderexpert.com
server {
    server_name downloaderexpert.com;
   
    # NativeAPI
    location /nativeapi {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
    }
    
    # WebAPI
    location /webapi {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
    }
    
    # WebApp
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 30s;
    }

	  # Output Folder
    location /webapi/output {
        root /var/www/downloaderexpert.com;
    }

}
sudo ln -s /etc/nginx/sites-available/downloaderexpert.com /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
sudo rm -rf /var/www/html
sudo systemctl restart nginx
```

#### Installing SSL
```
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d downloaderexpert.com
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
sudo systemctl restart nginx
```

#### Copy respective folder files to..
```
/var/www/downloaderexpert.com/nativeapi/*
/var/www/downloaderexpert.com/webapi/*
/var/www/downloaderexpert.com/webapp/*

cd /var/www/downloaderexpert.com/nativeapi
npm install
npm install nodemon -g
nodemon app.js

cd /var/www/downloaderexpert.com/webapi
npm install
nodemon app.js

cd /var/www/downloaderexpert.com/webapp
npm install
```
