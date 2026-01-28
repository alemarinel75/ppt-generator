'use client'

import { useState, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ThemeSelector } from '@/components/ThemeSelector'
import { SlidePreview, SlideList } from '@/components/SlidePreview'
import { AIGenerator } from '@/components/AIGenerator'
import { PresentationUploader } from '@/components/PresentationUploader'
import { getTheme } from '@/lib/pptx/themes'
import { Slide, ThemeName, Presentation, Theme } from '@/types/slides'
import {
  ArrowLeft,
  Download,
  Palette,
  FileText,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Upload,
} from 'lucide-react'
import Link from 'next/link'

function EditorContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') as 'ai' | 'import' | null

  const [slides, setSlides] = useState<Slide[]>([])
  const [themeName, setThemeName] = useState<ThemeName | string>('corporate')
  const [customThemes, setCustomThemes] = useState<Theme[]>([])
  const [title, setTitle] = useState('Ma Présentation')
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [mode, setMode] = useState<'ai' | 'import'>(initialMode === 'import' ? 'import' : 'ai')

  // Get the current theme object
  const currentTheme = useMemo(() => {
    const customTheme = customThemes.find(t => t.name === themeName)
    if (customTheme) return customTheme

    try {
      return getTheme(themeName as ThemeName)
    } catch {
      return getTheme('corporate')
    }
  }, [themeName, customThemes])

  const handleAIGenerate = useCallback((newSlides: Slide[], newTitle: string) => {
    setSlides(newSlides)
    setTitle(newTitle)
    setSelectedSlideIndex(0)
  }, [])

  const handleImport = useCallback((newSlides: Slide[], newTitle: string) => {
    setSlides(newSlides)
    setTitle(newTitle)
    setSelectedSlideIndex(0)
  }, [])

  const handleAddCustomTheme = useCallback((theme: Theme) => {
    setCustomThemes(prev => [...prev, theme])
    setThemeName(theme.name)
  }, [])

  const handleRemoveCustomTheme = useCallback((themeNameToRemove: string) => {
    setCustomThemes(prev => prev.filter(t => t.name !== themeNameToRemove))
    if (themeName === themeNameToRemove) {
      setThemeName('corporate')
    }
  }, [themeName])

  const handleExport = async () => {
    if (slides.length === 0) return

    setIsExporting(true)

    try {
      const presentation: Omit<Presentation, 'createdAt' | 'updatedAt'> & { customTheme?: Theme } = {
        id: crypto.randomUUID(),
        title,
        theme: themeName.startsWith('custom-') ? 'corporate' : themeName as ThemeName,
        slides,
      }

      // If using a custom theme, include the full theme data
      if (themeName.startsWith('custom-')) {
        presentation.customTheme = currentTheme
      }

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presentation),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Export failed')
      }

      // Download the file
      const byteCharacters = atob(data.data.base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.data.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const navigateSlide = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1)
    } else if (direction === 'next' && selectedSlideIndex < slides.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            />
          </div>
          <Button
            onClick={handleExport}
            disabled={slides.length === 0 || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter PPTX
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - Slide list */}
          <div className="col-span-2">
            <Card className="h-[calc(100vh-160px)]">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Slides ({slides.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  {slides.length > 0 ? (
                    <SlideList
                      slides={slides}
                      theme={themeName as ThemeName}
                      selectedIndex={selectedSlideIndex}
                      onSelectSlide={setSelectedSlideIndex}
                      customTheme={currentTheme}
                    />
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Pas encore de slides
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main content - Preview */}
          <div className="col-span-6">
            <Card className="h-[calc(100vh-160px)]">
              <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Aperçu</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateSlide('prev')}
                    disabled={selectedSlideIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    {slides.length > 0
                      ? `${selectedSlideIndex + 1} / ${slides.length}`
                      : '0 / 0'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateSlide('next')}
                    disabled={selectedSlideIndex >= slides.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {slides.length > 0 && slides[selectedSlideIndex] ? (
                  <div className="flex items-center justify-center h-[calc(100vh-300px)]">
                    <SlidePreview
                      slide={slides[selectedSlideIndex]}
                      theme={themeName as ThemeName}
                      size="large"
                      customTheme={currentTheme}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[calc(100vh-300px)] text-gray-400">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Importez un fichier ou générez du contenu</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - Controls */}
          <div className="col-span-4">
            <div className="space-y-4 h-[calc(100vh-160px)] overflow-auto">
              {/* Theme selector */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Charte graphique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeSelector
                    selectedTheme={themeName}
                    onSelectTheme={setThemeName}
                    customThemes={customThemes}
                    onAddCustomTheme={handleAddCustomTheme}
                    onRemoveCustomTheme={handleRemoveCustomTheme}
                  />
                </CardContent>
              </Card>

              {/* Content creation */}
              <Card className="flex-1">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Contenu</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mode toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={mode === 'import' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setMode('import')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Importer
                    </Button>
                    <Button
                      variant={mode === 'ai' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setMode('ai')}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Créer avec IA
                    </Button>
                  </div>

                  {mode === 'import' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Importez votre présentation existante pour la reformater avec votre charte graphique.
                      </p>
                      <PresentationUploader onUpload={handleImport} />
                      {slides.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3">
                          <p className="text-sm text-green-700">
                            {slides.length} slides importées ! Choisissez un thème puis exportez.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <AIGenerator onGenerate={handleAIGenerate} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <EditorContent />
    </Suspense>
  )
}
