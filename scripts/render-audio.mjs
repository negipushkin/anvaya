// Renders per-chapter WAV narration for every story JSON using Piper (Kathleen-low),
// then writes each chapter's audio.src + durationSec back into the story JSON.
// Run: npm run audio  (after: npm run audio:setup)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const piperDir = path.join(root, '.piper', 'piper')
const piperExe = path.join(piperDir, 'piper.exe')
const modelOnnx = path.join(root, '.piper', 'models', 'en_US-kathleen-low.onnx')
const storiesDir = path.join(root, 'src', 'content', 'stories')
const audioRoot = path.join(root, 'public', 'content', 'audio')

if (!fs.existsSync(piperExe) || !fs.existsSync(modelOnnx)) {
  console.error('Missing Piper binary or Kathleen-low model. Run: npm run audio:setup')
  process.exit(1)
}

// WAV header is 44 bytes; sample rate at 24-27, byte rate at 28-31, data chunk size at 40-43.
function wavDurationSec(wavPath) {
  const fd = fs.openSync(wavPath, 'r')
  const header = Buffer.alloc(44)
  fs.readSync(fd, header, 0, 44, 0)
  fs.closeSync(fd)
  const byteRate = header.readUInt32LE(28)
  const dataSize = fs.statSync(wavPath).size - 44
  return +(dataSize / byteRate).toFixed(2)
}

function renderChapter(text, outPath) {
  const result = spawnSync(piperExe, ['--model', modelOnnx, '--output_file', outPath], {
    cwd: piperDir,
    input: text,
    encoding: 'buffer'
  })
  if (result.status !== 0) {
    console.error(result.stderr?.toString())
    throw new Error(`Piper failed (exit ${result.status}) for ${outPath}`)
  }
}

const storyFiles = fs.readdirSync(storiesDir).filter((name) => name.endsWith('.json') && !name.includes('template'))
for (const file of storyFiles) {
  const jsonPath = path.join(storiesDir, file)
  const story = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const outDir = path.join(audioRoot, story.storyId)
  fs.mkdirSync(outDir, { recursive: true })
  console.log(`\n${story.storyId} · ${story.title}`)
  for (const chapter of story.chapters) {
    const outPath = path.join(outDir, `${chapter.id}.wav`)
    process.stdout.write(`  ${chapter.id}… `)
    renderChapter(chapter.text, outPath)
    const durationSec = wavDurationSec(outPath)
    chapter.audio = { src: `/content/audio/${story.storyId}/${chapter.id}.wav`, durationSec }
    console.log(`${durationSec}s`)
  }
  fs.writeFileSync(jsonPath, JSON.stringify(story, null, 2) + '\n')
  console.log(`  → patched ${file}`)
}

console.log('\nDone. Audio files under public/content/audio/, story JSONs updated.')
