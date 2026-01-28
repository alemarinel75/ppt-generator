// Types for the PPT Generator

export type SlideLayout =
  | 'title'           // Main title slide
  | 'title-content'   // Title + content
  | 'title-bullets'   // Title + bullet list
  | 'two-columns'     // Two columns layout
  | 'image-left'      // Image on left, content right
  | 'image-right'     // Image on right, content left
  | 'quote'           // Quote/citation
  | 'section'         // Section/transition slide
  | 'stats'           // Statistics with big numbers
  | 'cards'           // 3-4 cards with icons
  | 'timeline'        // Timeline/process steps
  | 'comparison'      // Compare 2-3 items
  | 'table'           // Table layout

export type ThemeName =
  | 'corporate'
  | 'minimal'
  | 'creative'
  | 'nature'
  | 'tech'
  | 'academic'

export interface SlideElement {
  type: 'text' | 'bullet' | 'image' | 'icon' | 'quote'
  content: string
  subContent?: string  // For quotes (author), bullets (sub-items)
}

export interface Slide {
  id: string
  layout: SlideLayout
  title?: string
  subtitle?: string
  elements: SlideElement[]
  notes?: string
}

export interface Presentation {
  id: string
  title: string
  theme: ThemeName
  slides: Slide[]
  createdAt: Date
  updatedAt: Date
}

export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
  accent: string
  muted: string
}

export interface ThemeFonts {
  heading: string
  body: string
  headingUppercase?: boolean
}

export interface Theme {
  name: ThemeName | string
  displayName: string
  description: string
  colors: ThemeColors
  fonts: ThemeFonts
  logo?: string | null
}

export interface GenerateRequest {
  topic: string
  slideCount?: number
  style?: 'formal' | 'casual' | 'creative'
  language?: string
}

export interface ExportRequest {
  presentation: Presentation
}

// Markdown parsing result
export interface ParsedSlide {
  title?: string
  subtitle?: string
  content: string[]
  layout: SlideLayout
}
