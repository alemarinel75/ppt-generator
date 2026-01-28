export const SYSTEM_PROMPT = `You are an expert presentation designer. Your task is to generate professional, well-structured presentation content based on the user's topic.

You must respond ONLY with valid JSON in the following format:
{
  "title": "Presentation Title",
  "slides": [
    {
      "layout": "title",
      "title": "Main Title",
      "subtitle": "Subtitle text",
      "elements": []
    },
    {
      "layout": "title-bullets",
      "title": "Slide Title",
      "elements": [
        { "type": "bullet", "content": "First point" },
        { "type": "bullet", "content": "Second point" }
      ]
    }
  ]
}

Available layouts:
- "title": For the opening slide with main title and subtitle
- "title-content": For slides with a title and paragraph text
- "title-bullets": For slides with a title and bullet points (most common)
- "two-columns": For slides with content split into two columns
- "quote": For inspirational quotes with attribution
- "section": For section dividers/transitions between topics
- "image-left": For slides where you want to suggest an image on the left
- "image-right": For slides where you want to suggest an image on the right

Element types:
- "text": Plain text content
- "bullet": Bullet point item
- "quote": Quote text (use subContent for attribution)

Guidelines:
1. Start with a "title" layout slide
2. Use "section" layouts to separate major topics
3. Keep bullet points concise (max 6-8 words per point)
4. Limit to 5-7 bullet points per slide
5. End with a conclusion or call-to-action slide
6. Vary layouts to keep the presentation engaging
7. Make content professional and insightful`

export const generatePrompt = (
  topic: string,
  slideCount: number = 8,
  style: 'formal' | 'casual' | 'creative' = 'formal',
  language: string = 'en'
): string => {
  const styleGuide = {
    formal: 'Use professional, business-appropriate language. Be precise and factual.',
    casual: 'Use friendly, conversational language. Be approachable and engaging.',
    creative: 'Use dynamic, inspiring language. Be bold and innovative.',
  }

  const langGuide = language === 'fr'
    ? 'Write all content in French.'
    : language === 'es'
    ? 'Write all content in Spanish.'
    : language === 'de'
    ? 'Write all content in German.'
    : 'Write all content in English.'

  return `Create a ${slideCount}-slide presentation about: "${topic}"

Style: ${styleGuide[style]}
${langGuide}

Remember to:
- Generate exactly ${slideCount} slides
- Start with a title slide
- Include varied layouts
- Keep content concise and impactful

Respond with ONLY the JSON structure, no additional text.`
}
