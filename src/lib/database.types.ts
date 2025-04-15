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
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_rating: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_rating: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_rating?: number
          note?: string | null
          created_at?: string
        }
      }
    }
  }
}