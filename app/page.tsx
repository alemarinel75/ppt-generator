'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Upload, Sparkles, Presentation, ArrowRight, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/supabase/auth-context'

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Presentation className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">PPT Generator</span>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-md" />
            ) : user ? (
              <Link href="/dashboard">
                <Button>
                  Mon tableau de bord
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer un compte
                  </Button>
                </Link>
              </>
            )}
          </div>
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
          <Link href={user ? "/editor?mode=import" : "/auth/login?redirectTo=/editor?mode=import"} className="block">
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

          {/* Option 2: Créer avec l'IA */}
          <Link href={user ? "/editor?mode=ai" : "/auth/login?redirectTo=/editor?mode=ai"} className="block">
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-purple-300 cursor-pointer group">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Créer avec l&apos;IA</CardTitle>
                <CardDescription>
                  Générez une présentation à partir d&apos;un sujet
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Décrivez votre sujet</li>
                  <li>L&apos;IA génère le contenu</li>
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

        {/* Features */}
        {!user && (
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Créez un compte gratuit pour sauvegarder vos présentations et chartes graphiques
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Sauvegarde cloud
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Chartes illimitées
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                100% gratuit
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>PPT Generator - Rendez vos présentations professionnelles</p>
      </footer>
    </div>
  )
}
