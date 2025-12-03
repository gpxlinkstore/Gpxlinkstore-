"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus, Search, Copy, Download } from "lucide-react"
import type { Movie } from "@/lib/movie-storage"
import { movieStorage } from "@/lib/movie-storage"
import { useToast } from "@/hooks/use-toast"

interface MovieListProps {
  onAddMovie: () => void
  onEditMovie: (movie: Movie) => void
}

export function MovieList({ onAddMovie, onEditMovie }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadMovies()
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        try {
          const filtered = await movieStorage.searchMovies(searchQuery)
          setFilteredMovies(Array.isArray(filtered) ? filtered : [])
        } catch (error) {
          console.error("Search error:", error)
          setFilteredMovies([])
        }
      } else {
        setFilteredMovies(Array.isArray(movies) ? movies : [])
      }
    }
    performSearch()
  }, [searchQuery, movies])

  const loadMovies = async () => {
    setIsLoading(true)
    try {
      const allMovies = await movieStorage.getMovies()
      setMovies(Array.isArray(allMovies) ? allMovies : [])
    } catch (error) {
      console.error("Load movies error:", error)
      setMovies([])
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (movie: Movie) => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      const success = await movieStorage.deleteMovie(movie.id)
      if (success) {
        toast({
          title: "Movie deleted",
          description: `${movie.title} has been deleted successfully`,
        })
        loadMovies()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete movie",
          variant: "destructive",
        })
      }
    }
  }

  const copyMovieUrl = (movieUrl: string) => {
    const fullUrl = `${window.location.origin}/movie/${movieUrl}`
    navigator.clipboard.writeText(fullUrl)
    toast({
      title: "URL Copied",
      description: "Movie URL has been copied to clipboard",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-2xl font-bold">Loading Movies...</h2>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading movies from database...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const safeFilteredMovies = Array.isArray(filteredMovies) ? filteredMovies : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold">Movies ({safeFilteredMovies.length})</h2>
        <Button onClick={onAddMovie} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Movie
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {safeFilteredMovies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-muted-foreground text-center">
              {searchQuery ? "No movies found matching your search." : "No movies added yet."}
            </div>
            {!searchQuery && (
              <Button onClick={onAddMovie} className="mt-4">
                Add Your First Movie
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeFilteredMovies.map((movie) => (
            <Card key={movie.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{movie.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>{Array.isArray(movie.downloadLinks) ? movie.downloadLinks.length : 0} download links</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>URL:</span>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs flex-1 truncate">/movie/{movie.uniqueUrl}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyMovieUrl(movie.uniqueUrl)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onEditMovie(movie)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(movie)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
