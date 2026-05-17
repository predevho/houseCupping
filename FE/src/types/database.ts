export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          email: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          email?: string | null
          created_at?: string
        }
        Update: {
          username?: string
          display_name?: string
        }
        Relationships: []
      }
      beans: {
        Row: {
          id: number
          user_id: string | null
          cafe_name: string
          bean_name: string
          origin: string | null
          variety: string | null
          process: string | null
          roast_level: string | null
          image_path: string | null
          altitude: number | null
          farm_name: string | null
          harvest_year: number | null
          flavor_descriptors: string[] | null
          roastery_memo: string | null
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string | null
          cafe_name: string
          bean_name: string
          origin?: string | null
          variety?: string | null
          process?: string | null
          roast_level?: string | null
          image_path?: string | null
          altitude?: number | null
          farm_name?: string | null
          harvest_year?: number | null
          flavor_descriptors?: string[] | null
          roastery_memo?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['beans']['Insert']>
        Relationships: []
      }
      cupping_notes: {
        Row: {
          id: number
          user_id: string
          bean_id: number
          roast_date: string | null
          aroma: number
          acidity: number
          body: number
          memo: string | null
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          bean_id: number
          roast_date?: string | null
          aroma: number
          acidity: number
          body: number
          memo?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['cupping_notes']['Insert']>
        Relationships: []
      }
      bean_ratings: {
        Row: {
          id: number
          user_id: string
          bean_id: number
          score: number
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          bean_id: number
          score: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['bean_ratings']['Insert']>
        Relationships: []
      }
      likes: {
        Row: {
          id: number
          user_id: string
          note_id: number
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          note_id: number
          created_at?: string
        }
        Update: never
        Relationships: []
      }
      comments: {
        Row: {
          id: number
          user_id: string
          note_id: number
          content: string
          created_at: string
        }
        Insert: {
          id?: never
          user_id: string
          note_id: number
          content: string
          created_at?: string
        }
        Update: { content: string }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
