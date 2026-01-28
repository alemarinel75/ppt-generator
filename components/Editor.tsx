'use client'

import { useState, useCallback, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { parseMarkdownToSlides, validateMarkdown } from '@/lib/markdown/parser'
import { Slide } from '@/types/slides'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  onSlidesChange: (slides: Slide[]) => void
}

const EXAMPLE_MARKDOWN = `# Welcome to PPT Generator
### Create beautiful presentations with Markdown

## Introduction
- Write content in Markdown format
- Preview your slides in real-time
- Export to PowerPoint with one click

## Key Features
- AI-powered content generation
- Multiple professional themes
- Various slide layouts
- Easy export to PPTX

## Section: Main Topics

## Getting Started
- Choose a theme that fits your needs
- Write your content in Markdown
- Or use AI to generate content
- Preview and adjust as needed
- Export your final presentation

## Quote
> The best presentations tell a story, not just display information.
> — Presentation Expert

## Conclusion
- Start creating amazing presentations today
- Use themes to maintain consistency
- Keep content concise and visual
- Practice your delivery

## Thank You!
### Questions?`

export function Editor({ value, onChange, onSlidesChange }: EditorProps) {
  const [validation, setValidation] = useState<{
    valid: boolean
    errors: string[]
  }>({ valid: true, errors: [] })

  // Parse and validate on change
  useEffect(() => {
    const result = validateMarkdown(value)
    setValidation(result)

    if (result.valid || value.trim()) {
      const slides = parseMarkdownToSlides(value)
      onSlidesChange(slides)
    }
  }, [value, onSlidesChange])

  const handleLoadExample = useCallback(() => {
    onChange(EXAMPLE_MARKDOWN)
  }, [onChange])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="markdown-editor" className="text-sm font-medium">
          Markdown Editor
        </Label>
        <div className="flex items-center gap-2">
          {validation.valid ? (
            <Badge variant="outline" className="text-green-600 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-200">
              <AlertCircle className="w-3 h-3 mr-1" />
              {validation.errors.length} issue(s)
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleLoadExample}>
            Load Example
          </Button>
        </div>
      </div>

      <Textarea
        id="markdown-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Presentation Title

## Slide Title
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Another Slide
Content goes here..."
        className="flex-1 min-h-[400px] font-mono text-sm resize-none"
      />

      {!validation.valid && validation.errors.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <ul className="text-xs text-amber-700 space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i} className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-2 p-3 bg-gray-50 rounded-md">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick Reference</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          <code># Title</code>
          <span>Main title slide</span>
          <code>## Slide</code>
          <span>New slide</span>
          <code>### Subtitle</code>
          <span>Slide subtitle</span>
          <code>- Item</code>
          <span>Bullet point</span>
          <code>&gt; Quote</code>
          <span>Quote slide</span>
          <code>## Section: Name</code>
          <span>Section divider</span>
        </div>
      </div>
    </div>
  )
}
