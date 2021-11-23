const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const validUrl = require('valid-url');
const cors = require('cors');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const findRemoveSync = require('find-remove');
const app = express();
app.use(cors({ origin: '*' }));

let outputFolder = path.join(__dirname, './output/');
let uniqueUUID = null;
let outputPath = null;
let outputChildFolder = null;
let baseURL = 'http://localhost/output/';
let mediaURL = null;

setInterval(() => {
	findRemoveSync(outputFolder, { age: { seconds: 3600 }, dir: '*' });
}, 60000);

app.get('/', (req, res) => {
	try {
		if (!req.query.postURL || !validUrl.isUri(req.query.postURL)) return res.end('Wrong Post URL');
		urlMedia = req.query.postURL;

		if (!urlMedia.split('/')[2] === 'www.instagram.com') return res.end('Wrong Post URL');
		if (!urlMedia.split('/')[3] === 'p' || !urlMedia.split('/')[3] === 'reel') return res.end('Wrong Post URL');
		urlMedia = urlMedia.replace('reel', 'p');

		if (!urlMedia.split('/')[4]) return res.end('Wrong Post URL');
		postId = urlMedia.split('/')[4];

		pathh = '/p/' + postId + '/';
		toReplace = "window.__additionalDataLoaded('" + pathh + "',";

		let headers = {
			authority: 'www.instagram.com',
			host: 'www.instagram.com',
			method: 'GET',
			path: pathh,
			scheme: 'https',
			accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			'accept-encoding': 'deflate, br',
			'accept-language': 'en-GB;q=0.9,en',
			'cache-control': 'max-age=0',
			cookie: '',
			dnt: '1',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
			'sec-ch-ua-mobile': '?0',
			'sec-fetch-dest': 'document',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-site': 'same-origin',
			'sec-fetch-user': '?1',
			'upgrade-insecure-requests': '1',
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
		};

		axios
			.get(urlMedia, { headers: headers })
			.then((result) => {
				let $ = cheerio.load(result.data),
					insta = [];
				$('script[type="text/javascript"]').each(async (i, element) => {
					let cheerioElement = $(element);
					var contentScript = cheerioElement.html();
					if (contentScript.search('shortcode_media') != -1) {
						contentScript = contentScript.replace(toReplace, '');
						contentScript = contentScript.replace(');', '');
						var jsonScript = JSON.parse(contentScript);
						var mediaData = jsonScript.graphql.shortcode_media;
						uniqueUUID = uuid.v4();
						outputChildFolder = outputFolder + uniqueUUID;
						await makeDirectory(res, outputChildFolder);
						if (!mediaData.edge_sidecar_to_children) {
							if (mediaData.is_video) {
								mediaName = Math.floor(Math.random() * 999999999999999999999) + '.mp4';
								mediaURL = baseURL + uniqueUUID + '/' + mediaName;
								outputPath = outputChildFolder + '/' + mediaName;
								await downloadImage(res, mediaData.video_url, outputPath);
								insta.push(mediaURL);
							} else {
								mediaName = Math.floor(Math.random() * 999999999999999999999) + '.jpg';
								mediaURL = baseURL + uniqueUUID + '/' + mediaName;
								outputPath = outputChildFolder + '/' + mediaName;
								await downloadImage(res, mediaData.display_url, outputPath);
								insta.push(mediaURL);
							}
						} else {
							for (var m of mediaData.edge_sidecar_to_children.edges) {
								var data = m.node;
								if (data.is_video) {
									mediaName = Math.floor(Math.random() * 999999999999999999999) + '.mp4';
									mediaURL = baseURL + uniqueUUID + '/' + mediaName;
									outputPath = outputChildFolder + '/' + mediaName;
									await downloadImage(res, mediaData.video_url, outputPath);
									insta.push(mediaURL);
								} else {
									mediaName = Math.floor(Math.random() * 999999999999999999999) + '.jpg';
									mediaURL = baseURL + uniqueUUID + '/' + mediaName;
									outputPath = outputChildFolder + '/' + mediaName;
									await downloadImage(res, mediaData.display_url, outputPath);
									insta.push(mediaURL);
								}
							}
						}
						res.json({ mediaList: insta });
					}
				});
			})
			.catch((err) => {
				sendError(res, 'ErrorCode01');
			});
	} catch (err) {
		sendError(res, 'ErrorCode02');
	}
});

const server = app.listen(3001);
server.setTimeout(30 * 1000);
server.keepAliveTimeout = 30 * 1000;
server.headersTimeout = 31 * 1000;

const makeDirectory = async (res, outputChildFolder) => {
	return new Promise((resolve) => {
		fs.mkdir(outputChildFolder, { recursive: true }, (err) => {
			if (err) {
				sendError(res, 'ErrorCode03');
			} else {
				resolve();
			}
		});
	});
};

const downloadImage = async (res, url, filepath) => {
	const response = await axios({ url, method: 'GET', responseType: 'stream' });
	return new Promise((resolve) => {
		response.data
			.pipe(fs.createWriteStream(filepath))
			.on('error', () => sendError(res, 'ErrorCode04'))
			.once('close', () => resolve(filepath));
	});
};

const sendError = (res, error) => {
	console.log(`Error is ${error}`);
	res.json({ Error: error, mediaList: [] });
};
