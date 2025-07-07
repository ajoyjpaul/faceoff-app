import { computed, ref, onMounted } from 'vue'
import type { Player } from '../types/player'
import { playerService } from '../services/playerService'

export function usePlayerData() {
  const playerData = ref<Player[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const loadPlayers = async () => {
    try {
      isLoading.value = true
      error.value = null
      playerData.value = await playerService.getPlayers()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load players'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadPlayers)

  const allPlayersGrouped = computed(() => {
    const grouped: Record<number, Player[]> = {}
    
    playerData.value.forEach((player: Player) => {
      if (!grouped[player.season]) {
        grouped[player.season] = []
      }
      grouped[player.season].push(player)
    })

    Object.keys(grouped).forEach(season => {
      grouped[Number(season)].sort((a, b) => a.player_name.localeCompare(b.player_name))
    })

    const sortedGrouped: Record<number, Player[]> = {}
    Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a)
      .forEach(season => {
        sortedGrouped[season] = grouped[season]
      })

    return sortedGrouped
  })

  const getSelectedPlayerKeys = (selectedPlayersData: Player[]) => {
    return selectedPlayersData.map(player => `${player.season}-${player.player_name}`)
  }

  const getAvailablePlayersBySeason = (
    currentIndex: number, 
    selectedPlayers: (Player | string)[], 
    selectedPlayersData: Player[]
  ) => {
    const selectedKeys = getSelectedPlayerKeys(selectedPlayersData)
    const currentPlayer = selectedPlayers[currentIndex]
    const currentKey = typeof currentPlayer === 'object' && currentPlayer !== null 
      ? `${currentPlayer.season}-${currentPlayer.player_name}` 
      : null

    const availableGrouped: Record<number, Player[]> = {}

    Object.entries(allPlayersGrouped.value).forEach(([season, players]) => {
      const availablePlayers = players.filter(player => {
        const playerKey = `${player.season}-${player.player_name}`
        return !selectedKeys.includes(playerKey) || playerKey === currentKey
      })
      
      if (availablePlayers.length > 0) {
        availableGrouped[Number(season)] = availablePlayers
      }
    })

    return availableGrouped
  }

  const getAvailablePlayersCount = (selectedPlayersData: Player[]) => {
    const selectedKeys = getSelectedPlayerKeys(selectedPlayersData)
    return playerData.value.filter(player => {
      const playerKey = `${player.season}-${player.player_name}`
      return !selectedKeys.includes(playerKey)
    }).length
  }

  const getPlayerInitials = (name: string): string => {
    const parts = name.split(', ')
    if (parts.length === 2) {
      const lastName = parts[0]
      const firstName = parts[1]
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  return {
    allPlayersGrouped,
    getAvailablePlayersBySeason,
    getAvailablePlayersCount,
    getPlayerInitials,
    isLoading,
    error,
    loadPlayers
  }
}