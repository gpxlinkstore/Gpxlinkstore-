import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vstgfxvsixlkrspipigz.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdGdmeHZzaXhsa3JzcGlwaWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDM1MTksImV4cCI6MjA4MDMxOTUxOX0.PXnGnhPp8TGr6IS-BooYMxyV5aQ2xxxA3GqqWaxwSO8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Movie = {
  id: string
  title: string
  url: string
  download_links: DownloadLink[]
  created_at: string
}

export type DownloadLink = {
  id: string
  url: string
  quality: string
  size: string
}
