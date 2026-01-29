export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brand_guidelines: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          colors: Json
          fonts: Json
          logo_url: string | null
          style_preset: string
          border_radius: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          colors: Json
          fonts: Json
          logo_url?: string | null
          style_preset?: string
          border_radius?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          colors?: Json
          fonts?: Json
          logo_url?: string | null
          style_preset?: string
          border_radius?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      presentations: {
        Row: {
          id: string
          user_id: string
          title: string
          brand_guideline_id: string | null
          slides: Json
          style: string
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          brand_guideline_id?: string | null
          slides: Json
          style?: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          brand_guideline_id?: string | null
          slides?: Json
          style?: string
          thumbnail_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type BrandGuideline = Database['public']['Tables']['brand_guidelines']['Row']
export type Presentation = Database['public']['Tables']['presentations']['Row']
