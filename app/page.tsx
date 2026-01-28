'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Upload, Sparkles, Presentation, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2">
          <Presentation className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold">PPT Generator</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Des présentations
            <span className="text-blue-600"> professionnelles</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Transformez vos documents en présentations aux couleurs de votre marque
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Option 1: Améliorer un document */}
          <Link href="/editor?mode=import" className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer group">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Améliorer un document</CardTitle>
                <CardDescription>
                  Uploadez un PPT existant et transformez-le
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Importez votre .pptx</li>
                  <li>Choisissez votre charte graphique</li>
                  <li>Exportez en un clic</li>
                </ul>
                <Button className="w-full group-hover:bg-blue-700">
                  Importer un fichier
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Option 2: Créer avec l&apos;IA */}
          <Link href="/editor?mode=ai" className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-purple-300 cursor-pointer group">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Créer avec l&apos;IA</CardTitle>
                <CardDescription>
                  Générez une présentation à partir d'un sujet
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Décrivez votre sujet</li>
                  <li>L'IA génère le contenu</li>
                  <li>Personnalisez et exportez</li>
                </ul>
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 group-hover:border-purple-400">
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>PPT Generator - Rendez vos présentations professionnelles</p>
      </footer>
    </div>
  )
}
