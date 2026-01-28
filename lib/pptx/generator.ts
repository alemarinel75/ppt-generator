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

  private addStatsSlide(slide: Slide): void {
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

      // Card background
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.5,
        w: cardWidth,
        h: 3,
        fill: { color: this.theme.colors.primary },
        rectRadius: 0.1,
      })

      // Big number/stat
      const parts = stat.content.split('|')
      const number = parts[0] || stat.content
      const label = parts[1] || ''

      pptxSlide.addText(number, {
        x,
        y: 1.8,
        w: cardWidth,
        h: 1.2,
        fontSize: 36,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Label
      if (label) {
        pptxSlide.addText(label, {
          x,
          y: 3.2,
          w: cardWidth,
          h: 1,
          fontSize: 14,
          fontFace: this.theme.fonts.body,
          color: '#ffffff',
          align: 'center',
          valign: 'top',
        })
      }
    })
  }

  private addCardsSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    // Title
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
    }

    // Cards (up to 3)
    const cards = slide.elements.slice(0, 3)
    const cardWidth = 2.8
    const gap = 0.4
    const totalWidth = cards.length * cardWidth + (cards.length - 1) * gap
    const startX = (10 - totalWidth) / 2

    cards.forEach((card, index) => {
      const x = startX + index * (cardWidth + gap)

      // Card background
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.2,
        w: cardWidth,
        h: 3.8,
        fill: { color: '#f8fafc' },
        line: { color: this.theme.colors.muted, width: 1 },
        rectRadius: 0.15,
      })

      // Icon circle
      pptxSlide.addShape('ellipse', {
        x: x + (cardWidth - 0.8) / 2,
        y: 1.5,
        w: 0.8,
        h: 0.8,
        fill: { color: this.theme.colors.accent },
      })

      // Card title and content
      const parts = card.content.split('|')
      const cardTitle = parts[0] || ''
      const cardContent = parts[1] || card.content

      if (cardTitle && parts.length > 1) {
        pptxSlide.addText(cardTitle, {
          x,
          y: 2.5,
          w: cardWidth,
          h: 0.5,
          fontSize: 14,
          fontFace: this.theme.fonts.heading,
          color: this.theme.colors.primary,
          bold: true,
          align: 'center',
        })

        pptxSlide.addText(cardContent, {
          x: x + 0.2,
          y: 3.1,
          w: cardWidth - 0.4,
          h: 1.6,
          fontSize: 11,
          fontFace: this.theme.fonts.body,
          color: this.theme.colors.text,
          align: 'center',
          valign: 'top',
        })
      } else {
        pptxSlide.addText(cardContent, {
          x: x + 0.2,
          y: 2.5,
          w: cardWidth - 0.4,
          h: 2.2,
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
    this.addLogoToSlide(pptxSlide)

    // Title
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
    }

    // Timeline line
    pptxSlide.addShape('rect', {
      x: 0.8,
      y: 2.7,
      w: 8.4,
      h: 0.05,
      fill: { color: this.theme.colors.accent },
    })

    // Timeline items (up to 5)
    const items = slide.elements.slice(0, 5)
    const itemWidth = 8.4 / items.length

    items.forEach((item, index) => {
      const x = 0.8 + index * itemWidth + itemWidth / 2

      // Circle
      pptxSlide.addShape('ellipse', {
        x: x - 0.2,
        y: 2.5,
        w: 0.4,
        h: 0.4,
        fill: { color: this.theme.colors.primary },
      })

      // Step number
      pptxSlide.addText(`${index + 1}`, {
        x: x - 0.2,
        y: 2.5,
        w: 0.4,
        h: 0.4,
        fontSize: 12,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Content
      const parts = item.content.split('|')
      const stepTitle = parts[0] || ''
      const stepDesc = parts[1] || ''

      pptxSlide.addText(stepTitle, {
        x: x - itemWidth / 2,
        y: 3.1,
        w: itemWidth,
        h: 0.5,
        fontSize: 12,
        fontFace: this.theme.fonts.heading,
        color: this.theme.colors.primary,
        bold: true,
        align: 'center',
      })

      if (stepDesc) {
        pptxSlide.addText(stepDesc, {
          x: x - itemWidth / 2,
          y: 3.6,
          w: itemWidth,
          h: 1.2,
          fontSize: 10,
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
    this.addLogoToSlide(pptxSlide)

    // Title
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
    }

    // Comparison columns (up to 3)
    const items = slide.elements.slice(0, 3)
    const colWidth = items.length === 2 ? 4.2 : 2.8
    const gap = 0.4
    const totalWidth = items.length * colWidth + (items.length - 1) * gap
    const startX = (10 - totalWidth) / 2
    const colors = [this.theme.colors.primary, this.theme.colors.secondary, this.theme.colors.accent]

    items.forEach((item, index) => {
      const x = startX + index * (colWidth + gap)

      // Column header
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.2,
        w: colWidth,
        h: 0.7,
        fill: { color: colors[index % colors.length] },
        rectRadius: 0.1,
      })

      const parts = item.content.split('|')
      const colTitle = parts[0] || ''
      const colItems = parts.slice(1)

      pptxSlide.addText(colTitle, {
        x,
        y: 1.2,
        w: colWidth,
        h: 0.7,
        fontSize: 16,
        fontFace: this.theme.fonts.heading,
        color: '#ffffff',
        bold: true,
        align: 'center',
        valign: 'middle',
      })

      // Column content
      pptxSlide.addShape('roundRect', {
        x,
        y: 1.9,
        w: colWidth,
        h: 3.2,
        fill: { color: '#f8fafc' },
        line: { color: colors[index % colors.length], width: 2 },
        rectRadius: 0.1,
      })

      // Column items
      if (colItems.length > 0) {
        const bullets = colItems.map(text => ({
          text: text.trim(),
          options: {
            bullet: { type: 'bullet' as const, code: '2713' },
            fontSize: 12,
            fontFace: this.theme.fonts.body,
            color: this.theme.colors.text,
            paraSpaceAfter: 8,
          },
        }))

        pptxSlide.addText(bullets, {
          x: x + 0.2,
          y: 2.1,
          w: colWidth - 0.4,
          h: 2.8,
          valign: 'top',
        })
      }
    })
  }

  private addTableSlide(slide: Slide): void {
    const pptxSlide = this.pptx.addSlide()
    pptxSlide.background = { color: this.getBackgroundColor() }
    this.addLogoToSlide(pptxSlide)

    // Title
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
      })
    }

    // Parse table data from elements
    const rows: string[][] = slide.elements.map(el =>
      el.content.split('|').map(cell => cell.trim())
    )

    if (rows.length > 0) {
      const tableData: PptxGenJS.TableRow[] = rows.map((row, rowIndex) =>
        row.map(cell => ({
          text: cell,
          options: {
            fill: rowIndex === 0 ? this.theme.colors.primary : (rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff'),
            color: rowIndex === 0 ? '#ffffff' : this.theme.colors.text,
            bold: rowIndex === 0,
            fontSize: rowIndex === 0 ? 14 : 12,
            fontFace: rowIndex === 0 ? this.theme.fonts.heading : this.theme.fonts.body,
            align: 'center' as const,
            valign: 'middle' as const,
          },
        }))
      )

      pptxSlide.addTable(tableData, {
        x: 0.5,
        y: 1.2,
        w: 9,
        colW: rows[0] ? 9 / rows[0].length : 3,
        rowH: 0.5,
        border: { type: 'solid', pt: 1, color: this.theme.colors.muted },
      })
    }
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
