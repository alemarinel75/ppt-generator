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
      "layout": "stats",
      "title": "Key Numbers",
      "elements": [
        { "type": "text", "content": "85%|Customer satisfaction" },
        { "type": "text", "content": "2M+|Active users" },
        { "type": "text", "content": "50+|Countries" }
      ]
    }
  ]
}

Available layouts:
- "title": Opening slide with main title and subtitle
- "title-bullets": Title with bullet points (most common)
- "two-columns": Content split into two columns
- "quote": Inspirational quote with attribution
- "section": Section divider between topics
- "stats": BIG NUMBERS display (use format "NUMBER|Label" for each element, 3-4 items max)
- "cards": Feature cards with icons (use format "Card Title|Description" for each element, 3 items max)
- "timeline": Process/timeline steps (use format "Step Title|Description" for each element, 3-5 items)
- "comparison": Compare 2-3 options (use format "Option Name|Feature 1|Feature 2|Feature 3" for each element)
- "table": Data table (use format "Col1|Col2|Col3" for each row, first row is header)

Element types:
- "text": Plain text content
- "bullet": Bullet point item
- "quote": Quote text (use subContent for attribution)

Guidelines:
1. Start with a "title" layout slide
2. USE VARIED LAYOUTS - don't just use title-bullets! Use stats, cards, timeline, comparison for visual interest
3. Use "section" layouts to separate major topics
4. For "stats": include impressive numbers with short labels (e.g., "98%|Success rate")
5. For "cards": describe 3 key features or benefits
6. For "timeline": show a process or chronological steps
7. For "comparison": compare options, plans, or before/after
8. For "table": present structured data clearly
9. Keep bullet points concise (max 6-8 words per point)
10. End with a conclusion or call-to-action slide`

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

IMPORTANT - Create visually diverse slides:
- Include at least 1 "stats" slide with impressive numbers
- Include at least 1 "cards" or "timeline" slide
- Consider using "comparison" if comparing options
- Use "table" for structured data if relevant
- Don't make all slides "title-bullets" - vary the layouts!

Generate exactly ${slideCount} slides starting with a title slide.

Respond with ONLY the JSON structure, no additional text.`
}
