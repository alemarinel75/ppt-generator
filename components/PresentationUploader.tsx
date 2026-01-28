'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Slide, SlideElement } from '@/types/slides'
import { Upload, FileUp, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import JSZip from 'jszip'

interface PresentationUploaderProps {
  onUpload: (slides: Slide[], title: string) => void
}

interface ParsedSlideContent {
  title?: string
  texts: string[]
}

export function PresentationUploader({ onUpload }: PresentationUploaderProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substring(2, 11)

  const parseXMLText = (xml: string): string[] => {
    const texts: string[] = []
    // Extract text from <a:t> tags (PowerPoint text elements)
    const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g)
    if (textMatches) {
      textMatches.forEach(match => {
        const text = match.replace(/<\/?a:t>/g, '').trim()
        if (text) {
          texts.push(text)
        }
      })
    }
    return texts
  }

  const detectSlideType = (texts: string[]): 'title' | 'title-bullets' | 'section' => {
    if (texts.length <= 2) {
      // Could be a title or section slide
      const firstText = texts[0] || ''
      if (firstText.length < 50) {
        return texts.length === 1 ? 'section' : 'title'
      }
    }
    return 'title-bullets'
  }

  const parseSlideContent = (xml: string): ParsedSlideContent => {
    const texts = parseXMLText(xml)
    return {
      title: texts[0],
      texts: texts.slice(1),
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.pptx')) {
      setError('Veuillez sélectionner un fichier .pptx')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)

      // Find all slide files
      const slideFiles: { name: string; content: string }[] = []

      for (const [path, zipEntry] of Object.entries(zip.files)) {
        if (path.match(/ppt\/slides\/slide\d+\.xml$/)) {
          const content = await zipEntry.async('string')
          slideFiles.push({ name: path, content })
        }
      }

      // Sort slides by number
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/slide(\d+)\.xml/)?.[1] || '0')
        const numB = parseInt(b.name.match(/slide(\d+)\.xml/)?.[1] || '0')
        return numA - numB
      })

      if (slideFiles.length === 0) {
        throw new Error('Aucune slide trouvée dans la présentation')
      }

      // Parse each slide
      const slides: Slide[] = slideFiles.map((slideFile, index) => {
        const content = parseSlideContent(slideFile.content)
        const slideType = detectSlideType([content.title || '', ...content.texts])

        const elements: SlideElement[] = content.texts.map(text => ({
          type: 'bullet' as const,
          content: text,
        }))

        return {
          id: generateId(),
          layout: index === 0 ? 'title' : slideType,
          title: content.title || `Slide ${index + 1}`,
          elements,
        }
      })

      // Extract presentation title from first slide or filename
      const presentationTitle = slides[0]?.title || file.name.replace('.pptx', '')

      setSuccess(true)
      setTimeout(() => {
        onUpload(slides, presentationTitle)
        setOpen(false)
        resetState()
      }, 1000)

    } catch (err) {
      console.error('Error parsing PPTX:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier')
    } finally {
      setIsLoading(false)
    }
  }

  const resetState = () => {
    setError(null)
    setSuccess(false)
    setFileName(null)
    setIsLoading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetState()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <FileUp className="w-4 h-4" />
          Importer une présentation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importer une présentation existante
          </DialogTitle>
          <DialogDescription>
            Uploadez un fichier PowerPoint (.pptx) pour extraire son contenu et le reformater avec votre charte graphique.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fichier PowerPoint</Label>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pptx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Analyse en cours...</p>
                </div>
              ) : success ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <p className="text-sm text-green-600">Import réussi !</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner un fichier .pptx
                  </p>
                  <p className="text-xs text-gray-400">
                    ou glissez-déposez ici
                  </p>
                </div>
              )}
            </div>
            {fileName && !error && (
              <p className="text-sm text-gray-600">Fichier : {fileName}</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Comment ça marche ?</h4>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Uploadez votre présentation existante</li>
              <li>Le contenu est extrait automatiquement</li>
              <li>Sélectionnez votre charte graphique</li>
              <li>Exportez avec le nouveau design</li>
            </ol>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
