"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminHeader } from "@/components/admin-header"
import { MovieList } from "@/components/movie-list"
import { MovieForm } from "@/components/movie-form"
import { adminAuth } from "@/lib/auth"
import type { Movie } from "@/lib/movie-storage"

type View = "list" | "add" | "edit"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>("list")
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = adminAuth.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView("list")
    setEditingMovie(null)
  }

  const handleAddMovie = () => {
    setEditingMovie(null)
    setCurrentView("add")
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
    setCurrentView("edit")
  }

  const handleSaveMovie = () => {
    setCurrentView("list")
    setEditingMovie(null)
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingMovie(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {currentView === "list" && <MovieList onAddMovie={handleAddMovie} onEditMovie={handleEditMovie} />}
          {(currentView === "add" || currentView === "edit") && (
            <MovieForm movie={editingMovie} onSave={handleSaveMovie} onCancel={handleCancel} />
          )}
        </div>
      </main>
    </div>
  )
}
