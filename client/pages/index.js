import Head from 'next/head'

export default function Home() {
  return (
    <div className='mainDiv'>
      <Head>
        <title>Instagram Post Downloader</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='public-page-wrap pt-192 xs:pt-120'>
        <div className='divOne'>
          <input placeholder='https://www.instagram.com/p/mrwuv6sso2r/' className='divOneInput' />
          <button className='divOneBtn'>
            <span className='divBtnCommon'><span>Download</span></span>
          </button>
        </div>
        <div className='divTwo'>
          <button className='divTwoBtn'>
            <span className='divBtnCommon'><span>Download</span></span>
          </button>
        </div>
      </div>
    </div>
  );
}
