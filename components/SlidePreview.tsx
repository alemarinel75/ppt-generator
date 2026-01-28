'use client'

import { Slide, ThemeName, Theme } from '@/types/slides'
import { getTheme } from '@/lib/pptx/themes'
import { cn } from '@/lib/utils'

interface SlidePreviewProps {
  slide: Slide
  theme: ThemeName
  isSelected?: boolean
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  customTheme?: Theme | null
}

export function SlidePreview({
  slide,
  theme,
  isSelected = false,
  onClick,
  size = 'medium',
  customTheme,
}: SlidePreviewProps) {
  const themeData = customTheme || getTheme(theme)

  const sizeClasses = {
    small: 'w-32 h-18',
    medium: 'w-48 h-27',
    large: 'w-full aspect-video',
  }

  const fontSizes = {
    small: { title: 'text-[8px]', body: 'text-[6px]' },
    medium: { title: 'text-xs', body: 'text-[8px]' },
    large: { title: 'text-xl md:text-2xl', body: 'text-sm' },
  }

  const isBackgroundDark =
    themeData.colors.background === '#0f172a' || slide.layout === 'section'
  const bgColor =
    slide.layout === 'section' ? themeData.colors.primary : themeData.colors.background
  const textColor = isBackgroundDark || slide.layout === 'section' ? '#ffffff' : themeData.colors.text

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all',
        sizeClasses[size],
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 p-2 flex flex-col">
        {renderSlideContent(slide, themeData, fontSizes[size], textColor, size)}
      </div>
    </div>
  )
}

function renderSlideContent(
  slide: Slide,
  theme: ReturnType<typeof getTheme>,
  fontSize: { title: string; body: string },
  textColor: string,
  size: 'small' | 'medium' | 'large'
) {
  const titleStyle = {
    color: theme.colors.primary,
    fontFamily: theme.fonts.heading,
    textTransform: theme.fonts.headingUppercase ? 'uppercase' as const : 'none' as const,
  }

  switch (slide.layout) {
    case 'title':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div
            className={cn('font-bold', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Title'}
          </div>
          {slide.subtitle && (
            <div
              className={cn('mt-1', fontSize.body)}
              style={{ color: theme.colors.secondary }}
            >
              {slide.subtitle}
            </div>
          )}
        </div>
      )

    case 'section':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div
            className={cn('font-bold text-white', fontSize.title)}
            style={{
              fontFamily: theme.fonts.heading,
              textTransform: theme.fonts.headingUppercase ? 'uppercase' : 'none',
            }}
          >
            {slide.title || 'Section'}
          </div>
          {slide.subtitle && (
            <div className={cn('mt-1 text-white/80', fontSize.body)}>
              {slide.subtitle}
            </div>
          )}
        </div>
      )

    case 'quote':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-2">
          <div
            className={cn('italic', fontSize.body)}
            style={{ color: theme.colors.primary }}
          >
            &ldquo;{slide.elements[0]?.content || 'Quote'}&rdquo;
          </div>
          {(slide.elements[0]?.subContent || slide.subtitle) && (
            <div
              className={cn('mt-1', fontSize.body)}
              style={{ color: theme.colors.muted }}
            >
              — {slide.elements[0]?.subContent || slide.subtitle}
            </div>
          )}
        </div>
      )

    case 'two-columns':
      const midpoint = Math.ceil(slide.elements.length / 2)
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-1', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Title'}
          </div>
          <div className="flex gap-2 h-full">
            <div className="flex-1">
              {slide.elements.slice(0, midpoint).map((el, i) => (
                <div
                  key={i}
                  className={cn('flex items-start gap-1', fontSize.body)}
                  style={{ color: textColor }}
                >
                  <span style={{ color: theme.colors.accent }}>•</span>
                  <span className="line-clamp-1">{el.content}</span>
                </div>
              ))}
            </div>
            <div className="flex-1">
              {slide.elements.slice(midpoint).map((el, i) => (
                <div
                  key={i}
                  className={cn('flex items-start gap-1', fontSize.body)}
                  style={{ color: textColor }}
                >
                  <span style={{ color: theme.colors.accent }}>•</span>
                  <span className="line-clamp-1">{el.content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'image-left':
    case 'image-right':
      const isLeft = slide.layout === 'image-left'
      return (
        <div className={cn('flex gap-2 h-full', isLeft ? 'flex-row' : 'flex-row-reverse')}>
          <div
            className="w-1/3 rounded flex items-center justify-center"
            style={{ backgroundColor: theme.colors.muted }}
          >
            <span className="text-white text-[6px]">IMG</span>
          </div>
          <div className="flex-1">
            <div
              className={cn('font-bold mb-1', fontSize.title)}
              style={titleStyle}
            >
              {slide.title || 'Title'}
            </div>
            {slide.elements.slice(0, 3).map((el, i) => (
              <div
                key={i}
                className={cn('flex items-start gap-1', fontSize.body)}
                style={{ color: textColor }}
              >
                <span style={{ color: theme.colors.accent }}>•</span>
                <span className="line-clamp-1">{el.content}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-2 text-center', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Statistics'}
          </div>
          <div className="flex gap-1 justify-center">
            {slide.elements.slice(0, 4).map((el, i) => {
              const parts = el.content.split('|')
              return (
                <div
                  key={i}
                  className="flex-1 rounded p-1 text-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <div className="text-white font-bold" style={{ fontSize: size === 'large' ? '16px' : '8px' }}>
                    {parts[0]}
                  </div>
                  {parts[1] && (
                    <div className="text-white/80" style={{ fontSize: size === 'large' ? '8px' : '5px' }}>
                      {parts[1]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )

    case 'cards':
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-1 text-center', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Cards'}
          </div>
          <div className="flex gap-1 justify-center">
            {slide.elements.slice(0, 3).map((el, i) => {
              const parts = el.content.split('|')
              return (
                <div
                  key={i}
                  className="flex-1 rounded border p-1"
                  style={{ borderColor: theme.colors.muted, backgroundColor: '#f8fafc' }}
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                  <div className={cn('text-center font-medium', fontSize.body)} style={{ color: theme.colors.primary }}>
                    {parts[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )

    case 'timeline':
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-2 text-center', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Timeline'}
          </div>
          <div className="relative px-2">
            <div
              className="absolute left-2 right-2 top-3 h-0.5"
              style={{ backgroundColor: theme.colors.accent }}
            />
            <div className="flex justify-between relative">
              {slide.elements.slice(0, 4).map((el, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: theme.colors.primary, fontSize: '6px' }}
                  >
                    {i + 1}
                  </div>
                  <div className={cn('mt-1 text-center', fontSize.body)} style={{ color: theme.colors.text }}>
                    {el.content.split('|')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'comparison':
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-1 text-center', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Comparison'}
          </div>
          <div className="flex gap-1">
            {slide.elements.slice(0, 3).map((el, i) => {
              const parts = el.content.split('|')
              const colors = [theme.colors.primary, theme.colors.secondary, theme.colors.accent]
              return (
                <div key={i} className="flex-1">
                  <div
                    className="rounded-t px-1 py-0.5 text-white text-center"
                    style={{ backgroundColor: colors[i], fontSize: size === 'large' ? '10px' : '6px' }}
                  >
                    {parts[0]}
                  </div>
                  <div
                    className="rounded-b border-x border-b p-1"
                    style={{ borderColor: colors[i] }}
                  >
                    <div className={fontSize.body} style={{ color: theme.colors.text }}>
                      {parts.slice(1, 3).map((item, j) => (
                        <div key={j} className="flex items-center gap-0.5">
                          <span style={{ color: colors[i] }}>✓</span>
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )

    case 'table':
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-1', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Table'}
          </div>
          <div className="border rounded overflow-hidden" style={{ borderColor: theme.colors.muted }}>
            {slide.elements.slice(0, 4).map((el, i) => {
              const cells = el.content.split('|')
              return (
                <div
                  key={i}
                  className="flex"
                  style={{
                    backgroundColor: i === 0 ? theme.colors.primary : (i % 2 === 0 ? '#f8fafc' : '#ffffff'),
                  }}
                >
                  {cells.slice(0, 3).map((cell, j) => (
                    <div
                      key={j}
                      className={cn('flex-1 px-1 py-0.5 border-r last:border-r-0', fontSize.body)}
                      style={{
                        color: i === 0 ? '#ffffff' : theme.colors.text,
                        borderColor: theme.colors.muted,
                        fontWeight: i === 0 ? 'bold' : 'normal',
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )

    default: // title-content, title-bullets
      return (
        <div className="h-full">
          <div
            className={cn('font-bold mb-1', fontSize.title)}
            style={titleStyle}
          >
            {slide.title || 'Title'}
          </div>
          <div className="space-y-0.5">
            {slide.elements.slice(0, 5).map((el, i) => (
              <div
                key={i}
                className={cn('flex items-start gap-1', fontSize.body)}
                style={{ color: textColor }}
              >
                <span style={{ color: theme.colors.accent }}>•</span>
                <span className="line-clamp-1">{el.content}</span>
              </div>
            ))}
            {slide.elements.length > 5 && (
              <div
                className={fontSize.body}
                style={{ color: theme.colors.muted }}
              >
                +{slide.elements.length - 5} more...
              </div>
            )}
          </div>
        </div>
      )
  }
}

interface SlideListProps {
  slides: Slide[]
  theme: ThemeName
  selectedIndex: number
  onSelectSlide: (index: number) => void
  customTheme?: Theme | null
}

export function SlideList({
  slides,
  theme,
  selectedIndex,
  onSelectSlide,
  customTheme,
}: SlideListProps) {
  return (
    <div className="flex flex-col gap-2">
      {slides.map((slide, index) => (
        <div key={slide.id} className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-4">{index + 1}</span>
          <SlidePreview
            slide={slide}
            theme={theme}
            size="small"
            isSelected={selectedIndex === index}
            onClick={() => onSelectSlide(index)}
            customTheme={customTheme}
          />
        </div>
      ))}
    </div>
  )
}
