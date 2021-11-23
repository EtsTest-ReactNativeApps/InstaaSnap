import Head from 'next/head';
import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';

export default function Home() {
	let [isActive, setActive] = useState(false);
	const fetchMedia = async (event) => {
		setActive(!isActive);
		event.preventDefault();
		let postURL = event.target.postURL.value;
		await axios
			.get('http://localhost:3001/?postURL=' + postURL)
			.then(async (response) => {
				if (response.data.mediaList.length === 1) {
					let imageBlob = await fetch(response.data.mediaList[0])
					.then(response => response.blob());
					if (response.data.mediaList[0].search(".mp4") === -1) {
						saveAs(imageBlob, Math.floor(Math.random() * 999999999999999999999) + '.jpg');
					} else saveAs(imageBlob, Math.floor(Math.random() * 999999999999999999999) + '.mp4');

					setActive(isActive);
				} else if (response.data.mediaList.length > 1) {
					let zip = new JSZip();
					let folder = zip.folder('collection');
					for (let mediaFile of response.data.mediaList) {

						let mediaName = null;
						if (mediaFile.search(".mp4") === -1) {
							mediaName = Math.floor(Math.random() * 999999999999999999999) + '.jpg';
						} else mediaName = Math.floor(Math.random() * 999999999999999999999) + '.mp4';

						let imageBlob = await fetch(mediaFile)
						.then(response => response.blob());
						folder.file(mediaName, imageBlob);
					}
					folder.generateAsync({ type: 'blob' }).then((content) => saveAs(content, Math.floor(Math.random() * 999999999999999999999) + '.zip'));
					setActive(isActive);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div className='mainDiv'>
			<Head>
				<title>Instagram Post Downloader</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<form onSubmit={fetchMedia}>
				<div className='divOne'>
					<input id='postURL' name='postURL' placeholder='https://www.instagram.com/p/mrwuv6sso2r/' className='divOneInput' />
					<button className='divOneBtn' type='submit'>
						<span className='divBtnCommon'>
							Download
							<span className={isActive ? 'showspinner' : 'hidespinner'}>-</span>
						</span>
					</button>
				</div>
				<div className='divTwo'>
					<button className='divTwoBtn' type='submit'>
						<span className='divBtnCommon'>
							Download
							<span className={isActive ? 'showspinner' : 'hidespinner'}>-</span>
						</span>
					</button>
				</div>
			</form>
		</div>
	);
}
