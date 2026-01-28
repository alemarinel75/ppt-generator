'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Theme, ThemeColors } from '@/types/slides'
import { Upload, Palette, Plus, X } from 'lucide-react'

interface CustomThemeUploaderProps {
  onCustomThemeCreate: (theme: Theme) => void
}

export function CustomThemeUploader({ onCustomThemeCreate }: CustomThemeUploaderProps) {
  const [open, setOpen] = useState(false)
  const [themeName, setThemeName] = useState('')
  const [logo, setLogo] = useState<string | null>(null)
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#1e3a5f',
    secondary: '#4a6fa5',
    background: '#ffffff',
    text: '#1a1a1a',
    accent: '#3b82f6',
    muted: '#6b7280',
  })
  const [fonts, setFonts] = useState({
    heading: 'Arial',
    body: 'Arial',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)

        // Extract colors from image (simplified - uses canvas)
        extractColorsFromImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const extractColorsFromImage = (imageData: string) => {
    const img = document.createElement('img')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Sample colors from different parts of the image
      const samplePoints = [
        { x: Math.floor(img.width * 0.1), y: Math.floor(img.height * 0.1) },
        { x: Math.floor(img.width * 0.5), y: Math.floor(img.height * 0.5) },
        { x: Math.floor(img.width * 0.9), y: Math.floor(img.height * 0.1) },
      ]

      const extractedColors: string[] = []
      samplePoints.forEach(point => {
        const pixel = ctx.getImageData(point.x, point.y, 1, 1).data
        const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
        extractedColors.push(hex)
      })

      // Apply extracted colors as suggestions
      if (extractedColors.length >= 2) {
        setColors(prev => ({
          ...prev,
          primary: extractedColors[0],
          secondary: extractedColors[1],
          accent: extractedColors[2] || extractedColors[0],
        }))
      }
    }
    img.src = imageData
  }

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }))
  }

  const handleCreateTheme = () => {
    if (!themeName.trim()) {
      alert('Veuillez entrer un nom pour votre thème')
      return
    }

    const customTheme: Theme = {
      name: `custom-${Date.now()}`,
      displayName: themeName,
      description: 'Thème personnalisé',
      colors,
      fonts,
      logo,
    }

    onCustomThemeCreate(customTheme)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setThemeName('')
    setLogo(null)
    setColors({
      primary: '#1e3a5f',
      secondary: '#4a6fa5',
      background: '#ffffff',
      text: '#1a1a1a',
      accent: '#3b82f6',
      muted: '#6b7280',
    })
    setFonts({ heading: 'Arial', body: 'Arial' })
  }

  const fontOptions = [
    // Polices système
    'Arial',
    'Helvetica',
    'Georgia',
    'Times New Roman',
    'Verdana',
    'Trebuchet MS',
    'Tahoma',
    'Palatino',
    // Google Fonts - Fun & Display
    'Luckiest Guy',
    'Bangers',
    'Pacifico',
    'Permanent Marker',
    'Fredoka One',
    'Lobster',
    'Righteous',
    'Satisfy',
    // Google Fonts - Modernes
    'Poppins',
    'Montserrat',
    'Raleway',
    'Roboto',
    'Open Sans',
    'Lato',
    'Inter',
    'Nunito',
    'Quicksand',
    // Google Fonts - Élégantes
    'Playfair Display',
    'Merriweather',
    'Cormorant Garamond',
    'Libre Baskerville',
    // Google Fonts - Condensées
    'Oswald',
    'Bebas Neue',
    'Anton',
    'Barlow Condensed',
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Créer ma charte graphique
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Créer votre charte graphique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Name */}
          <div className="space-y-2">
            <Label htmlFor="themeName">Nom du thème</Label>
            <Input
              id="themeName"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Ex: Ma marque, Mon entreprise..."
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo (optionnel)</Label>
            <p className="text-xs text-gray-500">
              Uploadez votre logo pour extraire automatiquement les couleurs
            </p>
            <div className="flex gap-4 items-start">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Uploader un logo
              </Button>
              {logo && (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-16 w-auto object-contain border rounded"
                  />
                  <button
                    onClick={() => setLogo(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <Label>Couleurs</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs capitalize">
                    {key === 'primary' && 'Principale'}
                    {key === 'secondary' && 'Secondaire'}
                    {key === 'background' && 'Fond'}
                    {key === 'text' && 'Texte'}
                    {key === 'accent' && 'Accent'}
                    {key === 'muted' && 'Atténué'}
                  </Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                      className="flex-1 font-mono text-xs"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fonts */}
          <div className="space-y-3">
            <Label>Polices</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Titres</Label>
                <select
                  value={fonts.heading}
                  onChange={(e) => setFonts(prev => ({ ...prev, heading: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Corps de texte</Label>
                <select
                  value={fonts.body}
                  onChange={(e) => setFonts(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Aperçu</Label>
            <Card
              className="overflow-hidden"
              style={{ backgroundColor: colors.background }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {logo && (
                    <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                  )}
                  <h3
                    className="text-lg font-bold"
                    style={{ color: colors.primary, fontFamily: fonts.heading }}
                  >
                    {themeName || 'Titre de la présentation'}
                  </h3>
                </div>
                <p
                  className="text-sm mb-2"
                  style={{ color: colors.text, fontFamily: fonts.body }}
                >
                  Voici un exemple de texte avec votre charte graphique.
                </p>
                <div className="flex gap-2">
                  <span
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Principal
                  </span>
                  <span
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    Secondaire
                  </span>
                  <span
                    className="px-2 py-1 rounded text-xs text-white"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Accent
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTheme} className="gap-2">
              <Palette className="w-4 h-4" />
              Créer le thème
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
