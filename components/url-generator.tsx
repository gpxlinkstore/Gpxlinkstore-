"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UrlGeneratorProps {
  title: string
  onUrlGenerated: (url: string) => void
  currentUrl?: string
}

export function UrlGenerator({ title, onUrlGenerated, currentUrl }: UrlGeneratorProps) {
  const [customUrl, setCustomUrl] = useState(currentUrl || "")
  const { toast } = useToast()

  const generateUrl = (movieTitle: string): string => {
    const slug = movieTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
    const randomId = Math.random().toString(36).substring(2, 8)
    return `${slug}-${randomId}`
  }

  const handleGenerateNew = () => {
    const newUrl = generateUrl(title)
    setCustomUrl(newUrl)
    onUrlGenerated(newUrl)
  }

  const handleCustomUrlChange = (value: string) => {
    // Sanitize the URL
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-|-$/g, "")

    setCustomUrl(sanitized)
    onUrlGenerated(sanitized)
  }

  const copyUrl = () => {
    const fullUrl = `${window.location.origin}/movie/${customUrl}`
    navigator.clipboard.writeText(fullUrl)
    toast({
      title: "URL Copied",
      description: "Movie URL has been copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Movie URL</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="movie-url">Custom URL Slug</Label>
          <div className="flex gap-2">
            <Input
              id="movie-url"
              value={customUrl}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              placeholder="movie-title-abc123"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateNew}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        {customUrl && (
          <div className="space-y-2">
            <Label>Full URL</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <code className="text-sm flex-1 truncate">
                {typeof window !== "undefined" ? window.location.origin : "https://yoursite.com"}/movie/{customUrl}
              </code>
              <Button variant="ghost" size="sm" onClick={copyUrl} className="h-8 w-8 p-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          The URL will be automatically generated from the movie title, but you can customize it here.
        </div>
      </CardContent>
    </Card>
  )
}
