import Head from 'next/head';
import axios from 'axios';

export default function Home() {
	const fetchMedia = async (event) => {
		event.preventDefault();
		let postURL = event.target.postURL.value;
		await axios.get('http://localhost:3001/?postURL=' + postURL)
			.then(function (response) {
				console.log(response.data);
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
							<span>Download</span>
						</span>
					</button>
				</div>
				<div className='divTwo'>
					<button className='divTwoBtn' type='submit'>
						<span className='divBtnCommon'>
							<span>Download</span>
						</span>
					</button>
				</div>
			</form>
		</div>
	);
}
