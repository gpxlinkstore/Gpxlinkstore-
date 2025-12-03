import { supabase } from "./supabase"

export interface DownloadLink {
  id: string
  quality: "480p" | "720p" | "1080p" | "4K"
  fileSize: string
  url: string
  order?: number
}

export interface Movie {
  id: string
  title: string
  downloadLinks: DownloadLink[]
  createdAt: string
  uniqueUrl: string
  watchUrl?: string
}

class MovieStorage {
  private generateUniqueUrl(title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
    const randomId = Math.random().toString(36).substring(2, 8)
    return `${slug}-${randomId}`
  }

  async getMovies(): Promise<Movie[]> {
    try {
      const { data: movies, error } = await supabase
        .from("movies")
        .select(`
          id,
          title,
          url,
          created_at,
          watch_url,
          download_links (
            id,
            url,
            quality,
            size,
            link_order
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        movies?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          uniqueUrl: movie.url,
          createdAt: movie.created_at,
          watchUrl: movie.watch_url || undefined,
          downloadLinks:
            movie.download_links
              ?.sort((a: any, b: any) => (a.link_order || 0) - (b.link_order || 0))
              .map((link: any) => ({
                id: link.id,
                quality: link.quality,
                fileSize: link.size,
                url: link.url,
                order: link.link_order,
              })) || [],
        })) || []
      )
    } catch (error) {
      console.error("Error fetching movies:", error)
      return []
    }
  }

  async getMovieByUrl(uniqueUrl: string): Promise<Movie | null> {
    try {
      const { data: movie, error } = await supabase
        .from("movies")
        .select(`
          id,
          title,
          url,
          created_at,
          watch_url,
          download_links (
            id,
            url,
            quality,
            size,
            link_order
          )
        `)
        .eq("url", uniqueUrl)
        .single()

      if (error) throw error

      return movie
        ? {
            id: movie.id,
            title: movie.title,
            uniqueUrl: movie.url,
            createdAt: movie.created_at,
            watchUrl: movie.watch_url || undefined,
            downloadLinks:
              movie.download_links
                ?.sort((a: any, b: any) => (a.link_order || 0) - (b.link_order || 0))
                .map((link: any) => ({
                  id: link.id,
                  quality: link.quality,
                  fileSize: link.size,
                  url: link.url,
                  order: link.link_order,
                })) || [],
          }
        : null
    } catch (error) {
      console.error("Error fetching movie by URL:", error)
      return null
    }
  }

  async getMovieById(id: string): Promise<Movie | null> {
    try {
      const { data: movie, error } = await supabase
        .from("movies")
        .select(`
          id,
          title,
          url,
          created_at,
          watch_url,
          download_links (
            id,
            url,
            quality,
            size,
            link_order
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      return movie
        ? {
            id: movie.id,
            title: movie.title,
            uniqueUrl: movie.url,
            createdAt: movie.created_at,
            watchUrl: movie.watch_url || undefined,
            downloadLinks:
              movie.download_links
                ?.sort((a: any, b: any) => (a.link_order || 0) - (b.link_order || 0))
                .map((link: any) => ({
                  id: link.id,
                  quality: link.quality,
                  fileSize: link.size,
                  url: link.url,
                  order: link.link_order,
                })) || [],
          }
        : null
    } catch (error) {
      console.error("Error fetching movie by ID:", error)
      return null
    }
  }

  async addMovie(movieData: Omit<Movie, "id" | "createdAt"> & { uniqueUrl?: string }): Promise<Movie | null> {
    try {
      const uniqueUrl = movieData.uniqueUrl || this.generateUniqueUrl(movieData.title)

      // Insert movie
      const { data: movie, error: movieError } = await supabase
        .from("movies")
        .insert({
          title: movieData.title,
          url: uniqueUrl,
          watch_url: movieData.watchUrl || null,
        })
        .select()
        .single()

      if (movieError) throw movieError

      // Insert download links
      if (movieData.downloadLinks.length > 0) {
        const { error: linksError } = await supabase.from("download_links").insert(
          movieData.downloadLinks.map((link, index) => ({
            movie_id: movie.id,
            url: link.url,
            quality: link.quality,
            size: link.fileSize,
            link_order: index,
          })),
        )

        if (linksError) throw linksError
      }

      return {
        id: movie.id,
        title: movie.title,
        uniqueUrl: movie.url,
        createdAt: movie.created_at,
        watchUrl: movie.watch_url || undefined,
        downloadLinks: movieData.downloadLinks,
      }
    } catch (error) {
      console.error("Error adding movie:", error)
      return null
    }
  }

  async updateMovie(id: string, movieData: Partial<Omit<Movie, "id" | "createdAt">>): Promise<Movie | null> {
    try {
      // Update movie
      const { data: movie, error: movieError } = await supabase
        .from("movies")
        .update({
          title: movieData.title,
          url: movieData.uniqueUrl,
          watch_url: movieData.watchUrl,
        })
        .eq("id", id)
        .select()
        .single()

      if (movieError) throw movieError

      // Update download links if provided
      if (movieData.downloadLinks) {
        // Delete existing links
        await supabase.from("download_links").delete().eq("movie_id", id)

        // Insert new links
        if (movieData.downloadLinks.length > 0) {
          const { error: linksError } = await supabase.from("download_links").insert(
            movieData.downloadLinks.map((link, index) => ({
              movie_id: id,
              url: link.url,
              quality: link.quality,
              size: link.fileSize,
              link_order: index,
            })),
          )

          if (linksError) throw linksError
        }
      }

      return await this.getMovieById(id)
    } catch (error) {
      console.error("Error updating movie:", error)
      return null
    }
  }

  async deleteMovie(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("movies").delete().eq("id", id)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting movie:", error)
      return false
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const { data: movies, error } = await supabase
        .from("movies")
        .select(`
          id,
          title,
          url,
          created_at,
          watch_url,
          download_links (
            id,
            url,
            quality,
            size,
            link_order
          )
        `)
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false })

      if (error) throw error

      return (
        movies?.map((movie) => ({
          id: movie.id,
          title: movie.title,
          uniqueUrl: movie.url,
          createdAt: movie.created_at,
          watchUrl: movie.watch_url || undefined,
          downloadLinks:
            movie.download_links
              ?.sort((a: any, b: any) => (a.link_order || 0) - (b.link_order || 0))
              .map((link: any) => ({
                id: link.id,
                quality: link.quality,
                fileSize: link.size,
                url: link.url,
                order: link.link_order,
              })) || [],
        })) || []
      )
    } catch (error) {
      console.error("Error searching movies:", error)
      return []
    }
  }

  async isUrlUnique(url: string, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase.from("movies").select("id").eq("url", url)

      if (excludeId) {
        query = query.neq("id", excludeId)
      }

      const { data, error } = await query

      if (error) throw error
      return !data || data.length === 0
    } catch (error) {
      console.error("Error checking URL uniqueness:", error)
      return false
    }
  }
}

export const movieStorage = new MovieStorage()
