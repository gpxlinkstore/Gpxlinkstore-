"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Copy } from "lucide-react"
import type { Movie, DownloadLink } from "@/lib/movie-storage"
import { movieStorage } from "@/lib/movie-storage"
import { useToast } from "@/hooks/use-toast"
import { UrlGenerator } from "@/components/url-generator"

interface MovieFormProps {
  movie?: Movie
  onSave: (movie: Movie) => void
  onCancel: () => void
}

export function MovieForm({ movie, onSave, onCancel }: MovieFormProps) {
  const [title, setTitle] = useState(movie?.title || "")
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>(
    movie?.downloadLinks || [{ id: "", quality: "720p", fileSize: "", url: "" }],
  )
  const [customUrl, setCustomUrl] = useState(movie?.uniqueUrl || "")
  const [watchUrl, setWatchUrl] = useState<string>(movie?.watchUrl || "")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addDownloadLink = () => {
    setDownloadLinks([...downloadLinks, { id: "", quality: "720p", fileSize: "", url: "" }])
  }

  const removeDownloadLink = (index: number) => {
    if (downloadLinks.length > 1) {
      setDownloadLinks(downloadLinks.filter((_, i) => i !== index))
    }
  }

  const updateDownloadLink = (index: number, field: keyof DownloadLink, value: string) => {
    const updated = downloadLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    setDownloadLinks(updated)
  }

  const copyMovieUrl = (movieUrl: string) => {
    const fullUrl = `${window.location.origin}/movie/${movieUrl}`
    navigator.clipboard.writeText(fullUrl)
    toast({
      title: "URL Copied",
      description: "Movie URL has been copied to clipboard",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const trimmedWatch = watchUrl.trim()
      if (trimmedWatch && !/^https?:\/\//i.test(trimmedWatch)) {
        toast({
          title: "Invalid Watch URL",
          description: "Please enter a valid URL starting with http:// or https://",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const movieData = {
        title: title.trim(),
        downloadLinks: downloadLinks.filter((link) => link.url.trim()),
        watchUrl: trimmedWatch || undefined,
      }

      let savedMovie: Movie | null
      if (movie) {
        savedMovie = await movieStorage.updateMovie(movie.id, { ...movieData, uniqueUrl: customUrl })
      } else {
        savedMovie = await movieStorage.addMovie({ ...movieData, uniqueUrl: customUrl })
      }

      if (!savedMovie) {
        throw new Error("Failed to save movie")
      }

      toast({
        title: movie ? "Movie updated" : "Movie added",
        description: `${savedMovie.title} has been ${movie ? "updated" : "added"} successfully`,
      })

      onSave(savedMovie)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save movie",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{movie ? "Edit Movie" : "Add New Movie"}</CardTitle>
          {movie && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current URL:</span>
              <code className="bg-muted px-2 py-1 rounded text-sm">/movie/{movie.uniqueUrl}</code>
              <Button variant="outline" size="sm" onClick={() => copyMovieUrl(movie.uniqueUrl)} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Movie Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="watchUrl">Watch URL (optional)</Label>
              <Input
                id="watchUrl"
                value={watchUrl}
                onChange={(e) => setWatchUrl(e.target.value)}
                placeholder="https://your-watch-host.example/watch"
                inputMode="url"
                pattern="https?://.*"
              />
              <p className="text-xs text-muted-foreground">Leave empty to hide the Watch button.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Download Links *</Label>
                <Button type="button" onClick={addDownloadLink} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
              {downloadLinks.map((link, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Quality</Label>
                      <Select
                        value={link.quality}
                        onValueChange={(value) => updateDownloadLink(index, "quality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="720p">720p</SelectItem>
                          <SelectItem value="1080p">1080p</SelectItem>
                          <SelectItem value="4K">4K</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>File Size</Label>
                      <Input
                        value={link.fileSize}
                        onChange={(e) => updateDownloadLink(index, "fileSize", e.target.value)}
                        placeholder="1.2 GB"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Download URL</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateDownloadLink(index, "url", e.target.value)}
                        placeholder="https://example.com/download"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDownloadLink(index)}
                        disabled={downloadLinks.length === 1}
                        className="w-full"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : movie ? "Update Movie" : "Add Movie"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {title && (
        <div className="w-full max-w-4xl mx-auto">
          <UrlGenerator title={title} currentUrl={customUrl} onUrlGenerated={setCustomUrl} />
        </div>
      )}
    </div>
  )
}
