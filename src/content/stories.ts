import pancha001 from './stories/pancha-001.json'

interface StoryJson {
  storyId: string
  title: string
  tradition: string
  value: string
  description: string
  coverImage?: { src: string; alt: string }
  chapters: { id: string; order: number; title: string; text: string; image: { src: string; alt: string }; audio?: { src: string; durationSec: number } }[]
  parentCard: { prompts: string[]; tip: string; watchOut: string }
  missions: { id: string; variant: string; text: string; expiresAfterHours: number }[]
}

const adapt = (story: StoryJson) => ({
  id: story.storyId,
  title: story.title,
  tradition: story.tradition,
  value: story.value,
  description: story.description,
  chapters: story.chapters,
  prompts: story.parentCard.prompts,
  tip: story.parentCard.tip,
  watchOut: story.parentCard.watchOut,
  mission: story.missions[0].text,
  cover: story.coverImage ?? story.chapters[0].image
})

export const stories = [adapt(pancha001)]
export type Story = ReturnType<typeof adapt>
