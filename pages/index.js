import Head from "next/head";
import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from "react";
import { FcSearch } from 'react-icons/fc';
import { BsQuestionCircleFill } from 'react-icons/bs';
import { SiOpenai } from 'react-icons/si';
import { hasCookie, getCookie  } from 'cookies-next';

import Header from './components/header'

import { Lobster, Inter } from '@next/font/google'


const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
})

const inter = Inter({
  weight: '700',
  subsets: ['latin'],
})

export default function Home() {

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reqBody, setReqBody] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("day");



  async function onSubmit(event) {
    speechSynthesis.cancel();
    event.preventDefault();
    setSearchLoading(true);
    setLoading(true);
    setResult("");

    const response = await fetch("/api/endpoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reqBody: reqBody }),
    });
    const data = await response.json();
    setResult(data.result.replaceAll("\n", "<br />").replace("<br /><br />", "").trim());
    setLoading(false);
    setSearchLoading(false);
    if(hasCookie('voice') && getCookie('voice') == true){
      voiceResult(data.result.replaceAll("\n", " "));
    }
  }


  const sendMode = (cngMode) => {
    setMode(cngMode);
  };

  const voiceResult = (content) => {
    let utterance = new SpeechSynthesisUtterance(content);
    let voicesArray = speechSynthesis.getVoices();
    utterance.voice = voicesArray[2];
    speechSynthesis.speak(utterance);
  }

 


  return (
    <div className={`${styles.wrap} ${mode == 'day' ? styles.day : styles.night}`}>
      <Header sendMode={sendMode} />
      <div className={`${styles.main} ${(!loading || searchLoading ) ? styles.maintop : ''}`}>
        <Head>
          <title>OpenAI - WebMaster</title>
        </Head>
        <div className={styles.mainContainer}>
          <main >
            {loading && !searchLoading && (
              <form onSubmit={onSubmit}>
                <h3 className={`${styles.center} ${styles.title} ${lobster.className}`}>Webmaster</h3>
                <div className={styles.inputSection}>
                  <input type="text" className={`form-control mb-4 ${styles.input}`} placeholder="Ask me anything..." onChange={(e) => setReqBody(e.target.value)} />
                  <div className={styles.serachIcon}>
                    <FcSearch size={30} onClick={onSubmit} className={styles.icons}/>
                  </div>
                </div>
                <div className={`${styles.center} ${styles.tagline} ${inter.className}`}>Tired of browsing? Ask Webster</div>
              </form>
            )}
            {(!loading || searchLoading )&& (
              <form onSubmit={onSubmit}>
                <div className={`row ${styles.rela}`}>
                  <div className="col-lg-4"><h3 className={`${styles.title} ${lobster.className}`}>Webmaster</h3></div>
                  <div className={`${styles.inputSection} col-lg-8`}>
                    <input type="text" className={`form-control ${styles.input}`} placeholder="Ask me anything..." onChange={(e) => setReqBody(e.target.value)} />
                    <div className={styles.serachIconNew}>
                      <FcSearch size={30} onClick={onSubmit} className={styles.icons} />
                    </div>
                  </div>
                </div>

              </form>
            )}
            {searchLoading && (
              <div className="row mt-5">
                <div className={`col-lg-1 col-md-1  ${styles.col1}`}>
                  <div className={styles.iconbox}>
                    <BsQuestionCircleFill color="#fff" />
                  </div>
                </div>
                <div className={`col-lg-11 col-md-11  ${styles.col11}`}>
                  <div className={styles.resbox}>Loading...</div>
                </div>
              </div>
            )}
            {!loading && !searchLoading && (
              <div className="mt-5">
                <div className="row">
                <div className={`col-lg-1 col-md-1  ${styles.col1}`}>
                    <div className={styles.iconbox}>
                      <BsQuestionCircleFill color="#fff" />
                    </div>
                  </div>
                  <div className={`col-lg-11 col-md-11 ${styles.col11}`}>
                    <div className={styles.resbox}>{reqBody}</div>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className={`col-lg-1 col-md-1  ${styles.col1}`}>
                    <div className={`${styles.iconbox} ${styles.green}`}>
                      <SiOpenai color="#fff" />
                    </div>
                  </div>
                  <div className={`col-lg-11 col-md-11 ${styles.col11}`}>
                    <div className={styles.resbox}>
                      <div
                        className={`${styles.result}`}
                        dangerouslySetInnerHTML={{ __html: result }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>

  );
}
