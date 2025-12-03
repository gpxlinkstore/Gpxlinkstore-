import { supabase } from "./supabase"

class AdminAuth {
  private sessionKey = "admin-session"
  private defaultPassword = "ankit07" // Fallback password

  async getAdminPassword(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("setting_value")
        .eq("setting_key", "admin_password")
        .single()

      if (error) {
        console.error("Error fetching admin password:", error)
        return this.defaultPassword
      }

      return data?.setting_value || this.defaultPassword
    } catch (error) {
      console.error("Error in getAdminPassword:", error)
      return this.defaultPassword
    }
  }

  async setAdminPassword(password: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("admin_settings").upsert({
        setting_key: "admin_password",
        setting_value: password,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error updating admin password:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error in setAdminPassword:", error)
      return false
    }
  }

  async login(password: string): Promise<boolean> {
    const adminPassword = await this.getAdminPassword()
    if (password === adminPassword) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(this.sessionKey, "authenticated")
      }
      return true
    }
    return false
  }

  logout(): void {
    if (typeof window === "undefined") return
    sessionStorage.removeItem(this.sessionKey)
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return sessionStorage.getItem(this.sessionKey) === "authenticated"
  }
}

export const adminAuth = new AdminAuth()
