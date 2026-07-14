// Downloads Piper (Windows x64 binary) and the en_US-kathleen-low voice model
// into .piper/. Idempotent — skips anything already present.
// Run: npm run audio:setup

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const piperDir = path.join(root, '.piper')
const binDir = path.join(piperDir, 'piper')
const modelsDir = path.join(piperDir, 'models')
const piperExe = path.join(binDir, 'piper.exe')
const modelOnnx = path.join(modelsDir, 'en_US-kathleen-low.onnx')
const modelJson = path.join(modelsDir, 'en_US-kathleen-low.onnx.json')

const PIPER_ZIP_URL = 'https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip'
const MODEL_ONNX_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/kathleen/low/en_US-kathleen-low.onnx?download=true'
const MODEL_JSON_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/kathleen/low/en_US-kathleen-low.onnx.json?download=true'

fs.mkdirSync(piperDir, { recursive: true })
fs.mkdirSync(modelsDir, { recursive: true })

async function download(url, dest) {
  process.stdout.write(`  downloading ${path.basename(dest)}… `)
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest))
  const size = fs.statSync(dest).size
  console.log(`${(size / 1024 / 1024).toFixed(1)} MB`)
}

function extractZip(zipPath, destDir) {
  console.log(`  extracting ${path.basename(zipPath)}…`)
  execFileSync('powershell', ['-NoProfile', '-Command', `Expand-Archive -Path '${zipPath}' -DestinationPath '${destDir}' -Force`], { stdio: 'inherit' })
}

if (!fs.existsSync(piperExe)) {
  console.log('Piper binary missing — installing.')
  const zipPath = path.join(piperDir, 'piper_windows_amd64.zip')
  await download(PIPER_ZIP_URL, zipPath)
  extractZip(zipPath, piperDir)
  fs.unlinkSync(zipPath)
} else {
  console.log('Piper binary present — skipping.')
}

if (!fs.existsSync(modelOnnx)) {
  console.log('Kathleen-low model missing — downloading.')
  await download(MODEL_ONNX_URL, modelOnnx)
  await download(MODEL_JSON_URL, modelJson)
} else {
  console.log('Kathleen-low model present — skipping.')
}

console.log('\nReady. Next: npm run audio')
