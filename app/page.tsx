"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Saathi Download</h1>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">Saathi Download Portal</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Access movies through direct links. Contact admin for movie access.
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center space-y-4">
                <p>Movies are managed through the admin panel.</p>
                <p>Use direct movie links to access content.</p>
              </div>
              <Link href="/admin">
                <Button className="mt-4">Admin Panel</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
