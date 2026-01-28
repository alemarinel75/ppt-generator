import PptxGenJS from 'pptxgenjs'
import { Presentation, Slide } from '@/types/slides'
import { getTheme, Theme } from './themes'

export class PptxGenerator {
  private pptx: PptxGenJS
  private theme: Theme

  constructor(presentation: Presentation, customTheme?: Theme) {
    this.pptx = new PptxGenJS()
    this.theme = customTheme || getTheme(presentation.theme)

    // Set presentation properties
    this.pptx.title = presentation.title
    this.pptx.author = 'PPT Generator'
    this.pptx.subject = presentation.title

    // Set default slide size (16:9)
    this.pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 })
    this.pptx.layout = 'CUSTOM'
  }

  private getBackgroundColor(): string {
    return this.theme.colors.background
  }

  private addLogoToSlide(pptxSlide: PptxGenJS.Slide, position: 'top-left' | 'top-right' = 'top-right'): void {
    if (this.theme.logo) {
      const logoOptions: PptxGenJS.ImageProps = {
        data: this.theme.logo,
        w: 1,
        h: 0.5,
        sizing: { type: 'contain', w: 1, h: 0.5 },
      }

      if (position === 'top-right') {
        logoOptions.x = 8.5
        logoOptions.y = 0.2
      } else {
        logoOptions.x = 0.3
        logoOptions.y = 0.2
      }

      pptxSlide.addImage(logoOptions)
    }
  }

  private addTitleSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()

    // Gradient-like background with colored shape on left
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Large decorative shape on the left
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 3.5,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Accent circle decoration
    pptxSlide.addShape('ellipse', {
      x: 2.5,
      y: 3.5,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.accent },
    })

    // Add logo
    if (this.theme.logo) {
      pptxSlide.addImage({
        data: this.theme.logo,
        x: 0.5,
        y: 0.5,
        w: 2,
        h: 1,
        sizing: { type: 'contain', w: 2, h: 1 },
      })
    }

    // Main title on the right side
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 4,
        y: 1.5,
        w: 5.5,
        h: 1.5,
        fontSize: 40,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'left',
        valign: 'middle',
      })
    }

    // Subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 4,
        y: 3.2,
        w: 5.5,
        h: 0.8,
        fontSize: 20,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        align: 'left',
        valign: 'top',
      })
    }

    // Decorative line under title
    pptxSlide.addShape('rect', {
      x: 4,
      y: 3,
      w: 1.5,
      h: 0.08,
      fill: { color: this.theme.colors.accent },
    })
  }

  private addTitleContentSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative left accent bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 0.12,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative corner accent
    pptxSlide.addShape('ellipse', {
      x: 8.5,
      y: -0.8,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.accent },
    })

    // Bottom decorative bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 5.35,
      w: 10,
      h: 0.275,
      fill: { color: this.theme.colors.secondary },
    })

    this.addLogoToSlide(pptxSlide)

    // Title with decorative underline
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 0.8,
        fontSize: 30,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })

      // Accent underline
      pptxSlide.addShape('rect', {
        x: 0.5,
        y: 1.1,
        w: 1.5,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Content card
    pptxSlide.addShape('roundRect', {
      x: 0.4,
      y: 1.35,
      w: 9.2,
      h: 3.7,
      fill: { color: 'f8fafc' },
      line: { color: this.theme.colors.muted, width: 1 },
      rectRadius: 0.1,
    })

    // Content
    const content = slide.elements
      .filter(el => el.type === 'text')
      .map(el => el.content)
      .join('\n\n')

    if (content) {
      pptxSlide.addText(content, {
        x: 0.6,
        y: 1.5,
        w: 8.8,
        h: 3.4,
        fontSize: 16,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'top',
      })
    }
  }

  private addTitleBulletsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative sidebar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 0.15,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Header background
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 10,
      h: 1.2,
      fill: { color: this.theme.colors.primary },
    })

    this.addLogoToSlide(pptxSlide)

    // Title on colored header
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 0.7,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
      })
    }

    // Visual bullet points with colored icons
    const items = slide.elements.filter(el => el.type === 'bullet' || el.type === 'text')

    items.slice(0, 6).forEach((item, index) => {
      const y = 1.5 + index * 0.65

      // Colored bullet circle
      pptxSlide.addShape('ellipse', {
        x: 0.5,
        y: y + 0.08,
        w: 0.25,
        h: 0.25,
        fill: { color: this.theme.colors.accent },
      })

      // Bullet text
      pptxSlide.addText(item.content, {
        x: 0.9,
        y: y,
        w: 8.5,
        h: 0.5,
        fontSize: 16,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'middle',
      })
    })
  }

  private addTwoColumnsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative top bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 10,
      h: 0.1,
      fill: { color: this.theme.colors.primary },
    })

    this.addLogoToSlide(pptxSlide)

    // Title with accent underline
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.7,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
      })

      // Underline
      pptxSlide.addShape('rect', {
        x: 4,
        y: 1,
        w: 2,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Split content into two columns
    const elements = slide.elements.filter(el => el.type === 'bullet' || el.type === 'text')
    const midpoint = Math.ceil(elements.length / 2)
    const leftItems = elements.slice(0, midpoint)
    const rightItems = elements.slice(midpoint)

    // Left column card
    pptxSlide.addShape('roundRect', {
      x: 0.4,
      y: 1.3,
      w: 4.4,
      h: 3.8,
      fill: { color: 'f8fafc' },
      line: { color: this.theme.colors.primary, width: 2 },
      rectRadius: 0.1,
    })

    // Left column header
    pptxSlide.addShape('rect', {
      x: 0.4,
      y: 1.3,
      w: 4.4,
      h: 0.5,
      fill: { color: this.theme.colors.primary },
    })

    leftItems.forEach((item, index) => {
      const y = 2 + index * 0.55
      pptxSlide.addShape('ellipse', {
        x: 0.6,
        y: y + 0.05,
        w: 0.18,
        h: 0.18,
        fill: { color: this.theme.colors.accent },
      })
      pptxSlide.addText(item.content, {
        x: 0.9,
        y: y,
        w: 3.7,
        h: 0.45,
        fontSize: 13,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'middle',
      })
    })

    // Right column card
    pptxSlide.addShape('roundRect', {
      x: 5.2,
      y: 1.3,
      w: 4.4,
      h: 3.8,
      fill: { color: 'f8fafc' },
      line: { color: this.theme.colors.secondary, width: 2 },
      rectRadius: 0.1,
    })

    // Right column header
    pptxSlide.addShape('rect', {
      x: 5.2,
      y: 1.3,
      w: 4.4,
      h: 0.5,
      fill: { color: this.theme.colors.secondary },
    })

    rightItems.forEach((item, index) => {
      const y = 2 + index * 0.55
      pptxSlide.addShape('ellipse', {
        x: 5.4,
        y: y + 0.05,
        w: 0.18,
        h: 0.18,
        fill: { color: this.theme.colors.accent },
      })
      pptxSlide.addText(item.content, {
        x: 5.7,
        y: y,
        w: 3.7,
        h: 0.45,
        fontSize: 13,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'middle',
      })
    })
  }

  private addQuoteSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()

    // Gradient-like background with decorative shapes
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Large decorative circle on left
    pptxSlide.addShape('ellipse', {
      x: -2,
      y: 1,
      w: 4,
      h: 4,
      fill: { color: this.theme.colors.primary },
    })

    // Smaller accent circle
    pptxSlide.addShape('ellipse', {
      x: 8,
      y: -0.5,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.accent },
    })

    // Bottom decorative bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 5.2,
      w: 10,
      h: 0.425,
      fill: { color: this.theme.colors.secondary },
    })

    this.addLogoToSlide(pptxSlide)

    const quoteElement = slide.elements.find(el => el.type === 'quote' || el.type === 'text')

    if (quoteElement) {
      // Quote card background
      pptxSlide.addShape('roundRect', {
        x: 1.5,
        y: 1.2,
        w: 7,
        h: 3.2,
        fill: { color: 'ffffff' },
        shadow: { type: 'outer', blur: 8, offset: 3, angle: 45, opacity: 0.2 },
        rectRadius: 0.2,
      })

      // Decorative accent bar on left of card
      pptxSlide.addShape('rect', {
        x: 1.5,
        y: 1.2,
        w: 0.15,
        h: 3.2,
        fill: { color: this.theme.colors.accent },
      })

      // Large quote mark
      pptxSlide.addText('"', {
        x: 1.8,
        y: 1.1,
        w: 1,
        h: 1.2,
        fontSize: 80,
        fontFace: 'Georgia',
        color: this.theme.colors.accent,
      })

      // Quote text
      pptxSlide.addText(quoteElement.content, {
        x: 2,
        y: 1.8,
        w: 6,
        h: 1.8,
        fontSize: 22,
        fontFace: 'Georgia',
        color: this.theme.colors.primary,
        italic: true,
        align: 'center',
        valign: 'middle',
      })

      // Author with decorative line
      if (quoteElement.subContent || slide.subtitle) {
        pptxSlide.addShape('rect', {
          x: 4,
          y: 3.7,
          w: 2,
          h: 0.04,
          fill: { color: this.theme.colors.accent },
        })

        pptxSlide.addText(`— ${quoteElement.subContent || slide.subtitle}`, {
          x: 2,
          y: 3.85,
          w: 6,
          h: 0.5,
          fontSize: 16,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.secondary,
          bold: true,
          align: 'center',
        })
      }
    }
  }

  private addSectionSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()

    // Use primary color as background for section slides
    pptxSlide.background = { color: this.theme.colors.primary }

    // Large decorative circle on right
    pptxSlide.addShape('ellipse', {
      x: 6.5,
      y: -1,
      w: 5,
      h: 5,
      fill: { color: this.theme.colors.secondary },
    })

    // Small accent circle
    pptxSlide.addShape('ellipse', {
      x: -1,
      y: 4,
      w: 3,
      h: 3,
      fill: { color: this.theme.colors.accent },
    })

    // Geometric triangle shape
    pptxSlide.addShape('rtTriangle', {
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.accent },
      rotate: 180,
    })

    // Decorative lines
    pptxSlide.addShape('rect', {
      x: 2,
      y: 2.6,
      w: 6,
      h: 0.08,
      fill: { color: 'ffffff' },
    })

    // Add white/light logo for section slides
    if (this.theme.logo) {
      pptxSlide.addImage({
        data: this.theme.logo,
        x: 4,
        y: 0.5,
        w: 2,
        h: 0.8,
        sizing: { type: 'contain', w: 2, h: 0.8 },
      })
    }

    // Section number/indicator circle
    pptxSlide.addShape('ellipse', {
      x: 4.5,
      y: 1.5,
      w: 1,
      h: 1,
      fill: { color: 'ffffff' },
    })

    // Section title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 2.8,
        w: 9,
        h: 1.2,
        fontSize: 44,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })
    }

    // Decorative line after title
    pptxSlide.addShape('rect', {
      x: 3.5,
      y: 4,
      w: 3,
      h: 0.08,
      fill: { color: 'ffffff' },
    })

    // Optional subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 0.5,
        y: 4.2,
        w: 9,
        h: 0.8,
        fontSize: 18,
        fontFace: this.theme.fonts.body,
        color: '#ffffff',
        align: 'center',
        valign: 'middle',
      })
    }
  }

  private addImageLeftSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative background for left side
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 4.5,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative circle accent
    pptxSlide.addShape('ellipse', {
      x: 3,
      y: 3.5,
      w: 2.5,
      h: 2.5,
      fill: { color: this.theme.colors.accent },
    })

    // Image placeholder with shadow effect
    pptxSlide.addShape('roundRect', {
      x: 0.38,
      y: 0.58,
      w: 3.8,
      h: 4.5,
      fill: { color: '000000' },
      rectRadius: 0.15,
    })
    pptxSlide.addShape('roundRect', {
      x: 0.3,
      y: 0.5,
      w: 3.8,
      h: 4.5,
      fill: { color: 'f8fafc' },
      rectRadius: 0.15,
    })

    pptxSlide.addText('📷', {
      x: 0.3,
      y: 2.2,
      w: 3.8,
      h: 1,
      fontSize: 48,
      align: 'center',
    })

    pptxSlide.addText('Image', {
      x: 0.3,
      y: 3,
      w: 3.8,
      h: 0.5,
      fontSize: 14,
      color: this.theme.colors.muted,
      align: 'center',
    })

    this.addLogoToSlide(pptxSlide)

    // Title on right with decorative line
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 4.8,
        y: 0.5,
        w: 4.8,
        h: 0.8,
        fontSize: 26,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })

      // Accent underline
      pptxSlide.addShape('rect', {
        x: 4.8,
        y: 1.3,
        w: 1.2,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Content on right with visual bullets
    const items = slide.elements.filter(el => el.type === 'bullet' || el.type === 'text')

    items.slice(0, 5).forEach((item, index) => {
      const y = 1.6 + index * 0.7

      // Bullet circle
      pptxSlide.addShape('ellipse', {
        x: 4.8,
        y: y + 0.12,
        w: 0.22,
        h: 0.22,
        fill: { color: this.theme.colors.accent },
      })

      // Bullet text
      pptxSlide.addText(item.content, {
        x: 5.15,
        y: y,
        w: 4.4,
        h: 0.6,
        fontSize: 14,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'middle',
      })
    })
  }

  private addImageRightSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative background for right side
    pptxSlide.addShape('rect', {
      x: 5.5,
      y: 0,
      w: 4.5,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative circle accent
    pptxSlide.addShape('ellipse', {
      x: 4.5,
      y: -0.5,
      w: 2.5,
      h: 2.5,
      fill: { color: this.theme.colors.accent },
    })

    // Decorative bottom bar on left
    pptxSlide.addShape('rect', {
      x: 0,
      y: 5.2,
      w: 5.5,
      h: 0.425,
      fill: { color: this.theme.colors.secondary },
    })

    this.addLogoToSlide(pptxSlide, 'top-left')

    // Title on left with decorative line
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.5,
        w: 4.6,
        h: 0.8,
        fontSize: 26,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })

      // Accent underline
      pptxSlide.addShape('rect', {
        x: 0.5,
        y: 1.3,
        w: 1.2,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Content on left with visual bullets
    const items = slide.elements.filter(el => el.type === 'bullet' || el.type === 'text')

    items.slice(0, 5).forEach((item, index) => {
      const y = 1.6 + index * 0.7

      // Bullet circle
      pptxSlide.addShape('ellipse', {
        x: 0.5,
        y: y + 0.12,
        w: 0.22,
        h: 0.22,
        fill: { color: this.theme.colors.accent },
      })

      // Bullet text
      pptxSlide.addText(item.content, {
        x: 0.85,
        y: y,
        w: 4.3,
        h: 0.6,
        fontSize: 14,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'middle',
      })
    })

    // Image placeholder with shadow effect
    pptxSlide.addShape('roundRect', {
      x: 5.98,
      y: 0.58,
      w: 3.8,
      h: 4.5,
      fill: { color: '000000' },
      rectRadius: 0.15,
    })
    pptxSlide.addShape('roundRect', {
      x: 5.9,
      y: 0.5,
      w: 3.8,
      h: 4.5,
      fill: { color: 'f8fafc' },
      rectRadius: 0.15,
    })

    pptxSlide.addText('📷', {
      x: 5.9,
      y: 2.2,
      w: 3.8,
      h: 1,
      fontSize: 48,
      align: 'center',
    })

    pptxSlide.addText('Image', {
      x: 5.9,
      y: 3,
      w: 3.8,
      h: 0.5,
      fontSize: 14,
      color: this.theme.colors.muted,
      align: 'center',
    })
  }

  private addStatsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()

    // Dark background for impact
    pptxSlide.background = { color: this.theme.colors.primary }

    // Decorative circles
    pptxSlide.addShape('ellipse', {
      x: -1,
      y: -1,
      w: 3,
      h: 3,
      fill: { color: this.theme.colors.secondary },
    })
    pptxSlide.addShape('ellipse', {
      x: 8.5,
      y: 4,
      w: 2.5,
      h: 2.5,
      fill: { color: this.theme.colors.accent },
    })

    // Title in white
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.4,
        w: 9,
        h: 0.7,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
      })
    }

    // Stats cards (up to 4)
    const stats = slide.elements.slice(0, 4)
    const cardWidth = 2.1
    const gap = 0.3
    const totalWidth = stats.length * cardWidth + (stats.length - 1) * gap
    const startX = (10 - totalWidth) / 2

    stats.forEach((stat, index) => {
      const x = startX + index * (cardWidth + gap)

      // White card with shadow effect
      pptxSlide.addShape('roundRect', {
        x: x + 0.05,
        y: 1.55,
        w: cardWidth,
        h: 3.2,
        fill: { color: '000000' },
        rectRadius: 0.15,
      })
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.5,
        w: cardWidth,
        h: 3.2,
        fill: { color: 'ffffff' },
        rectRadius: 0.15,
      })

      // Icon circle at top
      pptxSlide.addShape('ellipse', {
        x: x + (cardWidth - 0.6) / 2,
        y: 1.7,
        w: 0.6,
        h: 0.6,
        fill: { color: this.theme.colors.accent },
      })

      // Big number/stat
      const parts = stat.content.split('|')
      const number = parts[0] || stat.content
      const label = parts[1] || ''

      pptxSlide.addText(number, {
        x,
        y: 2.5,
        w: cardWidth,
        h: 1,
        fontSize: 36,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Divider line
      pptxSlide.addShape('rect', {
        x: x + 0.4,
        y: 3.5,
        w: cardWidth - 0.8,
        h: 0.03,
        fill: { color: this.theme.colors.accent },
      })

      // Label
      if (label) {
        pptxSlide.addText(label, {
          x,
          y: 3.7,
          w: cardWidth,
          h: 0.9,
          fontSize: 12,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          align: 'center',
          valign: 'top',
        })
      }
    })
  }

  private addCardsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative top gradient bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 10,
      h: 1.1,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative corner accent
    pptxSlide.addShape('ellipse', {
      x: 8.5,
      y: -0.5,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.accent },
    })

    this.addLogoToSlide(pptxSlide)

    // Title on colored header
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 0.6,
        fontSize: 26,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
      })
    }

    // Cards (up to 3)
    const cards = slide.elements.slice(0, 3)
    const cardWidth = 2.8
    const gap = 0.5
    const totalWidth = cards.length * cardWidth + (cards.length - 1) * gap
    const startX = (10 - totalWidth) / 2
    const cardColors = [this.theme.colors.primary, this.theme.colors.secondary, this.theme.colors.accent]

    cards.forEach((card, index) => {
      const x = startX + index * (cardWidth + gap)

      // Shadow effect
      pptxSlide.addShape('roundRect', {
        x: x + 0.08,
        y: 1.48,
        w: cardWidth,
        h: 3.6,
        fill: { color: '000000' },
        rectRadius: 0.15,
      })

      // Card background
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.4,
        w: cardWidth,
        h: 3.6,
        fill: { color: 'ffffff' },
        rectRadius: 0.15,
      })

      // Colored top strip on card
      pptxSlide.addShape('rect', {
        x,
        y: 1.4,
        w: cardWidth,
        h: 0.15,
        fill: { color: cardColors[index % cardColors.length] },
      })

      // Icon circle with number
      pptxSlide.addShape('ellipse', {
        x: x + (cardWidth - 0.9) / 2,
        y: 1.7,
        w: 0.9,
        h: 0.9,
        fill: { color: cardColors[index % cardColors.length] },
      })

      // Number in circle
      pptxSlide.addText(`${index + 1}`, {
        x: x + (cardWidth - 0.9) / 2,
        y: 1.7,
        w: 0.9,
        h: 0.9,
        fontSize: 24,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Card title and content
      const parts = card.content.split('|')
      const cardTitle = parts[0] || ''
      const cardContent = parts[1] || card.content

      if (cardTitle && parts.length > 1) {
        // Decorative line under icon
        pptxSlide.addShape('rect', {
          x: x + 0.6,
          y: 2.75,
          w: cardWidth - 1.2,
          h: 0.04,
          fill: { color: cardColors[index % cardColors.length] },
        })

        pptxSlide.addText(cardTitle, {
          x,
          y: 2.9,
          w: cardWidth,
          h: 0.6,
          fontSize: 14,
          fontFace: this.theme.fonts.heading,
          color: this.theme.colors.primary,
          bold: true,
          align: 'center',
        })

        pptxSlide.addText(cardContent, {
          x: x + 0.2,
          y: 3.5,
          w: cardWidth - 0.4,
          h: 1.3,
          fontSize: 11,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          align: 'center',
          valign: 'top',
        })
      } else {
        pptxSlide.addText(cardContent, {
          x: x + 0.2,
          y: 2.9,
          w: cardWidth - 0.4,
          h: 1.9,
          fontSize: 12,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          align: 'center',
          valign: 'top',
        })
      }
    })
  }

  private addTimelineSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative side bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 0.12,
      h: 5.625,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative bottom bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 5.2,
      w: 10,
      h: 0.425,
      fill: { color: this.theme.colors.accent },
    })

    this.addLogoToSlide(pptxSlide)

    // Title with underline
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.7,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
      })

      // Decorative underline
      pptxSlide.addShape('rect', {
        x: 4,
        y: 1,
        w: 2,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Timeline items (up to 5)
    const items = slide.elements.slice(0, 5)
    const itemWidth = 8.4 / items.length

    // Timeline line with gradient effect (multiple rectangles)
    pptxSlide.addShape('rect', {
      x: 0.8,
      y: 2.4,
      w: 8.4,
      h: 0.12,
      fill: { color: this.theme.colors.primary },
    })

    items.forEach((item, index) => {
      const x = 0.8 + index * itemWidth + itemWidth / 2
      const colors = [this.theme.colors.primary, this.theme.colors.secondary, this.theme.colors.accent]
      const color = colors[index % colors.length]

      // Arrow connector
      if (index < items.length - 1) {
        pptxSlide.addShape('rightArrow', {
          x: x + 0.3,
          y: 2.35,
          w: 0.5,
          h: 0.22,
          fill: { color: this.theme.colors.accent },
        })
      }

      // Large circle with shadow
      pptxSlide.addShape('ellipse', {
        x: x - 0.32,
        y: 2.18,
        w: 0.6,
        h: 0.6,
        fill: { color: '000000' },
      })
      pptxSlide.addShape('ellipse', {
        x: x - 0.35,
        y: 2.15,
        w: 0.6,
        h: 0.6,
        fill: { color: color },
      })

      // Step number
      pptxSlide.addText(`${index + 1}`, {
        x: x - 0.35,
        y: 2.15,
        w: 0.6,
        h: 0.6,
        fontSize: 18,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Card below timeline
      pptxSlide.addShape('roundRect', {
        x: x - itemWidth / 2 + 0.1,
        y: 2.95,
        w: itemWidth - 0.2,
        h: 2,
        fill: { color: 'f8fafc' },
        line: { color: color, width: 2 },
        rectRadius: 0.1,
      })

      // Colored top of card
      pptxSlide.addShape('rect', {
        x: x - itemWidth / 2 + 0.1,
        y: 2.95,
        w: itemWidth - 0.2,
        h: 0.08,
        fill: { color: color },
      })

      // Content
      const parts = item.content.split('|')
      const stepTitle = parts[0] || ''
      const stepDesc = parts[1] || ''

      pptxSlide.addText(stepTitle, {
        x: x - itemWidth / 2 + 0.1,
        y: 3.1,
        w: itemWidth - 0.2,
        h: 0.5,
        fontSize: 11,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
      })

      if (stepDesc) {
        pptxSlide.addText(stepDesc, {
          x: x - itemWidth / 2 + 0.15,
          y: 3.55,
          w: itemWidth - 0.3,
          h: 1.2,
          fontSize: 9,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          align: 'center',
          valign: 'top',
        })
      }
    })
  }

  private addComparisonSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative header bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 10,
      h: 1.1,
      fill: { color: this.theme.colors.primary },
    })

    // Decorative circles in header
    pptxSlide.addShape('ellipse', {
      x: -0.5,
      y: -0.5,
      w: 1.5,
      h: 1.5,
      fill: { color: this.theme.colors.secondary },
    })
    pptxSlide.addShape('ellipse', {
      x: 9,
      y: 0.4,
      w: 1.2,
      h: 1.2,
      fill: { color: this.theme.colors.accent },
    })

    this.addLogoToSlide(pptxSlide)

    // Title in header
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 0.6,
        fontSize: 26,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
      })
    }

    // Comparison columns (up to 3)
    const items = slide.elements.slice(0, 3)
    const colWidth = items.length === 2 ? 4.2 : 2.9
    const gap = 0.4
    const totalWidth = items.length * colWidth + (items.length - 1) * gap
    const startX = (10 - totalWidth) / 2
    const colors = [this.theme.colors.primary, this.theme.colors.secondary, this.theme.colors.accent]

    items.forEach((item, index) => {
      const x = startX + index * (colWidth + gap)
      const color = colors[index % colors.length]

      // Shadow
      pptxSlide.addShape('roundRect', {
        x: x + 0.06,
        y: 1.36,
        w: colWidth,
        h: 3.9,
        fill: { color: '000000' },
        rectRadius: 0.12,
      })

      // Column container
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.3,
        w: colWidth,
        h: 3.9,
        fill: { color: 'ffffff' },
        rectRadius: 0.12,
      })

      // Column header
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.3,
        w: colWidth,
        h: 0.8,
        fill: { color: color },
        rectRadius: 0.12,
      })
      // Cover bottom corners of header
      pptxSlide.addShape('rect', {
        x,
        y: 1.8,
        w: colWidth,
        h: 0.3,
        fill: { color: color },
      })

      const parts = item.content.split('|')
      const colTitle = parts[0] || ''
      const colItems = parts.slice(1)

      // Icon/badge in header
      pptxSlide.addShape('ellipse', {
        x: x + (colWidth - 0.5) / 2,
        y: 1.4,
        w: 0.5,
        h: 0.5,
        fill: { color: 'ffffff' },
      })

      pptxSlide.addText(colTitle, {
        x,
        y: 1.95,
        w: colWidth,
        h: 0.35,
        fontSize: 14,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Decorative divider
      pptxSlide.addShape('rect', {
        x: x + 0.4,
        y: 2.4,
        w: colWidth - 0.8,
        h: 0.04,
        fill: { color: color },
      })

      // Column items with checkmarks
      if (colItems.length > 0) {
        colItems.slice(0, 5).forEach((text, i) => {
          const itemY = 2.6 + i * 0.5

          // Checkmark circle
          pptxSlide.addShape('ellipse', {
            x: x + 0.2,
            y: itemY + 0.08,
            w: 0.22,
            h: 0.22,
            fill: { color: color },
          })

          // Checkmark text
          pptxSlide.addText('✓', {
            x: x + 0.2,
            y: itemY + 0.02,
            w: 0.22,
            h: 0.3,
            fontSize: 10,
            color: '#ffffff',
            align: 'center',
          })

          // Item text
          pptxSlide.addText(text.trim(), {
            x: x + 0.5,
            y: itemY,
            w: colWidth - 0.7,
            h: 0.45,
            fontSize: 11,
            fontFace: this.theme.fonts.body,
            color: this.theme.colors.text,
            valign: 'middle',
          })
        })
      }
    })
  }

  private addTableSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Decorative side bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 0,
      w: 0.12,
      h: 5.625,
      fill: { color: this.theme.colors.accent },
    })

    // Decorative top corner
    pptxSlide.addShape('ellipse', {
      x: 8.5,
      y: -0.5,
      w: 2,
      h: 2,
      fill: { color: this.theme.colors.primary },
    })

    this.addLogoToSlide(pptxSlide)

    // Title with decorative underline
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 8,
        h: 0.7,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })

      // Decorative underline
      pptxSlide.addShape('rect', {
        x: 0.5,
        y: 1,
        w: 1.5,
        h: 0.06,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Parse table data from elements
    const rows: string[][] = slide.elements.map(el =>
      el.content.split('|').map(cell => cell.trim())
    )

    if (rows.length > 0) {
      // Table shadow/container
      pptxSlide.addShape('roundRect', {
        x: 0.48,
        y: 1.28,
        w: 9.1,
        h: rows.length * 0.55 + 0.1,
        fill: { color: '000000' },
        rectRadius: 0.08,
      })

      const tableData = rows.map((row, rowIndex) =>
        row.map((cell, colIndex) => ({
          text: cell,
          options: {
            fill: { color: rowIndex === 0 ? this.theme.colors.primary : (rowIndex % 2 === 0 ? 'f0f9ff' : 'ffffff') },
            color: rowIndex === 0 ? 'ffffff' : this.theme.colors.text.replace('#', ''),
            bold: rowIndex === 0 || colIndex === 0,
            fontSize: rowIndex === 0 ? 13 : 11,
            fontFace: rowIndex === 0 ? this.theme.fonts.heading : this.theme.fonts.body,
            align: 'center' as const,
            valign: 'middle' as const,
          },
        }))
      )

      pptxSlide.addTable(tableData, {
        x: 0.5,
        y: 1.25,
        w: 9,
        colW: rows[0] ? 9 / rows[0].length : 3,
        rowH: 0.55,
        border: { type: 'solid', pt: 1, color: this.theme.colors.primary },
      })

      // Accent bar below header row
      pptxSlide.addShape('rect', {
        x: 0.5,
        y: 1.78,
        w: 9,
        h: 0.04,
        fill: { color: this.theme.colors.accent },
      })
    }

    // Bottom decorative bar
    pptxSlide.addShape('rect', {
      x: 0,
      y: 5.35,
      w: 10,
      h: 0.275,
      fill: { color: this.theme.colors.secondary },
    })
  }

  public addSlide(slide: Slide): void {
    switch (slide.layout) {
      case 'title':
        this.addTitleSlide(slide)
        break
      case 'title-content':
        this.addTitleContentSlide(slide)
        break
      case 'title-bullets':
        this.addTitleBulletsSlide(slide)
        break
      case 'two-columns':
        this.addTwoColumnsSlide(slide)
        break
      case 'image-left':
        this.addImageLeftSlide(slide)
        break
      case 'image-right':
        this.addImageRightSlide(slide)
        break
      case 'quote':
        this.addQuoteSlide(slide)
        break
      case 'section':
        this.addSectionSlide(slide)
        break
      case 'stats':
        this.addStatsSlide(slide)
        break
      case 'cards':
        this.addCardsSlide(slide)
        break
      case 'timeline':
        this.addTimelineSlide(slide)
        break
      case 'comparison':
        this.addComparisonSlide(slide)
        break
      case 'table':
        this.addTableSlide(slide)
        break
      default:
        this.addTitleContentSlide(slide)
    }
  }

  public async generate(): Promise<Blob> {
    return await this.pptx.write({ outputType: 'blob' }) as Blob
  }

  public async generateBase64(): Promise<string> {
    return await this.pptx.write({ outputType: 'base64' }) as string
  }
}

export async function generatePptx(presentation: Presentation, customTheme?: Theme): Promise<Blob> {
  const generator = new PptxGenerator(presentation, customTheme)

  for (const slide of presentation.slides) {
    generator.addSlide(slide)
  }

  return await generator.generate()
}

export async function generatePptxBase64(presentation: Presentation): Promise<string> {
  const generator = new PptxGenerator(presentation)

  for (const slide of presentation.slides) {
    generator.addSlide(slide)
  }

  return await generator.generateBase64()
}

export async function generatePptxBase64WithTheme(presentation: Presentation, customTheme?: Theme): Promise<string> {
  const generator = new PptxGenerator(presentation, customTheme)

  for (const slide of presentation.slides) {
    generator.addSlide(slide)
  }

  return await generator.generateBase64()
}
