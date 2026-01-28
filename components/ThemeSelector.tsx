'use client'

/* eslint-disable @next/next/no-img-element */
import { Theme, ThemeName } from '@/types/slides'
import { getAllThemes } from '@/lib/pptx/themes'
import { CustomThemeUploader } from './CustomThemeUploader'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface ThemeSelectorProps {
  selectedTheme: ThemeName | string
  onSelectTheme: (theme: ThemeName | string) => void
  customThemes?: Theme[]
  onAddCustomTheme?: (theme: Theme) => void
  onRemoveCustomTheme?: (themeName: string) => void
}

export function ThemeSelector({
  selectedTheme,
  onSelectTheme,
  customThemes = [],
  onAddCustomTheme,
  onRemoveCustomTheme,
}: ThemeSelectorProps) {
  const defaultThemes = getAllThemes()
  const allThemes = [...defaultThemes, ...customThemes]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allThemes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isSelected={selectedTheme === theme.name}
            onSelect={() => onSelectTheme(theme.name)}
            isCustom={customThemes.some(t => t.name === theme.name)}
            onRemove={
              customThemes.some(t => t.name === theme.name) && onRemoveCustomTheme
                ? () => onRemoveCustomTheme(theme.name)
                : undefined
            }
          />
        ))}
      </div>

      {onAddCustomTheme && (
        <CustomThemeUploader onCustomThemeCreate={onAddCustomTheme} />
      )}
    </div>
  )
}

interface ThemeCardProps {
  theme: Theme
  isSelected: boolean
  onSelect: () => void
  isCustom?: boolean
  onRemove?: () => void
}

function ThemeCard({ theme, isSelected, onSelect, isCustom, onRemove }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all duration-200 text-left',
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Custom theme delete button */}
      {isCustom && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-1 left-1 p-1 bg-red-100 hover:bg-red-200 rounded-full z-10"
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </button>
      )}

      {/* Theme preview */}
      <div
        className="w-full h-16 rounded-md mb-2 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="flex flex-col items-center gap-1">
          {theme.logo ? (
            <img
              src={theme.logo}
              alt={theme.displayName}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <div
              className="text-xs font-bold truncate px-2"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
              }}
            >
              Title
            </div>
          )}
          <div className="flex gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
        </div>
      </div>

      {/* Theme info */}
      <div className="space-y-0.5">
        <h4 className="font-medium text-sm text-gray-900 flex items-center gap-1">
          {theme.displayName}
          {isCustom && (
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1 rounded">
              Custom
            </span>
          )}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-1">{theme.description}</p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
