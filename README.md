# Niyyah.space

**Niyyah** is a calm Muslim companion web application. It gently locks your most distracting apps during prayer windows and opens them again once you've prayed and verified your prayer. 

## Features

- **The Lock:** Choose distracting apps to be locked during prayer windows. Includes a 5-minute buffer before prayers and instant release upon verification.
- **Voice Verification:** Confirm you've prayed using your voice! Powered by the Web Speech API, with robust phonetic fallback logic to handle engine misrecognitions of Arabic prayer names (like Dhuhr, Fajr, Asr).
- **Accurate Timings & Qibla:** GPS prayer times (cached for offline use), local masjid timings, and an interactive Qibla compass dial.
- **Quran, Hadith, and Azkar:** Read the Quran and Hadith in a quiet, distraction-free environment. Keep track of your Azkar with an interactive counter.
- **Private & Local-First:** Designed with privacy in mind. Your worship and reflection data stays on your device.

## Project Structure

This repository contains two parts:
1. **Vanilla Site:** The original, fully-featured single-page website built with HTML, CSS, and Vanilla JavaScript (`Niyyah_ live with intention (1).html`). 
2. **React Prototype (`/niyyah-react`):** A modern React port of the Voice Verification feature, built using Vite and `react-speech-recognition` to demonstrate how the core logic translates to a React architecture.

## How to Run

### Vanilla Site
To use the Web Speech API (Voice Verification), modern browsers require a secure context or a local web server. **Do not just double-click the HTML file.**
1. Open your terminal in the root folder.
2. Run a simple HTTP server (for example, using Python): `python -m http.server 8000`
3. Visit `http://localhost:8000/Niyyah_%20live%20with%20intention%20(1).html` in **Google Chrome** or **Microsoft Edge**. (Note: Browsers like Brave disable the Google Speech API for privacy reasons).

### React Prototype
To run the React version of the verification flow:
1. Navigate into the React folder: `cd niyyah-react`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Visit `http://localhost:5173/` in your browser.

## License
MIT Licensed. Built by Faizan Patel.
