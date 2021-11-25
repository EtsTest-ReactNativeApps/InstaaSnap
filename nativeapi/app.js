const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const validUrl = require('valid-url');
const cors = require('cors');
const app = express();
app.use(cors({origin: '*' }));

app.get('/', (req, res) => {

    try {
        const urlList =  new Promise((resolve, reject) => {

            if (!req.query.postURL || !validUrl.isUri(req.query.postURL)) return res.end('Wrong Post URL');
            urlMedia = req.query.postURL;
    
            if (!urlMedia.split('/')[2] === 'www.instagram.com') return res.end('Wrong Post URL');
            if (!urlMedia.split('/')[3] === 'p' || !urlMedia.split('/')[3] === 'reel') return res.end('Wrong Post URL');
            urlMedia = urlMedia.replace('reel', 'p');
    
            if (!urlMedia.split('/')[4]) return res.end('Wrong Post URL');
            postId = urlMedia.split('/')[4];
    
            path = '/p/' + postId + '/';
            toReplace = "window.__additionalDataLoaded('" + path + "',";
            
            let headers = {
                'authority': 'www.instagram.com',
                'host': 'www.instagram.com',
                'method': 'GET',
                'path': path,
                'scheme': 'https',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-encoding': 'deflate, br',
                'accept-language': 'en-GB;q=0.9,en',
                'cache-control': 'max-age=0',
                'cookie': 'mid=YZpl5QAEAAHgCYmM-lARFsCw2H9A; ig_did=08EFF7FA-B4D6-4C68-89D8-0D8ABE07E757; ig_nrcb=1; csrftoken=nbjAHk0cjrFjy9qS0ULWwjoDrVXAUT4P; ds_user_id=48344910629; sessionid=48344910629%3AGw3FbWpN3KpLKp%3A9; shbid="2658\05448344910629\0541669045649:01f79d53048c28daadc8006aa6adfe0a678357591de38e8da22525667776f8a799edb5e7"; shbts="1637509649\05448344910629\0541669045649:01f74e1ef96029d2d4cd26d44d9dda9e4c4f115a273715706e3f185ddd9608ca7781ddea"; rur="ASH\05448344910629\0541669242660:01f77a793c0da23d46f96de5ef592c742836dc8d61d9ce1abe8b1f3e333c4756bf2f8db6"',
                'dnt': '1',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
                'sec-ch-ua-mobile': '?0',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
            }
    
            axios.get(urlMedia, { headers: headers }).then((result) => {
                let $ = cheerio.load(result.data), insta = [];
                $('script[type="text/javascript"]').each((i, element) => {
                    let cheerioElement = $(element);
                    var contentScript = cheerioElement.html();
                    if (contentScript.search('shortcode_media') != -1) {
                        contentScript = contentScript.replace(toReplace, '');
                        contentScript = contentScript.replace(');', '');
                        var jsonScript = JSON.parse(contentScript);
                        var mediaData = jsonScript.graphql.shortcode_media;
                        if (!mediaData.edge_sidecar_to_children) {
                            if (mediaData.is_video) insta.push(mediaData.video_url);
                            else insta.push(mediaData.display_url);
                        } else {
                            for (var m of mediaData.edge_sidecar_to_children.edges) {
                                var data = m.node;
                                if (data.is_video) insta.push(data.video_url);
                                else insta.push(data.display_url);
                            }
                        }
                    }
                });
                resolve({
                    mediaList: insta,
                });
            })
            .catch((err) => {
                reject(err);
            });
        });
        urlList.then((success) => res.json(success), (err) => sendError(res, err, 'ErrorCode01'));
    } catch (err) {
        sendError(res, err,  'ErrorCode01');
    }
});

const server = app.listen(3001);
server.setTimeout(30 * 1000);
server.keepAliveTimeout = 30 * 1000;
server.headersTimeout = 31 * 1000;

const sendError = (res, error, errorCode) => {
	console.log(`Error is ${errorCode}`);
	console.log(`Error is ${error}`);
	res.json({ Error: error, mediaList: [] });
};