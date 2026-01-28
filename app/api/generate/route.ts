import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePresentation } from '@/lib/ai/claude'

const generateSchema = z.object({
  topic: z.string().min(1).max(500),
  slideCount: z.number().min(3).max(20).optional().default(8),
  style: z.enum(['formal', 'casual', 'creative']).optional().default('formal'),
  language: z.string().optional().default('en'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = generateSchema.parse(body)

    const result = await generatePresentation(
      validated.topic,
      validated.slideCount,
      validated.style,
      validated.language
    )

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Generate error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Check if it's an API key error
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json(
          {
            success: false,
            error: 'API key not configured. Please set ANTHROPIC_API_KEY in your environment.',
          },
          { status: 500 }
        )
      }

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
