import Head from 'next/head';

export default function Home() {
	return (
		<div className='containerParent'>
			<Head>
				<title>Instagram Post Downloader</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
      <div className="containerChild">
        <h1 className='heading'>Privacy Policy</h1>
        <p className='paragraph'>1. At InstaaSnap, we care about your privacy.</p>
        <p className='paragraph'>2. We believe in complete transparency.</p>
        <p className='paragraph'>3. We're committed to being upfront about our privacy practices.</p>
        <p className='paragraph'>4. We do not collect, store or save any information at all.</p>
        <p className='paragraph'>5. We do not use cookies.</p>
        <p className='paragraph'>6. We do not save any logs.</p>
        <p className='paragraph'>7. We do not have any database.</p>
        <p className='paragraph'>8. We do not use any form of analytics.</p>
        <p className='paragraph'>9. We never host any type of content on our site, we provide only public information.</p>
      </div>
		</div>
	);
}
