## InstaaSnap &middot; [![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

```
1. InstaaSnap is a Open Source IG Post Saver API, WebApp, iOS and Andoid app.
2. I created it to save cat and travel videos from IG.
3. It's Privacy friendly, no database, no analytics, no logs, no cookies.
4. InstaaSnap is built with Node.js, Express.js, React.js, Next.js and React Native. 
```

## Screenshots

![alt text](https://github.com/twoabd/InstaaSnap/blob/main/webapp/docs/webapp.gif?raw=true)   

![alt text](https://github.com/twoabd/InstaaSnap/blob/main/nativeapp/docs/nativeapp.gif?raw=true)


## Authors

* **Choudhary Abdullah** - API, WebApp and NativeApp  - [LinkedIn](https://www.linkedin.com/in/abdullahchoudhary/)  


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
1. Add your IG Login Cookie to webapi's and nativeapi's app.js
2. Change instaasnap.app to your domain everywhere.
2. For React Native App, open XCode and Android Studio to do suitable adjustments like App Icons, Splash Screen, and Production Build.
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
sudo mkdir -p /var/www/instaasnap.app/nativeapi
sudo mkdir -p /var/www/instaasnap.app/webapi
sudo mkdir -p /var/www/instaasnap.app/webapp

sudo chown -R www-data:www-data /var/www/instaasnap.app
sudo chmod -R 755 /var/www/instaasnap.app
```

#### Creating Virtual Host
```
sudo nano /etc/nginx/sites-available/instaasnap.app
server {
    server_name instaasnap.app;
   
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
    location /output {
        root /var/www/instaasnap.app/webapp;
    }

}
sudo ln -s /etc/nginx/sites-available/instaasnap.app /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
sudo rm -rf /var/www/html
sudo systemctl restart nginx
```

#### Installing SSL
```
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d instaasnap.app
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
sudo systemctl restart nginx
```

#### Copy respective folder files to..
```
/var/www/instaasnap.app/nativeapi/*
/var/www/instaasnap.app/webapi/*
/var/www/instaasnap.app/webapp/*

cd /var/www/instaasnap.app/nativeapi
npm install
npm install nodemon -g
nodemon app.js

cd /var/www/instaasnap.app/webapi
npm install
nodemon app.js

cd /var/www/instaasnap.app/webapp
npm install
npm run build
npm start
```
