export interface Player {
  season: number
  player_name: string
  team: string
  gp: number
  toi: string
  shots: number
  goals: number
  assists: number
  points: number
  scouting_grade: number
}

export interface PlayerStats {
  gp: number
  goals: number
  assists: number
  points: number
  shots: number
  toi: string
  scouting_grade: number
}

export type StatKey = keyof PlayerStats