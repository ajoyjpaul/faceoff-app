import { ref, computed } from 'vue'
import type { Player } from '../types/player'

export function usePlayerComparison() {
  const selectedPlayers = ref<(Player | string)[]>(['', ''])
  const bestStats = ref<Record<string, number>>({})

  const selectedPlayersData = computed(() => {
    return selectedPlayers.value.filter((player): player is Player => 
      typeof player === 'object' && player !== null
    )
  })

  const parseTimeToMinutes = (toi: string): number => {
    if (!toi || typeof toi !== 'string') return 0
    
    const cleanToi = toi.replace(/[^\d:]/g, '')
    const parts = cleanToi.split(':')
    
    if (parts.length >= 2) {
      const minutes = parseInt(parts[0]) || 0
      const seconds = parseInt(parts[1]) || 0
      return minutes + (seconds / 60)
    }
    
    return 0
  }

  const calculateBestStats = () => {
    const players = selectedPlayersData.value
    if (players.length === 0) return

    const newBestStats: Record<string, number> = {}

    const higherIsBetter = ['gp', 'goals', 'assists', 'points', 'shots']
    higherIsBetter.forEach(stat => {
      const values = players.map(player => player[stat as keyof Player] as number)
      newBestStats[stat] = Math.max(...values)
    })

    const scoutingValues = players.map(player => player.scouting_grade)
    newBestStats['scouting_grade'] = Math.min(...scoutingValues)

    const toiValues = players.map(player => parseTimeToMinutes(player.toi))
    newBestStats['toi'] = Math.max(...toiValues)

    bestStats.value = newBestStats
  }

  const isBestStat = (statName: string, value: number): boolean => {
    return selectedPlayersData.value.length > 1 && bestStats.value[statName] === value
  }

  const addPlayer = (availablePlayersCount: number) => {
    if (availablePlayersCount > 0) {
      selectedPlayers.value.push('')
    }
  }

  const removePlayer = (index: number) => {
    selectedPlayers.value.splice(index, 1)
    calculateBestStats()
  }

  return {
    selectedPlayers,
    selectedPlayersData,
    bestStats,
    parseTimeToMinutes,
    calculateBestStats,
    isBestStat,
    addPlayer,
    removePlayer
  }
}