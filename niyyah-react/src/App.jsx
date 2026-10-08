import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Utility functions for fuzzy matching
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return d[a.length][b.length];
};

const norm = s => s.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
const sim = (a, b) => {
  a = norm(a); b = norm(b);
  const L = Math.max(a.length, b.length) || 1;
  return 1 - lev(a, b) / L;
};

const ALTS = {
  "Fajr": ["fajr", "badger", "fadger", "fire", "fudge", "far", "for", "budget"],
  "Dhuhr": ["dhuhr", "door", "tour", "zohar", "zuhr", "zour", "do", "poor", "zuhur", "or"],
  "Asr": ["asr", "author", "arthur", "answer", "asser", "usher", "oscar", "offer", "pressure"],
  "Maghrib": ["maghrib", "margaret", "migraine", "mac rib", "mcrib", "maghreb", "mock rib", "macro"],
  "Isha": ["isha", "asia", "asha", "issue", "eesha", "alicia", "is a"]
};

function getScore(heard, targetPrayer) {
  let h = heard.toLowerCase();
  h = h.replace(/^(ipad|i pad|i paid|i played|i grade|i pray|high|i spread|i fade|i trade|i try|i tried|i pride)\b/, "i prayed");
  if (h.includes("high pressure")) h = "i prayed asr";
  if (h.includes("ipad or") || h.includes("i pad or")) h = "i prayed dhuhr";

  let maxS = sim(h, "i prayed " + targetPrayer.toLowerCase());
  for (let a of (ALTS[targetPrayer] || [])) {
    maxS = Math.max(maxS, sim(h, "i prayed " + a));
  }
  return Math.round(maxS * 100);
}

export default function App() {
  const [prayer, setPrayer] = useState("Dhuhr");
  const [result, setResult] = useState(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      // Finished listening
      const score = getScore(transcript, prayer);
      setResult({ score, heard: transcript });
    } else if (listening && transcript) {
      setResult({ interim: transcript });
    }
  }, [listening, transcript, prayer]);

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) return;
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      setResult(null);
      SpeechRecognition.startListening();
    }
  };

  const getResultClass = () => {
    if (!result) return "";
    if (result.interim) return "";
    return result.score >= 72 ? "ok" : "no";
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="result no" style={{margin: '2rem'}}>
      <strong>Voice isn't supported in this browser</strong>
      <span>Try Chrome or Edge. (Brave blocks the speech API)</span>
    </div>;
  }

  return (
    <main id="top">
      <section className="section section--tight" id="verify">
        <div className="content split split--flip">
          <div className="stack reveal in">
            <h2 className="title">React Speech Recognition</h2>
            <p className="lede">This is the verification section converted to a React component using `react-speech-recognition`.</p>
            <p className="small">Remember that React libraries still rely on the underlying browser Web Speech API, so the accuracy will remain exactly the same as the vanilla implementation.</p>
          </div>
          <div className="glass panel reveal in">
            <div className="field">
              <label htmlFor="vPrayer">Which prayer did you just pray?</label>
              <select id="vPrayer" value={prayer} onChange={e => {
                setPrayer(e.target.value);
                setResult(null);
              }}>
                <option value="Fajr">Fajr</option>
                <option value="Dhuhr">Dhuhr</option>
                <option value="Asr">Asr</option>
                <option value="Maghrib">Maghrib</option>
                <option value="Isha">Isha</option>
              </select>
            </div>
            
            <p className="small" id="vTarget">Say or type: <b style={{color:'var(--text)', fontWeight: 500}}>“I prayed {prayer}”</b></p>
            
            <div>
              <button 
                className={`mic ${listening ? 'live' : ''}`} 
                onClick={handleMicClick}
                aria-label="Tap and speak"
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="3" width="6" height="12" rx="3"/>
                  <path d="M5 11a7 7 0 0014 0M12 18v3"/>
                </svg>
              </button>
            </div>

            <div className={`result ${getResultClass()}`} aria-live="polite">
              {!isMicrophoneAvailable && !listening && !result && (
                <>
                  <strong>Microphone blocked</strong>
                  <span>Allow microphone access in your browser.</span>
                </>
              )}
              {isMicrophoneAvailable && !listening && !result && (
                <>
                  <strong>Waiting for you</strong>
                  <span>The result appears here.</span>
                </>
              )}
              {listening && (
                <>
                  <strong>Listening…</strong>
                  <span>{result?.interim ? `Hearing: “${result.interim}”` : `Say “I prayed ${prayer}”. Tap the mic to stop.`}</span>
                </>
              )}
              {!listening && result && result.score !== undefined && (
                <>
                  <strong>{result.score >= 72 ? `Verified, ${result.score}% match` : `Not quite, ${result.score}% match`}</strong>
                  <span>Heard “{result.heard}”. {result.score >= 72 ? "Close enough, so the lock lifts." : "Try again when you're ready."}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
