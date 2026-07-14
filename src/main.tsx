import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { stories } from './content/stories'
import './styles.css'

type Screen = 'login' | 'board' | 'parent-card' | 'reader' | 'reflect' | 'mission' | 'close' | 'journal'
type MissionStatus = 'logged' | 'later' | 'skipped' | null
type ReadingMode = 'parent' | 'aloud'

const journalKey = 'anvaya-journal-v1'
const hideBrokenImage = (event: React.SyntheticEvent<HTMLImageElement>) => { event.currentTarget.style.visibility = 'hidden' }

function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [storyId, setStoryId] = useState<string>(stories[0].id)
  const [chapter, setChapter] = useState(0)
  const [tipOpen, setTipOpen] = useState(false)
  const [status, setStatus] = useState<MissionStatus>(null)
  const [note, setNote] = useState('')
  const [mode, setMode] = useState<ReadingMode>('parent')
  const [paused, setPaused] = useState(false)
  const [journals, setJournals] = useState<string[]>(() => JSON.parse(localStorage.getItem(journalKey) ?? '[]'))

  useEffect(() => {
    localStorage.setItem(journalKey, JSON.stringify(journals))
  }, [journals])

  const story = stories.find((item) => item.id === storyId) ?? stories[0]

  // Read to Me — plays the pre-rendered chapter audio (Piper Kathleen-low, rendered by scripts/render-audio.mjs).
  // If a chapter has no audio.src yet, falls back to browser speechSynthesis so the mode still works during development.
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    return () => { audio.pause(); audioRef.current = null }
  }, [screen, mode, chapter, storyId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (paused) audio.pause()
    else audio.play().catch(() => {})
  }, [paused, chapter, screen, mode])

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
      <button className="reader-close" onClick={() => setScreen('board')} aria-label="End story">×</button>
      <div className="dots" aria-label={`Chapter ${chapter + 1} of ${story.chapters.length}`}>{story.chapters.map((item, index) => <i key={item.id} className={index <= chapter ? 'active' : ''} />)}</div>
      {mode === 'aloud' && paused && <button className="paused-badge" onClick={() => setPaused(false)} aria-label="Resume Read to Me">▶ Read to Me paused — tap to resume</button>}
      <article className="reader-card">
        <div className="scene reader-scene"><img src={current.image.src} alt={current.image.alt} onError={hideBrokenImage} /></div>
        <p className="narration">{current.text}</p>
      </article>
      <div className="reader-nav">
        <button className={`nav-arrow ${isFirst ? 'hidden' : ''}`} onClick={goPrev} aria-label="Previous chapter" aria-hidden={isFirst}>‹</button>
        {mode === 'aloud' && !paused && <div className="wave" aria-label="Narration playing"><b /><b /><b /><b /><b /></div>}
        {isLast
          ? <button className="nav-continue" onClick={() => { pauseForManualNav(); setScreen('reflect') }}>Continue to Reflect →</button>
          : <button className="nav-arrow" onClick={goNext} aria-label="Next chapter">›</button>}
      </div>
    </main>
  }

  return <main className="app-shell">
    {screen === 'login' && <section className="page login">
      <div className="wordmark login-mark">Anvaya</div>
      <div className="scene login-hero"><img src="/hero.png" alt="A parent-child ritual, one story at a time" onError={hideBrokenImage} /></div>
      <p className="login-tag">A story, a talk, a small act — every week.</p>
      <button className="primary" onClick={() => setScreen('board')}>Get Started</button>
    </section>}

    {screen === 'board' && <section className="page board">
      <header><div className="wordmark">Anvaya</div><button className="icon-button" onClick={() => setScreen('journal')} aria-label="Open Value Journal">⌑</button></header>
      <span className="eyebrow">STORY BOARD</span>
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
      <header><button className="back" onClick={() => setScreen('board')}>‹</button><strong>Parent Card</strong><button className="back" onClick={() => setScreen('board')}>×</button></header>
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

    {screen === 'reflect' && <section className="page reflect"><div className="scene closing"><span>{story.chapters[story.chapters.length - 1].image.alt}</span></div><h1>Now it's your turn to talk.</h1><p className="muted">Take your time with these. There are no wrong answers.</p>{story.prompts.map((prompt) => <p className="prompt" key={prompt}>{prompt}</p>)}<button className="tip" onClick={() => setTipOpen(!tipOpen)}>One tip if you get stuck <span>{tipOpen ? '−' : '+'}</span></button>{tipOpen && <p className="tip-copy">{story.tip}</p>}<div className="sticky-actions"><button className="primary" onClick={() => setScreen('mission')}>We're Done Talking</button></div></section>}

    {screen === 'mission' && <section className="page mission"><span className="badge centered">{story.value}</span><article className="mission-card"><span className="eyebrow terracotta">MICRO-MISSION</span><p className="prompt">{story.mission}</p><p className="muted">◷ You have 24 hours. No pressure.</p></article><label className="note-label">Optional note <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What happened?" /></label><button className="primary" onClick={() => completeMission('logged')}>Log It Now</button><button className="secondary" onClick={() => completeMission('later')}>Log It Later</button><button className="ghost" onClick={() => completeMission('skipped')}>Skip This One</button><p className="fine-print">Skipping is okay. Not every day needs a mission.</p></section>}

    {screen === 'close' && <section className="page close"><div className="map"><i className="node unlocked" /><i className="node unlocked" /><i className="node unlocked" /><i className="node" /><i className="node" /></div><h1>See you next time.</h1><p className="muted">{status === 'logged' ? "Great — you've added to your Value Journal." : status === 'later' ? "We've saved the mission. You can log it from Parent Mode when it's done." : "No mission today. Come back for the next story whenever you're ready."}</p><button className="ghost close-button" onClick={() => setScreen('board')}>Close</button></section>}

    {screen === 'journal' && <section className="page journal"><header><button className="back" onClick={() => setScreen('board')}>‹</button><strong>Value Journal</strong><span /></header><span className="badge">Wisdom</span><h1>Your family's small acts</h1>{journals.length ? <div className="journal-list">{journals.map((entry, index) => <article key={`${entry}-${index}`}><span className="eyebrow">WISDOM</span><p>{entry}</p></article>)}</div> : <div className="empty"><div className="scene"><span>Your first mission will land here.</span></div><p>Complete a mission to begin your family journal.</p></div>}</section>}
  </main>
}

createRoot(document.getElementById('root')!).render(<App />)
