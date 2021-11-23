import Head from 'next/head';
import axios from 'axios';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useState } from 'react';

export default function Home() {
	const [isActive, setActive] = useState(false);
	const fetchMedia = async (event) => {
		setActive(!isActive);
		event.preventDefault();
		let postURL = event.target.postURL.value;
		await axios
			.get('http://localhost:3001/?postURL=' + postURL)
			.then(function (response) {
				if (response.data.mediaList.length === 1) {
					saveAs(response.data.mediaList[0], Math.floor(Math.random() * 999999999999999999999));
					setActive(isActive);
				} else if (response.data.mediaList.length > 1) {
					let zip = new JSZip();
					let folder = zip.folder('collection');

					for (const mediaFile of response.data.mediaList) {
						const mediaName = Math.floor(Math.random() * 999999999999999999999) + '.jpg';
						const imageBlob = fetch(mediaFile).then((response) => response.blob());
						folder.file(mediaName, imageBlob);
					}
					folder.generateAsync({ type: 'blob' }).then((content) => saveAs(content, Math.floor(Math.random() * 999999999999999999999) + '.zip'));
					setActive(isActive);
				}
			})
			.catch(function (error) {
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
