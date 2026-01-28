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
    pptxSlide.background = { color: this.getBackgroundColor() }

    // Add logo at top center for title slide
    if (this.theme.logo) {
      pptxSlide.addImage({
        data: this.theme.logo,
        x: 4,
        y: 0.5,
        w: 2,
        h: 1,
        sizing: { type: 'contain', w: 2, h: 1 },
      })
    }

    // Main title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: this.theme.logo ? 2 : 1.8,
        w: 9,
        h: 1.2,
        fontSize: 44,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
        valign: 'middle',
      })
    }

    // Subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 0.5,
        y: this.theme.logo ? 3.4 : 3.2,
        w: 9,
        h: 0.8,
        fontSize: 24,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.secondary,
        align: 'center',
        valign: 'middle',
      })
    }

    // Add decorative line
    pptxSlide.addShape('rect', {
      x: 3.5,
      y: this.theme.logo ? 3.2 : 3,
      w: 3,
      h: 0.05,
      fill: { color: this.theme.colors.accent },
    })
  }

  private addTitleContentSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    // Title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 32,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })
    }

    // Content
    const content = slide.elements
      .filter(el => el.type === 'text')
      .map(el => el.content)
      .join('\n\n')

    if (content) {
      pptxSlide.addText(content, {
        x: 0.5,
        y: 1.3,
        w: 9,
        h: 3.8,
        fontSize: 18,
        fontFace: this.theme.fonts.body,
        color: this.theme.colors.text,
        valign: 'top',
      })
    }
  }

  private addTitleBulletsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    // Title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 32,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })
    }

    // Bullet points
    const bullets = slide.elements
      .filter(el => el.type === 'bullet' || el.type === 'text')
      .map(el => ({
        text: el.content,
        options: {
          bullet: { type: 'bullet' as const, code: '2022' },
          fontSize: 18,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          paraSpaceAfter: 12,
        },
      }))

    if (bullets.length > 0) {
      pptxSlide.addText(bullets, {
        x: 0.5,
        y: 1.3,
        w: 9,
        h: 3.8,
        valign: 'top',
      })
    }
  }

  private addTwoColumnsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    // Title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.8,
        fontSize: 32,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })
    }

    // Split content into two columns
    const elements = slide.elements.filter(el => el.type === 'bullet' || el.type === 'text')
    const midpoint = Math.ceil(elements.length / 2)
    const leftItems = elements.slice(0, midpoint)
    const rightItems = elements.slice(midpoint)

    // Left column
    if (leftItems.length > 0) {
      const leftBullets = leftItems.map(el => ({
        text: el.content,
        options: {
          bullet: { type: 'bullet' as const, code: '2022' },
          fontSize: 16,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          paraSpaceAfter: 10,
        },
      }))
      pptxSlide.addText(leftBullets, {
        x: 0.5,
        y: 1.3,
        w: 4.2,
        h: 3.8,
        valign: 'top',
      })
    }

    // Right column
    if (rightItems.length > 0) {
      const rightBullets = rightItems.map(el => ({
        text: el.content,
        options: {
          bullet: { type: 'bullet' as const, code: '2022' },
          fontSize: 16,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          paraSpaceAfter: 10,
        },
      }))
      pptxSlide.addText(rightBullets, {
        x: 5.3,
        y: 1.3,
        w: 4.2,
        h: 3.8,
        valign: 'top',
      })
    }
  }

  private addQuoteSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    const quoteElement = slide.elements.find(el => el.type === 'quote' || el.type === 'text')

    if (quoteElement) {
      // Quote marks
      pptxSlide.addText('"', {
        x: 0.5,
        y: 1,
        w: 1,
        h: 1,
        fontSize: 72,
        fontFace: 'Georgia',
        color: this.theme.colors.accent,
      })

      // Quote text
      pptxSlide.addText(quoteElement.content, {
        x: 1,
        y: 1.5,
        w: 8,
        h: 2.5,
        fontSize: 28,
        fontFace: 'Georgia',
        color: this.theme.colors.primary,
        italic: true,
        align: 'center',
        valign: 'middle',
      })

      // Author
      if (quoteElement.subContent || slide.subtitle) {
        pptxSlide.addText(`— ${quoteElement.subContent || slide.subtitle}`, {
          x: 1,
          y: 4,
          w: 8,
          h: 0.6,
          fontSize: 18,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.muted,
          align: 'center',
        })
      }
    }
  }

  private addSectionSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()

    // Use primary color as background for section slides
    pptxSlide.background = { color: this.theme.colors.primary }

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

    // Section title
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: this.theme.logo ? 2.2 : 2,
        w: 9,
        h: 1.2,
        fontSize: 40,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })
    }

    // Optional subtitle
    if (slide.subtitle) {
      pptxSlide.addText(slide.subtitle, {
        x: 0.5,
        y: this.theme.logo ? 3.5 : 3.3,
        w: 9,
        h: 0.8,
        fontSize: 20,
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
    this.addLogoToSlide(pptxSlide)

    // Placeholder for image (colored rectangle)
    pptxSlide.addShape('rect', {
      x: 0.3,
      y: 0.3,
      w: 4,
      h: 5,
      fill: { color: this.theme.colors.muted },
    })

    pptxSlide.addText('Image', {
      x: 0.3,
      y: 2.5,
      w: 4,
      h: 0.6,
      fontSize: 16,
      color: '#ffffff',
      align: 'center',
    })

    // Title on right
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 4.7,
        y: 0.3,
        w: 5,
        h: 0.8,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })
    }

    // Content on right
    const bullets = slide.elements
      .filter(el => el.type === 'bullet' || el.type === 'text')
      .map(el => ({
        text: el.content,
        options: {
          bullet: { type: 'bullet' as const, code: '2022' },
          fontSize: 16,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          paraSpaceAfter: 10,
        },
      }))

    if (bullets.length > 0) {
      pptxSlide.addText(bullets, {
        x: 4.7,
        y: 1.3,
        w: 5,
        h: 3.8,
        valign: 'top',
      })
    }
  }

  private addImageRightSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide, 'top-left')

    // Title on left
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 5,
        h: 0.8,
        fontSize: 28,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
      })
    }

    // Content on left
    const bullets = slide.elements
      .filter(el => el.type === 'bullet' || el.type === 'text')
      .map(el => ({
        text: el.content,
        options: {
          bullet: { type: 'bullet' as const, code: '2022' },
          fontSize: 16,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          paraSpaceAfter: 10,
        },
      }))

    if (bullets.length > 0) {
      pptxSlide.addText(bullets, {
        x: 0.5,
        y: 1.3,
        w: 4.8,
        h: 3.8,
        valign: 'top',
      })
    }

    // Placeholder for image (colored rectangle)
    pptxSlide.addShape('rect', {
      x: 5.7,
      y: 0.3,
      w: 4,
      h: 5,
      fill: { color: this.theme.colors.muted },
    })

    pptxSlide.addText('Image', {
      x: 5.7,
      y: 2.5,
      w: 4,
      h: 0.6,
      fontSize: 16,
      color: '#ffffff',
      align: 'center',
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
