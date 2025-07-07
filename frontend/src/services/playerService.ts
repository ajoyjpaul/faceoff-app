import type { Player } from '../types/player'

const API_BASE_URL = "http://localhost:3000/api"

export const playerService = {
  async getPlayers(): Promise<Player[]> {
    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch players: ${response.status}`)
      }

      const data = await response.json()
      return data.players || []
    } catch (error) {
      console.error("Player service error:", error)
      throw error
    }
  }
}