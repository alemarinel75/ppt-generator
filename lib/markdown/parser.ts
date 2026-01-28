import { Slide, SlideLayout, SlideElement } from '@/types/slides'

interface ParsedSection {
  title: string
  subtitle?: string
  content: string[]
  isQuote: boolean
  isSection: boolean
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

function detectLayout(section: ParsedSection): SlideLayout {
  if (section.isQuote) return 'quote'
  if (section.isSection) return 'section'
  if (section.content.length === 0 && section.subtitle) return 'title'
  if (section.content.length === 0) return 'title'
  if (section.content.length > 8) return 'two-columns'
  return 'title-bullets'
}

function parseMarkdownToSections(markdown: string): ParsedSection[] {
  const lines = markdown.split('\n')
  const sections: ParsedSection[] = []
  let currentSection: ParsedSection | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    // H1 - Main title slide
    if (trimmed.startsWith('# ') && !trimmed.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      currentSection = {
        title: trimmed.substring(2).trim(),
        content: [],
        isQuote: false,
        isSection: false,
      }
      continue
    }

    // H2 - Regular slide or section
    if (trimmed.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection)
      }
      const title = trimmed.substring(3).trim()
      currentSection = {
        title,
        content: [],
        isQuote: false,
        isSection: title.toLowerCase().includes('section:') || title.startsWith('---'),
      }
      if (currentSection.isSection) {
        currentSection.title = title.replace(/^section:\s*/i, '').replace(/^---\s*/, '')
      }
      continue
    }

    // H3 - Subtitle
    if (trimmed.startsWith('### ') && currentSection) {
      currentSection.subtitle = trimmed.substring(4).trim()
      continue
    }

    // Quote block
    if (trimmed.startsWith('> ') && currentSection) {
      currentSection.isQuote = true
      const quoteText = trimmed.substring(2).trim()
      // Check for attribution
      if (quoteText.startsWith('—') || quoteText.startsWith('-')) {
        currentSection.subtitle = quoteText.substring(1).trim()
      } else {
        currentSection.content.push(quoteText)
      }
      continue
    }

    // Bullet points
    if ((trimmed.startsWith('- ') || trimmed.startsWith('* ')) && currentSection) {
      currentSection.content.push(trimmed.substring(2).trim())
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed) && currentSection) {
      currentSection.content.push(trimmed.replace(/^\d+\.\s/, '').trim())
      continue
    }

    // Regular text (non-empty)
    if (trimmed && currentSection && !trimmed.startsWith('#')) {
      currentSection.content.push(trimmed)
    }
  }

  // Don't forget the last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export function parseMarkdownToSlides(markdown: string): Slide[] {
  const sections = parseMarkdownToSections(markdown)

  return sections.map((section) => {
    const layout = detectLayout(section)
    const elements: SlideElement[] = section.content.map((content) => ({
      type: section.isQuote ? 'quote' : 'bullet',
      content,
      subContent: section.isQuote ? section.subtitle : undefined,
    }))

    return {
      id: generateId(),
      layout,
      title: section.title,
      subtitle: section.subtitle,
      elements,
    }
  })
}

export function slidesToMarkdown(slides: Slide[]): string {
  const lines: string[] = []

  for (const slide of slides) {
    // Title slides use H1
    if (slide.layout === 'title') {
      lines.push(`# ${slide.title || 'Untitled'}`)
      if (slide.subtitle) {
        lines.push(`### ${slide.subtitle}`)
      }
    }
    // Section slides
    else if (slide.layout === 'section') {
      lines.push(`## Section: ${slide.title || 'Section'}`)
      if (slide.subtitle) {
        lines.push(`### ${slide.subtitle}`)
      }
    }
    // Quote slides
    else if (slide.layout === 'quote') {
      lines.push(`## ${slide.title || 'Quote'}`)
      for (const el of slide.elements) {
        lines.push(`> ${el.content}`)
        if (el.subContent) {
          lines.push(`> — ${el.subContent}`)
        }
      }
    }
    // All other slides use H2
    else {
      lines.push(`## ${slide.title || 'Slide'}`)
      if (slide.subtitle) {
        lines.push(`### ${slide.subtitle}`)
      }
      for (const el of slide.elements) {
        if (el.type === 'bullet' || el.type === 'text') {
          lines.push(`- ${el.content}`)
        }
      }
    }

    lines.push('') // Empty line between slides
  }

  return lines.join('\n')
}

export function validateMarkdown(markdown: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!markdown.trim()) {
    errors.push('Markdown content is empty')
    return { valid: false, errors }
  }

  const hasTitle = /^#\s+.+/m.test(markdown)
  if (!hasTitle) {
    errors.push('Presentation should start with a title (# Title)')
  }

  const sections = parseMarkdownToSections(markdown)
  if (sections.length === 0) {
    errors.push('No slides detected. Use # for title and ## for slides.')
  }

  if (sections.length > 50) {
    errors.push('Too many slides (max 50). Consider splitting your content.')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
