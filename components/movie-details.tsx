"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, HardDrive, Play } from "lucide-react"
import type { Movie } from "@/lib/movie-storage"
import { movieStorage } from "@/lib/movie-storage"

interface MovieDetailsProps {
  slug: string
}

function AdBanner() {
  useEffect(() => {
    // Clear any existing ads first
    const existingAds = document.querySelectorAll("[data-ad-banner]")
    existingAds.forEach((ad) => ad.remove())

    // Create container for the ad
    const adContainer = document.createElement("div")
    adContainer.setAttribute("data-ad-banner", "true")
    adContainer.style.textAlign = "center"
    adContainer.style.margin = "20px 0"

    // Set global atOptions
    ;(window as any).atOptions = {
      key: "1593be64c9cfa40e367e2e9b58321257",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    }

    // Load the ad script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "//www.highperformanceformat.com/1593be64c9cfa40e367e2e9b58321257/invoke.js"
    script.async = true

    // Find the banner container and append
    const bannerElement = document.querySelector("[data-banner-container]")
    if (bannerElement) {
      bannerElement.appendChild(adContainer)
      adContainer.appendChild(script)
    }

    return () => {
      // Cleanup
      const ads = document.querySelectorAll("[data-ad-banner]")
      ads.forEach((ad) => ad.remove())
    }
  }, [])

  return <div data-banner-container className="flex justify-center my-4 min-h-[60px]" />
}

function SocialBarAd() {
  useEffect(() => {
    const loadSocialBarAd = () => {
      // Remove any existing social bar scripts
      const existingScripts = document.querySelectorAll('script[src*="pl27645507.revenuecpmgate.com"]')
      existingScripts.forEach((script) => script.remove())

      const script = document.createElement("script")
      script.type = "text/javascript"
      script.src = "//pl27645507.revenuecpmgate.com/c9/6e/bf/c96ebf53e20dd675e959923dd4d193f9.js"
      script.async = true

      // Add error handling
      script.onerror = () => {
        console.log("[v0] Social bar ad failed to load")
      }

      script.onload = () => {
        console.log("[v0] Social bar ad loaded successfully")
      }

      // Add to document body instead of head for better visibility
      document.body.appendChild(script)
    }

    // Load with a small delay to ensure DOM is ready
    const timer = setTimeout(loadSocialBarAd, 1000)

    return () => {
      clearTimeout(timer)
      // Cleanup on unmount
      const scripts = document.querySelectorAll('script[src*="pl27645507.revenuecpmgate.com"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  return <div id="social-bar-ad-container" className="fixed bottom-0 left-0 right-0 z-50" />
}

function BottomBannerAd() {
  useEffect(() => {
    // Clear any existing bottom ads first
    const existingAds = document.querySelectorAll("[data-bottom-ad-banner]")
    existingAds.forEach((ad) => ad.remove())

    // Create container for the ad
    const adContainer = document.createElement("div")
    adContainer.setAttribute("data-bottom-ad-banner", "true")
    adContainer.style.textAlign = "center"
    adContainer.style.margin = "20px 0"

    // Set global atOptions for bottom banner
    ;(window as any).atOptions = {
      key: "2e2ea0a341909040d3232c876298c9fc",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    }

    // Load the ad script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "//www.highperformanceformat.com/2e2ea0a341909040d3232c876298c9fc/invoke.js"
    script.async = true

    // Find the bottom banner container and append
    const bannerElement = document.querySelector("[data-bottom-banner-container]")
    if (bannerElement) {
      bannerElement.appendChild(adContainer)
      adContainer.appendChild(script)
    }

    return () => {
      // Cleanup
      const ads = document.querySelectorAll("[data-bottom-ad-banner]")
      ads.forEach((ad) => ad.remove())
    }
  }, [])

  return <div data-bottom-banner-container className="flex justify-center my-6 min-h-[260px]" />
}

function MiddleBannerAd() {
  useEffect(() => {
    // Clear any existing middle ads first
    const existingAds = document.querySelectorAll("[data-middle-ad-banner]")
    existingAds.forEach((ad) => ad.remove())

    // Create container for the ad
    const adContainer = document.createElement("div")
    adContainer.setAttribute("data-middle-ad-banner", "true")
    adContainer.style.textAlign = "center"
    adContainer.style.margin = "20px 0"

    // Set global atOptions for middle banner
    ;(window as any).atOptions = {
      key: "1593be64c9cfa40e367e2e9b58321257",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    }

    // Load the ad script
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "//www.highperformanceformat.com/1593be64c9cfa40e367e2e9b58321257/invoke.js"
    script.async = true

    // Find the middle banner container and append
    const bannerElement = document.querySelector("[data-middle-banner-container]")
    if (bannerElement) {
      bannerElement.appendChild(adContainer)
      adContainer.appendChild(script)
    }

    return () => {
      // Cleanup
      const ads = document.querySelectorAll("[data-middle-ad-banner]")
      ads.forEach((ad) => ad.remove())
    }
  }, [])

  return <div data-middle-banner-container className="flex justify-center my-4 min-h-[60px]" />
}

export function MovieDetails({ slug }: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const foundMovie = await movieStorage.getMovieByUrl(slug)
        setMovie(foundMovie)
      } catch (error) {
        console.error("Error loading movie:", error)
        setMovie(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadMovie()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!movie) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <SocialBarAd />

      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Movie Title */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-balance">{movie.title}</h1>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>{movie.downloadLinks.length} download options available</span>
              </div>
            </div>

            <AdBanner />
            <MiddleBannerAd />

            {movie.watchUrl && (
              <div className="flex justify-center my-2">
                <Button
                  asChild
                  className="bg-[var(--watch-accent)] text-black hover:brightness-95 focus-visible:ring-[var(--watch-accent)] motion-safe:animate-pulse motion-reduce:animate-none"
                >
                  <a
                    href={movie.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch online: ${movie.title}`}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </a>
                </Button>
              </div>
            )}

            {/* Download Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movie.downloadLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Button asChild className="flex-shrink-0 w-full sm:w-auto">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-foreground"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                      <div className="flex flex-wrap items-center gap-3 min-w-0">
                        <Badge variant="outline" className="font-mono flex-shrink-0">
                          {link.quality}
                        </Badge>
                        {link.fileSize && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                            <HardDrive className="h-4 w-4 flex-shrink-0" />
                            <span className="break-all">{link.fileSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <BottomBannerAd />
          </div>
        </div>
      </main>
    </div>
  )
}
