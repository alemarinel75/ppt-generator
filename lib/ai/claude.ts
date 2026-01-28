import Anthropic from '@anthropic-ai/sdk'
import { Slide, SlideLayout } from '@/types/slides'
import { SYSTEM_PROMPT, generatePrompt } from './prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GeneratedSlide {
  layout: string
  title?: string
  subtitle?: string
  elements: Array<{
    type: string
    content: string
    subContent?: string
  }>
}

interface GeneratedPresentation {
  title: string
  slides: GeneratedSlide[]
}

function validateLayout(layout: string): SlideLayout {
  const validLayouts: SlideLayout[] = [
    'title',
    'title-content',
    'title-bullets',
    'two-columns',
    'image-left',
    'image-right',
    'quote',
    'section',
  ]
  return validLayouts.includes(layout as SlideLayout)
    ? (layout as SlideLayout)
    : 'title-bullets'
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export async function generatePresentation(
  topic: string,
  slideCount: number = 8,
  style: 'formal' | 'casual' | 'creative' = 'formal',
  language: string = 'en'
): Promise<{ title: string; slides: Slide[] }> {
  const prompt = generatePrompt(topic, slideCount, style, language)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  // Extract text content from response
  const textContent = message.content.find((block) => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  // Parse JSON from response
  let parsed: GeneratedPresentation
  try {
    // Try to extract JSON from potential markdown code blocks
    let jsonStr = textContent.text
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }
    parsed = JSON.parse(jsonStr.trim())
  } catch {
    throw new Error('Failed to parse AI response as JSON')
  }

  // Validate and transform slides
  const slides: Slide[] = parsed.slides.map((slide) => ({
    id: generateId(),
    layout: validateLayout(slide.layout),
    title: slide.title,
    subtitle: slide.subtitle,
    elements: slide.elements.map((el) => ({
      type: el.type as 'text' | 'bullet' | 'image' | 'icon' | 'quote',
      content: el.content,
      subContent: el.subContent,
    })),
  }))

  return {
    title: parsed.title,
    slides,
  }
}

export async function* streamGeneratePresentation(
  topic: string,
  slideCount: number = 8,
  style: 'formal' | 'casual' | 'creative' = 'formal',
  language: string = 'en'
): AsyncGenerator<string, { title: string; slides: Slide[] }, unknown> {
  const prompt = generatePrompt(topic, slideCount, style, language)

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  let fullText = ''

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text
      yield event.delta.text
    }
  }

  // Parse final result
  let parsed: GeneratedPresentation
  try {
    let jsonStr = fullText
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }
    parsed = JSON.parse(jsonStr.trim())
  } catch {
    throw new Error('Failed to parse AI response as JSON')
  }

  const slides: Slide[] = parsed.slides.map((slide) => ({
    id: generateId(),
    layout: validateLayout(slide.layout),
    title: slide.title,
    subtitle: slide.subtitle,
    elements: slide.elements.map((el) => ({
      type: el.type as 'text' | 'bullet' | 'image' | 'icon' | 'quote',
      content: el.content,
      subContent: el.subContent,
    })),
  }))

  return {
    title: parsed.title,
    slides,
  }
}
