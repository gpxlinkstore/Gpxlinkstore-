import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ezipvaassdfszrunbzaz.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aXB2YWFzc2Rmc3pydW5iemF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MDMzNTcsImV4cCI6MjA3MjQ3OTM1N30.T04TQRulybr-BaFkpx4IPJxLDQohtQtghdRK5brlF3I"

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
