# AdReel Studio

Paste an advertising script to generate a storyboard, customise its scene text and visual style, preview the vertical ad, and record it as a WebM video in your browser.

## Files
- `index.html` — single-page browser app
- `README.md` — project overview and usage
- `PROJECT-NOTES.md` — project notes

## Run
Open `index.html` in a modern browser. Paste an ad script and select **Build storyboard**. Review and edit the storyboard JSON, preview the animation, then select **Record video** and download the result.

## AI and API keys
This version uses a built-in script parser to make storyboard scenes offline. For a Gemini or other AI integration, add a server-side endpoint and keep private API keys out of browser code.

## Notes
Recording support depends on browser MediaRecorder and canvas capture support. The current browser recorder exports WebM.
