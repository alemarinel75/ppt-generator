import { Theme, ThemeName } from '@/types/slides'

export type { Theme } from '@/types/slides'

export const themes: Record<ThemeName, Theme> = {
  corporate: {
    name: 'corporate',
    displayName: 'Corporate',
    description: 'Professional blue and gray theme',
    colors: {
      primary: '#1e3a5f',
      secondary: '#4a6fa5',
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#3b82f6',
      muted: '#6b7280',
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial',
    },
  },
  minimal: {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Clean black and white design',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      background: '#ffffff',
      text: '#111827',
      accent: '#6b7280',
      muted: '#9ca3af',
    },
    fonts: {
      heading: 'Helvetica',
      body: 'Helvetica',
    },
  },
  creative: {
    name: 'creative',
    displayName: 'Creative',
    description: 'Colorful and dynamic theme',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      background: '#faf5ff',
      text: '#1f2937',
      accent: '#f59e0b',
      muted: '#6b7280',
    },
    fonts: {
      heading: 'Georgia',
      body: 'Arial',
    },
  },
  nature: {
    name: 'nature',
    displayName: 'Nature',
    description: 'Calming green and beige palette',
    colors: {
      primary: '#166534',
      secondary: '#4ade80',
      background: '#f5f5dc',
      text: '#1a1a1a',
      accent: '#84cc16',
      muted: '#6b7280',
    },
    fonts: {
      heading: 'Georgia',
      body: 'Arial',
    },
  },
  tech: {
    name: 'tech',
    displayName: 'Tech',
    description: 'Modern gradient theme',
    colors: {
      primary: '#0ea5e9',
      secondary: '#8b5cf6',
      background: '#0f172a',
      text: '#f8fafc',
      accent: '#22d3ee',
      muted: '#94a3b8',
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial',
    },
  },
  academic: {
    name: 'academic',
    displayName: 'Academic',
    description: 'Scholarly and professional',
    colors: {
      primary: '#7c2d12',
      secondary: '#b45309',
      background: '#fffbeb',
      text: '#1c1917',
      accent: '#d97706',
      muted: '#78716c',
    },
    fonts: {
      heading: 'Times New Roman',
      body: 'Times New Roman',
    },
  },
}

export function getTheme(name: ThemeName): Theme {
  return themes[name] || themes.corporate
}

export function getAllThemes(): Theme[] {
  return Object.values(themes)
}
