import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { stories } from './content/stories'
import './styles.css'

type Screen = 'login' | 'parent-gate' | 'child-profile' | 'ritual' | 'handoff' | 'board' | 'parent-card' | 'reader' | 'reflect' | 'mission' | 'close' | 'journal'
type MissionStatus = 'logged' | 'later' | 'skipped' | null
type ReadingMode = 'parent' | 'aloud'
type Age = 5 | 6 | 7 | 8
type RitualTime = 'bedtime' | 'weekend' | 'none'
type Profile = { name: string; age: Age }
type Ritual = { time: RitualTime; reminder: boolean }
type GateNext = 'onboarding' | 'journal' | null

const journalKey = 'anvaya-journal-v1'
const profileKey = 'anvaya-profile-v1'
const ritualKey = 'anvaya-ritual-v1'

const hideBrokenImage = (event: React.SyntheticEvent<HTMLImageElement>) => { event.currentTarget.style.visibility = 'hidden' }

const IconChevronLeft = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
const IconChevronRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
const IconClose = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
const IconJournal = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 3h12a2 2 0 0 1 2 2v16l-8-4-8 4V5a2 2 0 0 1 2-2z" /></svg>
const IconPlay = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
const IconMoon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
const IconSun = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
const IconClock = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>

const HOLD_DURATION_MS = 2500
const RING_CIRCUMFERENCE = 2 * Math.PI * 46

function ParentGate({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const onSuccessRef = useRef(onSuccess)
  useEffect(() => { onSuccessRef.current = onSuccess }, [onSuccess])

  useEffect(() => {
    if (!holding) { setProgress(0); return }
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - start
      const p = Math.min(1, elapsed / HOLD_DURATION_MS)
      setProgress(p)
      if (p >= 1) { onSuccessRef.current(); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [holding])

  return <div className="gate-overlay" role="dialog" aria-modal="true">
    <button className="gate-cancel" onClick={onCancel} aria-label="Cancel"><IconClose /></button>
    <div className="gate-inner">
      <button
        className={`gate-button ${holding ? 'holding' : ''}`}
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        aria-label="Hold to enter Parent Mode"
      >
        <svg className="gate-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" strokeDasharray={`${progress * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`} />
        </svg>
        <span className="gate-label">Hold</span>
      </button>
      <p className="gate-prompt">Hold to enter Parent Mode</p>
      <p className="gate-sub">We do this so little hands don't skip ahead.</p>
    </div>
  </div>
}

function App() {
  const initialScreen: Screen = localStorage.getItem(profileKey) ? 'board' : 'login'
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [storyId, setStoryId] = useState<string>(stories[0].id)
  const [chapter, setChapter] = useState(0)
  const [tipOpen, setTipOpen] = useState(false)
  const [status, setStatus] = useState<MissionStatus>(null)
  const [note, setNote] = useState('')
  const [mode, setMode] = useState<ReadingMode>('parent')
  const [paused, setPaused] = useState(false)
  const [journals, setJournals] = useState<string[]>(() => JSON.parse(localStorage.getItem(journalKey) ?? '[]'))
  const [profile, setProfile] = useState<Profile | null>(() => JSON.parse(localStorage.getItem(profileKey) ?? 'null'))
  const [ritual, setRitual] = useState<Ritual | null>(() => JSON.parse(localStorage.getItem(ritualKey) ?? 'null'))
  const [gateNext, setGateNext] = useState<GateNext>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [ageDraft, setAgeDraft] = useState<Age | null>(null)
  const [timeDraft, setTimeDraft] = useState<RitualTime>('bedtime')
  const [reminderDraft, setReminderDraft] = useState(false)

  useEffect(() => { localStorage.setItem(journalKey, JSON.stringify(journals)) }, [journals])
  useEffect(() => { if (profile) localStorage.setItem(profileKey, JSON.stringify(profile)) }, [profile])
  useEffect(() => { if (ritual) localStorage.setItem(ritualKey, JSON.stringify(ritual)) }, [ritual])

  const story = stories.find((item) => item.id === storyId) ?? stories[0]

  // Read to Me — plays the pre-rendered chapter audio (Piper Kathleen-low, rendered by scripts/render-audio.mjs).
  // If a chapter has no audio.src yet, falls back to browser speechSynthesis so the mode still works during development.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const barsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (screen !== 'reader' || mode !== 'aloud') return
    const src = story.chapters[chapter].audio?.src
    if (!src) return
    const audio = new Audio(src)
    audio.onended = () => {
      if (chapter === story.chapters.length - 1) setScreen('reflect')
      else setChapter((index) => index + 1)
    }
    audioRef.current = audio

    try {
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx()
        const ctx = audioCtxRef.current
        if (!analyserRef.current) {
          const analyser = ctx.createAnalyser()
          analyser.fftSize = 128
          analyser.smoothingTimeConstant = 0.7
          analyser.connect(ctx.destination)
          analyserRef.current = analyser
        }
        const source = ctx.createMediaElementSource(audio)
        source.connect(analyserRef.current)
        sourceRef.current = source
      }
    } catch { /* visualization unavailable — audio still plays via the element */ }

    return () => {
      audio.pause()
      audioRef.current = null
      sourceRef.current?.disconnect()
      sourceRef.current = null
    }
  }, [screen, mode, chapter, storyId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (paused) audio.pause()
    else { audioCtxRef.current?.resume().catch(() => {}); audio.play().catch(() => {}) }
  }, [paused, chapter, screen, mode])

  useEffect(() => {
    if (screen !== 'reader' || mode !== 'aloud' || paused) return
    const analyser = analyserRef.current
    const container = barsRef.current
    if (!analyser || !container) return
    const bars = Array.from(container.querySelectorAll<HTMLElement>('b'))
    if (!bars.length) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    let alive = true
    const draw = () => {
      if (!alive) return
      analyser.getByteFrequencyData(data)
      const step = Math.max(1, Math.floor(data.length / bars.length))
      bars.forEach((bar, i) => bar.style.setProperty('--h', (data[i * step] / 255).toFixed(3)))
      requestAnimationFrame(draw)
    }
    draw()
    return () => { alive = false; bars.forEach((bar) => bar.style.setProperty('--h', '0')) }
  }, [screen, mode, chapter, paused, storyId])

  useEffect(() => {
    if (screen !== 'reader' || mode !== 'aloud' || paused) return
    const src = story.chapters[chapter].audio?.src
    if (src) return
    const speech = window.speechSynthesis
    if (!speech) return
    const utter = new SpeechSynthesisUtterance(story.chapters[chapter].text)
    utter.rate = 0.92
    utter.pitch = 1
    utter.onend = () => {
      if (chapter === story.chapters.length - 1) setScreen('reflect')
      else setChapter((index) => index + 1)
    }
    speech.cancel()
    speech.speak(utter)
    return () => speech.cancel()
  }, [screen, mode, chapter, paused, storyId])

  const startOnboarding = () => { setGateNext('onboarding'); setScreen('parent-gate') }
  const openJournal = () => { setGateNext('journal'); setScreen('parent-gate') }
  const onGateSuccess = () => {
    const target = gateNext
    setGateNext(null)
    if (target === 'onboarding') setScreen('child-profile')
    else if (target === 'journal') setScreen('journal')
    else setScreen('board')
  }
  const onGateCancel = () => {
    const target = gateNext
    setGateNext(null)
    setScreen(target === 'onboarding' ? 'login' : 'board')
  }
  const saveProfile = () => {
    if (!nameDraft.trim() || !ageDraft) return
    setProfile({ name: nameDraft.trim(), age: ageDraft })
    setScreen('ritual')
  }
  const saveRitual = () => {
    setRitual({ time: timeDraft, reminder: reminderDraft })
    setScreen('handoff')
  }
  const beginFirstStory = () => {
    setStoryId(stories[0].id); setChapter(0); setNote(''); setStatus(null); setTipOpen(false); setPaused(false)
    setScreen('parent-card')
  }
  const openStory = (id: string) => { setStoryId(id); setChapter(0); setNote(''); setStatus(null); setTipOpen(false); setPaused(false); setScreen('parent-card') }
  const goToReader = () => { setChapter(0); setPaused(false); setScreen('reader') }
  const pauseForManualNav = () => { if (mode === 'aloud') setPaused(true) }
  const goPrev = () => { if (chapter === 0) return; pauseForManualNav(); setChapter(chapter - 1) }
  const goNext = () => { if (chapter === story.chapters.length - 1) return; pauseForManualNav(); setChapter(chapter + 1) }
  const completeMission = (next: MissionStatus) => {
    if (next === 'logged') setJournals((items) => [`${new Date().toLocaleDateString()} · ${story.title}: ${note || story.mission}`, ...items])
    setStatus(next)
    setScreen('close')
  }

  if (screen === 'reader') {
    const current = story.chapters[chapter]
    const isFirst = chapter === 0
    const isLast = chapter === story.chapters.length - 1
    return <main className="reader">
      <button className="reader-close" onClick={() => setScreen('board')} aria-label="End story"><IconClose /></button>
      <div className="dots" aria-label={`Chapter ${chapter + 1} of ${story.chapters.length}`}>{story.chapters.map((item, index) => <i key={item.id} className={index <= chapter ? 'active' : ''} />)}</div>
      {mode === 'aloud' && paused && <button className="paused-badge" onClick={() => setPaused(false)} aria-label="Resume Read to Me"><IconPlay /> Read to Me paused — tap to resume</button>}
      <article className="reader-card">
        <div className="scene reader-scene"><img src={current.image.src} alt={current.image.alt} onError={hideBrokenImage} /></div>
        <p className="narration">{current.text}</p>
      </article>
      <div className="reader-nav">
        <button className={`nav-arrow ${isFirst ? 'hidden' : ''}`} onClick={goPrev} aria-label="Previous chapter" aria-hidden={isFirst}><IconChevronLeft /></button>
        {mode === 'aloud' && !paused && <div className="wave" ref={barsRef} aria-label="Narration playing">{Array.from({ length: 16 }).map((_, i) => <b key={i} />)}</div>}
        {isLast
          ? <button className="nav-continue" onClick={() => { pauseForManualNav(); setScreen('reflect') }}>Continue to Reflect <IconChevronRight /></button>
          : <button className="nav-arrow" onClick={goNext} aria-label="Next chapter"><IconChevronRight /></button>}
      </div>
    </main>
  }

  if (screen === 'parent-gate') return <ParentGate onSuccess={onGateSuccess} onCancel={onGateCancel} />

  return <main className="app-shell">
    {screen === 'login' && <section className="page login">
      <div className="wordmark">Anvaya</div>
      <div className="login-hero"><img src="/hero.png" alt="A parent-child ritual, one story at a time" onError={hideBrokenImage} /></div>
      <p className="login-tag">A story, a talk, a small act — every week.</p>
      <button className="primary" onClick={startOnboarding}>Get Started</button>
      <p className="fine-print">Made for parents. Made in India.</p>
    </section>}

    {screen === 'child-profile' && <section className="page onboarding">
      <header><button className="back" onClick={() => setScreen('login')} aria-label="Back"><IconChevronLeft /></button><span /><span /></header>
      <h1>Who's this for?</h1>
      <p className="muted">Just a first name and age. Nothing else.</p>
      <label className="field">
        <span className="eyebrow">First name</span>
        <input className="text-input" type="text" value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} placeholder="e.g. Aarav" autoFocus />
      </label>
      <div className="field">
        <span className="eyebrow">Age</span>
        <div className="age-picker">
          {[5, 6, 7, 8].map((age) => (
            <button key={age} className={`age-btn ${ageDraft === age ? 'active' : ''}`} onClick={() => setAgeDraft(age as Age)}>{age}</button>
          ))}
        </div>
      </div>
      <div className="sticky-actions">
        <button className="primary" onClick={saveProfile} disabled={!nameDraft.trim() || !ageDraft}>Continue</button>
      </div>
    </section>}

    {screen === 'ritual' && <section className="page onboarding">
      <header><button className="back" onClick={() => setScreen('child-profile')} aria-label="Back"><IconChevronLeft /></button><span /><span /></header>
      <h1>When's your usual story time?</h1>
      <p className="muted">This helps us set the rhythm. You can change it later.</p>
      <div className="ritual-cards">
        {([
          { id: 'bedtime' as const, title: 'Bedtime', sub: '7–9 PM most evenings', icon: <IconMoon /> },
          { id: 'weekend' as const, title: 'Weekend mornings', sub: 'Saturdays and Sundays', icon: <IconSun /> },
          { id: 'none' as const, title: 'No fixed time', sub: "We'll figure it out", icon: <IconClock /> }
        ]).map((option) => (
          <button key={option.id} className={`ritual-card ${timeDraft === option.id ? 'active' : ''}`} onClick={() => setTimeDraft(option.id)}>
            {option.icon}
            <span className="ritual-text"><span className="ritual-title">{option.title}</span><span className="ritual-sub">{option.sub}</span></span>
          </button>
        ))}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={reminderDraft} onChange={(event) => setReminderDraft(event.target.checked)} />
        <span className="toggle-slider" />
        <span>Send me a gentle reminder</span>
      </label>
      <div className="sticky-actions">
        <button className="primary" onClick={saveRitual}>Continue</button>
      </div>
    </section>}

    {screen === 'handoff' && <section className="page login">
      <div className="handoff-hero"><img src="/hero.png" alt="A crow and a clay pitcher" onError={hideBrokenImage} /></div>
      <h1>Your first story is ready.</h1>
      <p className="login-tag">It's called <em>The Crow and the Pitcher</em>. About five minutes reading, five minutes talking together{profile?.name ? `, with ${profile.name}` : ''}.</p>
      <button className="primary" onClick={beginFirstStory}>Begin</button>
      <button className="ghost" onClick={() => setScreen('board')}>Maybe later</button>
    </section>}

    {screen === 'board' && <section className="page board">
      <header><div className="wordmark">Anvaya</div><button className="icon-button" onClick={openJournal} aria-label="Open Value Journal"><IconJournal /></button></header>
      <span className="eyebrow">{profile?.name ? `For ${profile.name}` : "Today's story"}</span>
      <h1>Choose today's story</h1>
      <p className="muted">Sit together. Pick one. About 15 minutes.</p>
      <div className="board-grid">
        {stories.map((item) => (
          <button key={item.id} className="story-card board-card" onClick={() => openStory(item.id)}>
            <div className="scene cover"><img src={item.cover.src} alt={item.cover.alt} onError={hideBrokenImage} /><span className="badge card-badge">{item.value}</span></div>
            <h2 className="card-title">{item.title}</h2>
            <p className="card-desc">{item.description}</p>
          </button>
        ))}
      </div>
    </section>}

    {screen === 'parent-card' && <section className="page parent-card">
      <header><button className="back" onClick={() => setScreen('board')} aria-label="Back"><IconChevronLeft /></button><strong>Parent Card</strong><button className="back" onClick={() => setScreen('board')} aria-label="Close"><IconClose /></button></header>
      <article className="paper-card"><span className="eyebrow">TODAY'S VALUE</span><h2>{story.value}</h2><span className="eyebrow">TWO THINGS TO ASK</span>{story.prompts.map((prompt) => <p className="prompt" key={prompt}>{prompt}</p>)}<span className="eyebrow">ONE TIP</span><p>{story.tip}</p><span className="eyebrow">WATCH OUT FOR</span><p>{story.watchOut}</p></article>
      <div className="sticky-actions">
        <div className="mode-picker" role="radiogroup" aria-label="Reading mode">
          <button role="radio" aria-checked={mode === 'parent'} className={mode === 'parent' ? 'active' : ''} onClick={() => setMode('parent')}>Read with Parent</button>
          <button role="radio" aria-checked={mode === 'aloud'} className={mode === 'aloud' ? 'active' : ''} onClick={() => setMode('aloud')}>Read to Me</button>
        </div>
        <button className="primary" onClick={goToReader}>Ready — Start Story</button>
        <button className="ghost" onClick={goToReader}>Skip preview</button>
      </div>
    </section>}

    {screen === 'reflect' && <section className="page reflect"><div className="closing"><span>{story.chapters[story.chapters.length - 1].image.alt}</span></div><h1>Now it's your turn to talk.</h1><p className="muted">Take your time with these. There are no wrong answers.</p>{story.prompts.map((prompt) => <p className="prompt" key={prompt}>{prompt}</p>)}<button className="tip" onClick={() => setTipOpen(!tipOpen)}>One tip if you get stuck <span>{tipOpen ? '−' : '+'}</span></button>{tipOpen && <p className="tip-copy">{story.tip}</p>}<div className="sticky-actions"><button className="primary" onClick={() => setScreen('mission')}>We're Done Talking</button></div></section>}

    {screen === 'mission' && <section className="page mission"><span className="badge centered">{story.value}</span><article className="mission-card"><span className="eyebrow terracotta">MICRO-MISSION</span><p className="prompt">{story.mission}</p><p className="muted">◷ You have 24 hours. No pressure.</p></article><label className="note-label">Optional note <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What happened?" /></label><button className="primary" onClick={() => completeMission('logged')}>Log It Now</button><button className="secondary" onClick={() => completeMission('later')}>Log It Later</button><button className="ghost" onClick={() => completeMission('skipped')}>Skip This One</button><p className="fine-print">Skipping is okay. Not every day needs a mission.</p></section>}

    {screen === 'close' && <section className="page close"><div className="map"><i className="node unlocked" /><i className="node unlocked" /><i className="node unlocked" /><i className="node" /><i className="node" /></div><h1>See you next time.</h1><p className="muted">{status === 'logged' ? "Great — you've added to your Value Journal." : status === 'later' ? "We've saved the mission. You can log it from Parent Mode when it's done." : "No mission today. Come back for the next story whenever you're ready."}</p><button className="ghost close-button" onClick={() => setScreen('board')}>Close</button></section>}

    {screen === 'journal' && <section className="page journal"><header><button className="back" onClick={() => setScreen('board')} aria-label="Back"><IconChevronLeft /></button><strong>Value Journal</strong><span /></header><span className="badge">Wisdom</span><h1>{profile?.name ? `${profile.name}'s small acts` : "Your family's small acts"}</h1>{journals.length ? <div className="journal-list">{journals.map((entry, index) => <article key={`${entry}-${index}`}><span className="eyebrow">WISDOM</span><p>{entry}</p></article>)}</div> : <div className="empty"><p>Your first mission will land here.</p><p className="muted">Complete a mission to begin your family journal.</p></div>}</section>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
