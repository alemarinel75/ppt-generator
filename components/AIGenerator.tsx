'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slide } from '@/types/slides'
import { Loader2, Sparkles, AlertCircle } from 'lucide-react'

interface AIGeneratorProps {
  onGenerate: (slides: Slide[], title: string) => void
}

export function AIGenerator({ onGenerate }: AIGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [slideCount, setSlideCount] = useState('8')
  const [style, setStyle] = useState<'formal' | 'casual' | 'creative'>('formal')
  const [language, setLanguage] = useState('fr')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Veuillez entrer un sujet')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          slideCount: parseInt(slideCount),
          style,
          language,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'La génération a échoué')
      }

      onGenerate(data.data.slides, data.data.title)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Sujet de la présentation</Label>
        <Textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Décrivez le sujet de votre présentation. Par exemple : 'Une présentation sur les énergies renouvelables, couvrant le solaire, l'éolien et l'hydraulique, leurs avantages et inconvénients'"
          className="min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="slideCount">Slides</Label>
          <Select value={slideCount} onValueChange={setSlideCount} disabled={isLoading}>
            <SelectTrigger id="slideCount">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Select
            value={style}
            onValueChange={(v) => setStyle(v as typeof style)}
            disabled={isLoading}
          >
            <SelectTrigger id="style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formel</SelectItem>
              <SelectItem value="casual">Décontracté</SelectItem>
              <SelectItem value="creative">Créatif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Langue</Label>
          <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">Anglais</SelectItem>
              <SelectItem value="es">Espagnol</SelectItem>
              <SelectItem value="de">Allemand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isLoading || !topic.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Générer la présentation
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        L&apos;IA va générer une présentation structurée basée sur votre sujet.
      </p>
    </div>
  )
}
