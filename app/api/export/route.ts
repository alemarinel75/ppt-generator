import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePptxBase64WithTheme } from '@/lib/pptx/generator'
import { Presentation, Theme } from '@/types/slides'

const slideElementSchema = z.object({
  type: z.enum(['text', 'bullet', 'image', 'icon', 'quote']),
  content: z.string(),
  subContent: z.string().optional(),
})

const slideSchema = z.object({
  id: z.string(),
  layout: z.enum([
    'title',
    'title-content',
    'title-bullets',
    'two-columns',
    'image-left',
    'image-right',
    'quote',
    'section',
  ] as const),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  elements: z.array(slideElementSchema),
  notes: z.string().optional(),
})

const customThemeSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string(),
    accent: z.string(),
    muted: z.string(),
  }),
  fonts: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  logo: z.string().nullable().optional(),
})

const presentationSchema = z.object({
  id: z.string(),
  title: z.string(),
  theme: z.enum([
    'corporate',
    'minimal',
    'creative',
    'nature',
    'tech',
    'academic',
  ] as const),
  slides: z.array(slideSchema),
  customTheme: customThemeSchema.optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = presentationSchema.parse(body)

    // Create presentation object with dates
    const presentation: Presentation = {
      id: validated.id,
      title: validated.title,
      theme: validated.theme,
      slides: validated.slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Generate PPTX as base64 (with optional custom theme)
    const base64 = await generatePptxBase64WithTheme(
      presentation,
      validated.customTheme as Theme | undefined
    )

    return NextResponse.json({
      success: true,
      data: {
        base64,
        filename: `${presentation.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid presentation data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
