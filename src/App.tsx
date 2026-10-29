import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StoryboardData,
  AdType,
  AdStyle,
  Scene,
} from './types';
import {
  offline,
  norm,
  plan,
  renderAdFrame,
  music,
  createOffscreenBuffers,
  TEMPLATES,
  WHITEBOARD_PALETTES,
  OffscreenBuffers,
} from './utils/engine';

const DEFAULT_SCRIPT = `🚀 GROW YOUR BUSINESS WITH GGD AD NETWORK!

Are you a business owner, entrepreneur or online seller looking for more visibility?

GGD Ad Network by Goodgift Digital helps businesses promote their products and services through managed WhatsApp advertising campaigns.

✅ WhatsApp Status promotion
✅ Group, channel and community placements
✅ Coordinated campaigns through our promoter network
✅ Advertising options for different budgets
✅ Campaign delivery updates

🔥 Introductory campaigns start from ₦3,000!

Stop relying only on people who already know your business. Let’s help more potential customers discover what you offer.

📩 Send us a message today to discuss your campaign and get started.

GGD Ad Network — Helping Businesses Grow.`;

const PROMPT_TEMPLATE = (s: string) =>
  `You are an ad storyboard director. Turn the ad script below into a short animated video plan. Reply with ONLY JSON: {"type":"one of growth|retail|food|fashion|tech|auto|property|beauty|edu|office|gym|farm|health","style":"flat (colorful cartoon) or board (whiteboard sketch) or human (clean explainer with people)","brand":"","tagline":"","palette":{"accent":"#hex","top":"#hex dark","bottom":"#hex dark"},"scenes":[{"k":"hook","t":"headline, max 8 words","s":"one short hook line"},{"k":"story","t":"problem or key message","s":"supporting line"},{"k":"demo","t":"show the product or service","s":"short explanation"},{"k":"steps","t":"how it works","items":["step one","step two","step three"]},{"k":"testimonial","t":"customer quote","s":"supporting line"},{"k":"stats","t":"results headline","items":["result one","result two"]},{"k":"compare","t":"before and after","s":"transformation line"},{"k":"presenter","t":"a person explains the solution","s":"short spoken-style explanation","items":["key point one","key point two"]},{"k":"conversation","t":"customer question","s":"helpful reply","items":["main benefit"]},{"k":"team","t":"team collaboration headline","s":"supporting line"},{"k":"list","t":"short title","items":["max 6 short benefits"]},{"k":"offer","t":"offer text without the price","p":"price such as ₦3,000 or 50% OFF"},{"k":"cta","t":"call to action"}]}. Use 4 to 8 scenes, always start with hook and end with cta. For human-style explainer videos, add presenter, conversation or team scenes where appropriate, and include people visibly acting, talking, gesturing and demonstrating the service. Add demo, steps, testimonial, stats or compare when the script supports them. Omit irrelevant scene types, list or offer when absent. Pick the type and colors that fit the business. Keep the script language. SCRIPT:\n` +
  s;

export const App: React.FC = () => {
  // AdReel state
  const [script, setScript] = useState<string>(DEFAULT_SCRIPT);
  const [graphicTemplate, setGraphicTemplate] = useState<string>('auto');
  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('adk') || '';
    } catch {
      return '';
    }
  });
  const [style, setStyle] = useState<string>('auto');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [wbStoryTemplate, setWbStoryTemplate] = useState<string>('problem');

  // Storyboard state
  const [storyboard, setStoryboard] = useState<StoryboardData>(() => offline(DEFAULT_SCRIPT));
  const [storyboardJson, setStoryboardJson] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingStatus, setRecordingStatus] = useState<string>('');
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buffersRef = useRef<OffscreenBuffers | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Initialize offscreen buffers once
  useEffect(() => {
    buffersRef.current = createOffscreenBuffers();
  }, []);

  // Sync storyboard with formatted JSON string
  const updateStoryboardState = useCallback(
    (sb: any, skipJson = false, styleOverride?: string) => {
      const normalized = norm(sb);
      const chosenStyle =
        styleOverride !== undefined
          ? styleOverride
          : style !== 'auto'
          ? style
          : normalized.style ||
            ({ edu: 'board', tech: 'human', office: 'human', health: 'human', growth: 'human' }[normalized.type] || 'flat');
      normalized.style = chosenStyle;

      setStoryboard(normalized);

      if (!skipJson) {
        setStoryboardJson(
          JSON.stringify(
            {
              type: normalized.type,
              style: normalized.style,
              brand: normalized.brand,
              tagline: normalized.tagline,
              palette: normalized.palette,
              scenes: normalized.scenes.map((s) => {
                const r: any = { k: s.k, t: s.t };
                if (s.s) r.s = s.s;
                if (s.p) r.p = s.p;
                if (s.items && s.items.length) r.items = s.items;
                return r;
              }),
            },
            null,
            1
          )
        );
      }
    },
    [style]
  );

  // Initial load
  useEffect(() => {
    updateStoryboardState(offline(DEFAULT_SCRIPT));
  }, []);

  // Update localStorage when apiKey changes
  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    try {
      localStorage.setItem('adk', val);
    } catch {}
  };

  // Main canvas render frame
  const drawAdFrame = useCallback(
    (t: number) => {
      if (!canvasRef.current || !buffersRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      renderAdFrame(ctx, storyboard, t, buffersRef.current);
    },
    [storyboard]
  );

  // Animation loop for AdReel
  useEffect(() => {
    const loop = (n: number) => {
      const dt = Math.min(0.1, (n - lastTimeRef.current) / 1000);
      lastTimeRef.current = n;
      const totalDur = plan(storyboard).tot;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= totalDur) {
            if (isRecording) {
              finishRecording();
              return totalDur - 0.01;
            }
            return 0;
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, isRecording, storyboard]);

  // Render when time or storyboard changes
  useEffect(() => {
    drawAdFrame(currentTime);
  }, [currentTime, drawAdFrame]);

  // Handle template selection
  const handleTemplateChange = (val: string) => {
    setGraphicTemplate(val);
    if (val === 'auto') {
      updateStoryboardState(offline(script));
      return;
    }
    const t = TEMPLATES[val];
    if (t) {
      setStyle(t.style);
      const updated = {
        ...storyboard,
        type: t.type as AdType,
        style: t.style,
        palette: {
          accent: t.pal[0],
          top: t.pal[1],
          bottom: t.pal[2],
        },
      };
      updateStoryboardState(updated, false, t.style);
    }
  };

  // Handle style dropdown
  const handleStyleChange = (val: string) => {
    setStyle(val);
    updateStoryboardState(storyboard, false, val === 'auto' ? undefined : val);
  };

  // Smart build
  const handleSmartBuild = async () => {
    const t = script.trim();
    if (!t) {
      setStatusMessage('Paste your script first.');
      return;
    }
    setStatusMessage('✨ Planning your storyboard…');
    let sb: any = null;
    let aiUsed = false;

    if (apiKey.trim()) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
            apiKey.trim()
          )}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: PROMPT_TEMPLATE(t) }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          sb = JSON.parse(text);
          aiUsed = true;
        }
      } catch (err) {
        console.error('Gemini API call error:', err);
      }
    }

    if (!sb) {
      sb = offline(t);
      aiUsed = false;
    }

    updateStoryboardState(sb);
    if (graphicTemplate !== 'auto') {
      const tmpl = TEMPLATES[graphicTemplate];
      if (tmpl) {
        sb.type = tmpl.type;
        sb.style = tmpl.style;
        sb.palette = { accent: tmpl.pal[0], top: tmpl.pal[1], bottom: tmpl.pal[2] };
        updateStoryboardState(sb, false, tmpl.style);
      }
    }

    setRecordedVideoUrl(null);
    setCurrentTime(0);
    setIsPlaying(true);
    setStatusMessage(
      aiUsed
        ? 'Storyboard ready with AI. Check the preview, then record.'
        : 'Built with the offline reader (best with ✅ 🔥 📩 style scripts). Add a Gemini key for the AI storyboard.'
    );
  };

  // Clear script
  const handleClearScript = () => {
    setScript('');
  };

  // Whiteboard story build
  const handleBuildWhiteboardStory = () => {
    const tx = script.trim();
    if (!tx) {
      setStatusMessage('Paste your script first, then build a whiteboard story.');
      return;
    }
    const o = offline(tx);
    const parsed = {
      brand: o.brand || 'Your Business',
      headline: o.scenes.find((s) => s.k === 'hook')?.t || 'A Better Way to Get Things Done',
      problem: o.scenes.find((s) => s.k === 'story')?.t || 'Many people face this challenge every day.',
      solution: o.scenes.find((s) => s.k === 'story')?.s || 'Here is a simple, practical solution.',
      benefits: (o.scenes.find((s) => s.k === 'list')?.items || []).filter(Boolean).slice(0, 4),
      tagline: o.tagline,
      cta: o.scenes.find((s) => s.k === 'cta')?.t,
    };

    const mode = wbStoryTemplate;
    let scenes: Scene[] = [];
    const hook: Scene = { k: 'hook', t: parsed.headline, s: 'Let us explain it simply.' };
    const story: Scene = { k: 'story', t: parsed.problem, s: parsed.solution };
    const presenter: Scene = {
      k: 'presenter',
      t: 'HERE IS THE IDEA',
      s: parsed.solution,
      items: parsed.benefits.slice(0, 2).length ? parsed.benefits.slice(0, 2) : ['A simple solution', 'Clear benefits'],
    };
    const demo: Scene = { k: 'demo', t: 'SEE HOW IT WORKS', s: parsed.solution, items: parsed.benefits.slice(0, 3) };
    const steps: Scene = {
      k: 'steps',
      t: 'FOLLOW THESE SIMPLE STEPS',
      items:
        parsed.benefits.length >= 3
          ? parsed.benefits.slice(0, 4)
          : ['Identify what you need', 'Choose the right solution', 'Take the next step'],
    };
    const testimonial: Scene = { k: 'testimonial', t: 'A BETTER EXPERIENCE', s: parsed.solution };
    const compare: Scene = { k: 'compare', t: 'FROM PROBLEM TO PROGRESS', s: `${parsed.problem} → ${parsed.solution}` };
    const stats: Scene = {
      k: 'stats',
      t: 'THE BENEFITS AT A GLANCE',
      items: parsed.benefits.length ? parsed.benefits.slice(0, 3) : ['Save time', 'Make things easier', 'Move forward with confidence'],
    };
    const team: Scene = { k: 'team', t: 'WORKING TOGETHER', s: parsed.solution };
    const cta: Scene = { k: 'cta', t: parsed.cta || `Contact ${parsed.brand} today` };

    if (mode === 'problem') scenes = [hook, story, presenter, demo, stats, cta];
    else if (mode === 'howto') scenes = [hook, story, steps, demo, stats, cta];
    else if (mode === 'product')
      scenes = [
        hook,
        story,
        presenter,
        demo,
        {
          k: 'list',
          t: 'WHY CHOOSE THIS SOLUTION',
          items: parsed.benefits.length ? parsed.benefits : ['Easy to understand', 'Designed around your needs', 'Simple to get started'],
        },
        cta,
      ];
    else if (mode === 'customer') scenes = [hook, story, testimonial, demo, stats, cta];
    else if (mode === 'journey') scenes = [hook, compare, story, demo, stats, cta];
    else if (mode === 'lesson')
      scenes = [
        hook,
        story,
        steps,
        presenter,
        {
          k: 'list',
          t: 'REMEMBER THESE KEY POINTS',
          items: parsed.benefits.length ? parsed.benefits : ['Understand the idea', 'Apply it step by step', 'Keep practising'],
        },
        cta,
      ];
    else if (mode === 'community')
      scenes = [
        hook,
        team,
        { k: 'conversation', t: 'A QUESTION WE OFTEN HEAR', s: parsed.solution, items: parsed.benefits.slice(0, 2) },
        steps,
        cta,
      ];
    else
      scenes = [
        hook,
        story,
        presenter,
        steps,
        {
          k: 'list',
          t: 'HOW THIS HELPS YOU',
          items: parsed.benefits.length ? parsed.benefits : ['Explain your offer clearly', 'Show the value', 'Invite people to take action'],
        },
        cta,
      ];

    const palette = WHITEBOARD_PALETTES[mode] || WHITEBOARD_PALETTES.problem;
    const sb: StoryboardData = {
      type: mode === 'product' ? 'tech' : mode === 'lesson' ? 'edu' : 'office',
      style: 'board',
      brand: parsed.brand,
      tagline: parsed.tagline || '',
      palette,
      scenes,
    };

    setStyle('board');
    setGraphicTemplate('whiteboard');
    updateStoryboardState(sb, false, 'board');
    setStatusMessage(
      `Whiteboard story built with ${scenes.length} scenes. Press Play to preview, edit the storyboard if needed, then record & download.`
    );
  };

  // Storyboard JSON manual edit
  const handleStoryboardJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setStoryboardJson(val);
    try {
      const parsed = JSON.parse(val);
      updateStoryboardState(parsed, true);
      setStatusMessage('');
    } catch {
      setStatusMessage('Storyboard JSON has an error. Fix it to update the preview.');
    }
  };

  // Play / Pause toggle
  const handleTogglePlay = () => {
    if (isRecording) return;
    const totalDur = plan(storyboard).tot;
    if (!isPlaying && currentTime >= totalDur - 0.05) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Scrubber slider change
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRecording) return;
    const val = parseFloat(e.target.value);
    const totalDur = plan(storyboard).tot;
    const newTime = (val / 1000) * totalDur;
    setCurrentTime(newTime);
    drawAdFrame(newTime);
  };

  // Recording
  const startRecording = async () => {
    if (!canvasRef.current) return;
    const supportedMimes = [
      'video/mp4;codecs=avc1',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    const mimeType = supportedMimes.find((m) => window.MediaRecorder && MediaRecorder.isTypeSupported(m));
    if (!mimeType) {
      setStatusMessage('This browser can’t record video. Please open the page in Chrome or Safari.');
      return;
    }

    setRecordedVideoUrl(null);
    setRecordingStatus('');

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioCtx.resume();
      audioContextRef.current = audioCtx;

      const dest = audioCtx.createMediaStreamDestination();
      const totalDur = plan(storyboard).tot;
      music(audioCtx, dest, storyboard, totalDur);

      const canvasStream = canvasRef.current.captureStream(30);
      dest.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));

      const chunks: Blob[] = [];
      const mr = new MediaRecorder(canvasStream, { mimeType, videoBitsPerSecond: 4000000 });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mr.onstop = () => {
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: `video/${ext}` });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecording(false);
        setIsPlaying(false);
        setStatusMessage('');

        if (ext === 'webm') {
          setRecordingStatus(
            'This browser saved WebM. To get MP4, convert it with CloudConvert or HandBrake (or record in Safari/latest Chrome).'
          );
        }
      };

      setIsRecording(true);
      setStatusMessage('Recording in real time… keep this tab open until it finishes.');
      setCurrentTime(0);
      setIsPlaying(true);
      mr.start(250);
    } catch (err) {
      console.error('Recording initialization error:', err);
      setIsRecording(false);
      setStatusMessage('Failed to start recording. Please check browser permissions.');
    }
  };

  const finishRecording = () => {
    setIsRecording(false);
    setIsPlaying(false);
    const totalDur = plan(storyboard).tot;
    setCurrentTime(totalDur - 0.01);
    drawAdFrame(totalDur - 0.01);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setTimeout(() => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    }, 500);
  };

  const totalDur = plan(storyboard).tot;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDur) * 100));

  return (
    <main>
      <>
          <h1>🎬 AdReel Studio</h1>
          <p className="mut">
            Paste any ad script. AI plans the scenes, colors and visuals to fit your business, then you record the video.
          </p>

          <textarea
            id="sc"
            rows={9}
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Paste your ad script here…"
          />

          <div className="row">
            <button id="bb" onClick={handleSmartBuild} disabled={isRecording}>
              ✨ Smart build
            </button>
            <button id="cl" className="sec" onClick={handleClearScript} disabled={isRecording}>
              Clear
            </button>
          </div>

          <label htmlFor="tpl">Graphic template</label>
          <select id="tpl" value={graphicTemplate} onChange={(e) => handleTemplateChange(e.target.value)}>
            <option value="auto">Auto — match the ad script</option>
            <option value="bold">Bold Business Promo</option>
            <option value="luxury">Premium Luxury</option>
            <option value="sale">Big Sale / Discount</option>
            <option value="neon">Neon Tech</option>
            <option value="food">Food & Restaurant</option>
            <option value="beauty">Beauty & Fashion</option>
            <option value="gospel">Gospel & Church Event</option>
            <option value="corporate">Corporate Clean</option>
            <option value="property">Real Estate</option>
            <option value="whiteboard">Whiteboard Explainer</option>
            <option value="human">Human Presenter Explainer</option>
            <option value="businessPromo">Business Promotion</option>
            <option value="productAd">Product Advertisement</option>
            <option value="eventPromo">Event Promotion</option>
            <option value="socialReel">Social Media Reel</option>
            <option value="explainer">Educational Explainer</option>
            <option value="shortStory">Short Story / Mini-Drama</option>
          </select>

          <p className="mut">Choose a visual direction, then build your ad. You can still change the animation style below.</p>

          <input
            type="text"
            id="ky"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="Gemini API key (optional, enables AI storyboard when self-hosted)"
            autoComplete="off"
          />

          <select id="sty" value={style} onChange={(e) => handleStyleChange(e.target.value)}>
            <option value="auto">Style: Auto (AI / built-in picks)</option>
            <option value="flat">Style: Flat cartoon</option>
            <option value="board">Style: Whiteboard sketch</option>
            <option value="human">Style: Human explainer</option>
            <option value="cinematic">Style: Cinematic Film</option>
            <option value="neon">Style: Neon Glow</option>
            <option value="comic">Style: Comic Book</option>
            <option value="minimal">Style: Minimal Clean</option>
            <option value="retro">Style: Retro Vintage</option>
            <option value="paper">Style: Paper Cutout</option>
            <option value="gradient">Style: Animated Gradient</option>
          </select>

          {statusMessage && (
            <div id="st" className="mut" style={{ marginTop: '8px' }}>
              {statusMessage}
            </div>
          )}



          {/* Whiteboard Story & Illustration Studio */}
          <section className="card" id="whiteboardStoryStudio">
            <h3 style={{ margin: '0 0 6px' }}>✍️ Whiteboard Story & Illustration Studio</h3>
            <p className="mut" style={{ margin: '0 0 10px' }}>
              Choose a story format. The app builds a sequence of different hand-drawn-style scenes, characters, icons, diagrams
              and story beats using the existing whiteboard animation engine.
            </p>

            <label htmlFor="wbStoryTemplate">Whiteboard story template</label>
            <select id="wbStoryTemplate" value={wbStoryTemplate} onChange={(e) => setWbStoryTemplate(e.target.value)}>
              <option value="problem">1. Problem → Solution → Result</option>
              <option value="howto">2. Step-by-step How-To Guide</option>
              <option value="product">3. Product / Service Explainer</option>
              <option value="customer">4. Customer Story / Testimonial</option>
              <option value="journey">5. Before-and-After Transformation</option>
              <option value="lesson">6. Educational Lesson</option>
              <option value="business">7. Small Business Promotion</option>
              <option value="community">8. Team / Community Story</option>
            </select>

            <div className="row">
              <button type="button" id="buildWhiteboardStory" onClick={handleBuildWhiteboardStory}>
                ✍️ Build whiteboard story
              </button>
            </div>

            <p className="mut" style={{ marginBottom: 0 }}>
              Tip: paste your own script first. Choose “Style: Whiteboard sketch” to get the hand-drawn reveal effect. Each scene
              type uses a different illustration layout.
            </p>
          </section>

          {/* Canvas player */}
          <canvas id="cv" ref={canvasRef} width={720} height={1280} />

          <input
            type="range"
            id="sk"
            min={0}
            max={1000}
            value={totalDur > 0 ? (currentTime / totalDur) * 1000 : 0}
            onChange={handleScrubberChange}
            disabled={isRecording}
          />

          <div id="pg">
            <i style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="row">
            <button id="pl" onClick={handleTogglePlay} disabled={isRecording}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button id="rc" onClick={startRecording} disabled={isRecording}>
              {isRecording ? '⏺ Recording…' : '⏺ Record & download'}
            </button>
          </div>

          {/* Output video container */}
          {recordedVideoUrl && (
            <div id="out">
              <p>
                <b>Your video is ready ✅</b>
              </p>
              <video controls playsInline src={recordedVideoUrl} />
              <div className="row">
                <a
                  href={recordedVideoUrl}
                  download={`${(storyboard.brand || 'ad').replace(/[^\w]+/g, '-').toLowerCase()}-video.mp4`}
                  style={{ textDecoration: 'none', width: '100%', display: 'flex' }}
                >
                  <button id="sv" style={{ width: '100%' }}>
                    ⬇ Save Video File
                  </button>
                </a>
              </div>
              {recordingStatus && (
                <p className="mut" id="sn">
                  {recordingStatus}
                </p>
              )}
            </div>
          )}

          {/* Advanced Storyboard Editor */}
          <details>
            <summary>Storyboard (advanced: edit and the preview updates)</summary>
            <textarea id="sbj" rows={12} value={storyboardJson} onChange={handleStoryboardJsonChange} />
          </details>
      </>
    </main>
  );
};

export default App;
