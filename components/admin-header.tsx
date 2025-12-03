"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import { adminAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  onLogout: () => void
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const { toast } = useToast()

  const handleLogout = () => {
    adminAuth.logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    onLogout()
  }

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Saathi Download Admin</h1>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
