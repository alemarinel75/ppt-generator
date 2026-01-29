'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/supabase/auth-context'
import { createClient } from '@/lib/supabase/client'
import { BrandGuideline, Presentation } from '@/types/database'
import {
  Sparkles,
  Upload,
  Palette,
  FileText,
  Plus,
  LogOut,
  Loader2,
  Trash2,
} from 'lucide-react'

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth()
  const router = useRouter()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuideline[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    // Load presentations
    const { data: presentationsData } = await supabase
      .from('presentations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (presentationsData) {
      setPresentations(presentationsData)
    }

    // Load brand guidelines
    const { data: guidelinesData } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (guidelinesData) {
      setBrandGuidelines(guidelinesData)
    }

    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, loadData])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleDeletePresentation = async (id: string) => {
    if (!confirm('Supprimer cette présentation ?')) return

    await supabase.from('presentations').delete().eq('id', id)
    setPresentations(presentations.filter(p => p.id !== id))
  }

  const handleDeleteGuideline = async (id: string) => {
    if (!confirm('Supprimer cette charte graphique ?')) return

    await supabase.from('brand_guidelines').delete().eq('id', id)
    setBrandGuidelines(brandGuidelines.filter(g => g.id !== id))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">PPT Generator</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/editor?mode=ai">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Créer avec l&apos;IA</h3>
                  <p className="text-sm text-gray-500">Générer une nouvelle présentation</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/editor?mode=import">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Importer</h3>
                  <p className="text-sm text-gray-500">Améliorer un document existant</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/brand-guidelines/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Nouvelle charte</h3>
                  <p className="text-sm text-gray-500">Créer une charte graphique</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Brand Guidelines */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Mes chartes graphiques
            </h2>
            <Link href="/brand-guidelines/new">
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : brandGuidelines.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Palette className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Aucune charte graphique</p>
                <Link href="/brand-guidelines/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer ma première charte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {brandGuidelines.map((guideline) => {
                const colors = guideline.colors as { primary?: string; secondary?: string; accent?: string }
                return (
                  <Card key={guideline.id} className="group relative">
                    <CardHeader className="pb-2">
                      <div className="flex gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: colors.primary || '#3b82f6' }}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: colors.secondary || '#8b5cf6' }}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: colors.accent || '#f59e0b' }}
                        />
                      </div>
                      <CardTitle className="text-base">{guideline.name}</CardTitle>
                      {guideline.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Par défaut
                        </span>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        {guideline.style_preset || 'Corporate'}
                      </p>
                    </CardContent>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteGuideline(guideline.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* Presentations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mes présentations
            </h2>
            <Link href="/editor?mode=ai">
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : presentations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Aucune présentation</p>
                <Link href="/editor?mode=ai">
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Créer ma première présentation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentations.map((presentation) => {
                const slides = presentation.slides as unknown[]
                return (
                  <Card key={presentation.id} className="group relative hover:shadow-lg transition-shadow">
                    <Link href={`/editor?id=${presentation.id}`}>
                      <CardHeader>
                        <CardTitle className="text-base">{presentation.title}</CardTitle>
                        <CardDescription>
                          {slides?.length || 0} slides • {presentation.style || 'Corporate'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-gray-400">
                          Modifié le {new Date(presentation.updated_at).toLocaleDateString('fr-FR')}
                        </p>
                      </CardContent>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeletePresentation(presentation.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
