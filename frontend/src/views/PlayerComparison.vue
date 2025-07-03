<template>
  <div class="page-wrapper overflow-auto">
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="content-container">
            <!-- Header with Logo and Title -->
            <div class="header-section mb-5">
              <div class="d-flex align-items-center">
                <img src="/penguins.svg" alt="Pittsburgh Penguins" class="penguins-logo me-3">
                <h1 class="page-title">Player Comparison</h1>
              </div>
            </div>
            
            <!-- Player Selection Controls -->
            <div class="selection-section mb-5">
              <div class="mb-4">
                <h3 class="selection-title">Compare Players</h3>
              </div>

              <!-- Player Selection Dropdowns -->
              <div class="player-selections">
                <div v-for="(player, index) in selectedPlayers" :key="`player-${index}`" class="player-selection-row mb-3">
                  <div class="d-flex align-items-center">
                    <div class="player-number">{{ index + 1 }}</div>
                    <select v-model="selectedPlayers[index]" class="form-select player-select flex-grow-1" @change="calculateBestStats">
                      <option value="">Select a player...</option>
                      <optgroup v-for="(seasonPlayers, season) in getAvailablePlayersBySeason(index)" :key="season" :label="`${season} Season`">
                        <option v-for="player in seasonPlayers" :key="`${player.season}-${player.player_name}`" :value="player">
                          {{ player.season }} {{ player.player_name }} ({{ player.team }})
                        </option>
                      </optgroup>
                    </select>
                    <button class="btn btn-outline-danger ms-2 remove-btn" @click="removePlayer(index)">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>

                <!-- Add Player Button -->
                <div class="d-flex align-items-center mt-4">
                  <div class="player-number-placeholder"></div>
                  <div class="add-button-container">
                    <button class="btn add-player-btn-rectangle" @click="addPlayer" :disabled="availablePlayers.length === 0" title="Add Player">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <div class="remove-button-placeholder"></div>
                </div>
              </div>
            </div>

            <!-- Player Cards Grid -->
            <div v-if="selectedPlayersData.length > 0" class="comparison-section">
              <div class="players-grid">
                <div v-for="(player, index) in selectedPlayersData" :key="`card-${index}`" class="player-card-wrapper">
                  <div class="player-card">
                    <div class="player-header">
                      <div class="player-avatar">
                        <span class="player-initials">{{ getPlayerInitials(player.player_name) }}</span>
                      </div>
                      <div class="player-info">
                        <h3 class="player-name">{{ player.player_name }}</h3>
                        <p class="player-season">{{ player.season }} Season - {{ player.team }}</p>
                      </div>
                    </div>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <span class="stat-label">Games Played</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('gp', player.gp) }">{{ player.gp }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Goals</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('goals', player.goals) }">{{ player.goals }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Assists</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('assists', player.assists) }">{{ player.assists }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Points</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('points', player.points) }">{{ player.points }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Shots</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('shots', player.shots) }">{{ player.shots }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">TOI</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('toi', parseTimeToMinutes(player.toi)) }">{{ player.toi }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Scouting Grade</span>
                        <span class="stat-value" :class="{ 'best-stat': isBestStat('scouting_grade', player.scouting_grade) }">{{ player.scouting_grade }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Comparison Table -->
              <div class="comparison-stats mt-5" v-if="selectedPlayersData.length > 1">
                <h3 class="section-title mb-4">Statistical Comparison</h3>
                <div class="comparison-table-wrapper">
                    <table class="comparison-table">
                    <thead>
                      <tr>
                        <th>Statistic</th>
                        <th v-for="(player, index) in selectedPlayersData" :key="`header-${index}`">
                          {{ player.season }} {{ player.player_name }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="stat-name">Games Played</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`gp-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('gp', player.gp) }">
                          {{ player.gp }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">Goals</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`goals-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('goals', player.goals) }">
                          {{ player.goals }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">Assists</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`assists-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('assists', player.assists) }">
                          {{ player.assists }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">Points</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`points-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('points', player.points) }">
                          {{ player.points }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">Shots</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`shots-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('shots', player.shots) }">
                          {{ player.shots }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">TOI</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`toi-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('toi', parseTimeToMinutes(player.toi)) }">
                          {{ player.toi }}
                        </td>
                      </tr>
                      <tr>
                        <td class="stat-name">Scouting Grade</td>
                        <td v-for="(player, index) in selectedPlayersData" :key="`scouting-${index}`" 
                            :class="{ 'best-stat-cell': isBestStat('scouting_grade', player.scouting_grade) }">
                          {{ player.scouting_grade }}
                        </td>
                      </tr>
                    </tbody>
                    </table>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <h3>Add players to compare their stats</h3>
              <p>Use the "Add Player" button above to start comparing players across different seasons.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to Home Button -->
    <button class="floating-home-button" @click="goHome">
      Back to Home
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import playerData from '../../../shared/data/player_data.json'

const router = useRouter()

interface Player {
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

const selectedPlayers = ref<(Player | string)[]>(['', ''])
const bestStats = ref<Record<string, number>>({})

const allPlayersGrouped = computed(() => {
  const grouped: Record<number, Player[]> = {}
  
  playerData.forEach((player: Player) => {
    if (!grouped[player.season]) {
      grouped[player.season] = []
    }
    grouped[player.season].push(player)
  })

  // Sort players within each season by name
  Object.keys(grouped).forEach(season => {
    grouped[Number(season)].sort((a, b) => a.player_name.localeCompare(b.player_name))
  })

  // Sort seasons in descending order (newest first)
  const sortedGrouped: Record<number, Player[]> = {}
  Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)
    .forEach(season => {
      sortedGrouped[season] = grouped[season]
    })

  return sortedGrouped
})

const getSelectedPlayerKeys = () => {
  return selectedPlayersData.value.map(player => `${player.season}-${player.player_name}`)
}

const getAvailablePlayersBySeason = (currentIndex: number) => {
  const selectedKeys = getSelectedPlayerKeys()
  const currentPlayer = selectedPlayers.value[currentIndex]
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

const availablePlayers = computed(() => {
  const selectedKeys = getSelectedPlayerKeys()
  return playerData.filter(player => {
    const playerKey = `${player.season}-${player.player_name}`
    return !selectedKeys.includes(playerKey)
  })
})

const selectedPlayersData = computed(() => {
  return selectedPlayers.value.filter((player): player is Player => 
    typeof player === 'object' && player !== null
  )
})

const addPlayer = () => {
  if (availablePlayers.value.length > 0) {
    selectedPlayers.value.push('')
  }
}

const removePlayer = (index: number) => {
  selectedPlayers.value.splice(index, 1)
  calculateBestStats()
}

const parseTimeToMinutes = (toi: string): number => {
  // Parse time formats like "612:32" or "1114:56" to total minutes
  if (!toi || typeof toi !== 'string') return 0
  
  const cleanToi = toi.replace(/[^\d:]/g, '') // Remove any non-digit, non-colon characters
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

  // Stats where higher is better
  const higherIsBetter = ['gp', 'goals', 'assists', 'points', 'shots']
  higherIsBetter.forEach(stat => {
    const values = players.map(player => player[stat as keyof Player] as number)
    newBestStats[stat] = Math.max(...values)
  })

  // Scouting grade - lower is better
  const scoutingValues = players.map(player => player.scouting_grade)
  newBestStats['scouting_grade'] = Math.min(...scoutingValues)

  // Handle TOI separately since it's a string that needs parsing - higher is better
  const toiValues = players.map(player => parseTimeToMinutes(player.toi))
  newBestStats['toi'] = Math.max(...toiValues)

  bestStats.value = newBestStats
}

const isBestStat = (statName: string, value: number) => {
  return selectedPlayersData.value.length > 1 && bestStats.value[statName] === value
}

const getPlayerInitials = (name: string) => {
  const parts = name.split(', ')
  if (parts.length === 2) {
    const lastName = parts[0]
    const firstName = parts[1]
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
}

const goHome = () => {
  router.push('/home')
}

// Watch for changes in selected players and recalculate best stats
watch(selectedPlayersData, () => {
  calculateBestStats()
}, { deep: true })

// Initialize with empty calculation
calculateBestStats()
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  position: relative;
}

.container-fluid {
  background: transparent;
  max-width: 1400px;
  margin: 0 auto;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  text-align: left;
  padding: 2rem 0;
}

.penguins-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(252, 181, 20, 0.3));
}

.page-title {
  color: white;
  font-weight: bold;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.selection-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.selection-title {
  color: #fcb514;
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0;
}

.add-player-btn-rectangle {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: 2px solid rgba(40, 167, 69, 0.3);
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.add-player-btn-rectangle i {
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-number-placeholder {
  width: 30px;
  height: 30px;
  margin-right: 15px;
  flex-shrink: 0;
}

.add-button-container {
  display: flex;
  justify-content: center;
  flex: 1;
  max-width: calc(100% - 97px); /* Account for player number + remove button space */
}

.remove-button-placeholder {
  width: 52px;
  margin-left: 8px;
}

.add-player-btn-rectangle:hover:not(:disabled) {
  background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  border-color: rgba(40, 167, 69, 0.5);
}

.add-player-btn-rectangle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.player-selection-row {
  display: flex;
  align-items: center;
}

.player-number {
  background: #fcb514;
  color: #000;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
}

.player-select {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(252, 181, 20, 0.3);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1rem;
}

.player-select:focus {
  border-color: #fcb514;
  box-shadow: 0 0 0 0.2rem rgba(252, 181, 20, 0.25);
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.player-select option {
  background: #2d2d2d;
  color: white;
}

.player-select optgroup {
  background: #1a1a1a;
  color: #fcb514;
  font-weight: 600;
}

.remove-btn {
  background: #dc3545;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.remove-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.remove-btn i {
  font-size: 1rem;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.player-card-wrapper {
  display: flex;
}

.player-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 181, 20, 0.2);
  width: 100%;
  transition: transform 0.3s ease;
}

.player-card:hover {
  transform: translateY(-2px);
}

.player-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.player-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fcb514 0%, #f39c12 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.player-initials {
  font-weight: 700;
  font-size: 1.2rem;
  color: #000;
}

.player-info {
  min-width: 0;
  flex: 1;
}

.player-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: white;
  word-break: break-word;
}

.player-season {
  color: #fcb514;
  font-weight: 500;
  margin: 0;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.stat-label {
  font-size: 0.8rem;
  color: #ccc;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
}

.stat-value.best-stat {
  color: #fcb514 !important;
  background: rgba(252, 181, 20, 0.15);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  animation: highlight 0.5s ease;
}

@keyframes highlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.section-title {
  color: white;
  font-weight: 600;
  font-size: 2rem;
  border-bottom: 3px solid #fcb514;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
}


.comparison-table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(252, 181, 20, 0.2);
  position: relative;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comparison-table th {
  background: rgba(252, 181, 20, 0.1);
  color: #fcb514;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.comparison-table th:first-child {
  position: sticky;
  left: 0;
  z-index: 11;
  background: rgba(252, 181, 20, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  width: 140px;
  max-width: 140px;
}

.comparison-table td:first-child {
  position: sticky;
  left: 0;
  background: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  width: 140px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.comparison-table tbody tr:last-child td {
  border-bottom: none;
}

.stat-name {
  font-weight: 500;
  text-align: left !important;
  padding-right: 1rem !important;
}

.best-stat-cell {
  color: #fcb514 !important;
  background: rgba(252, 181, 20, 0.15) !important;
  font-weight: 600;
  animation: highlight 0.5s ease;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #ccc;
}

.empty-state h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.floating-home-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #fcb514 0%, #f39c12 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 15px 25px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 20px rgba(252, 181, 20, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
}

.floating-home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(252, 181, 20, 0.6);
  background: linear-gradient(135deg, #f39c12 0%, #fcb514 100%);
}

.floating-home-button:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .players-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .players-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 2.5rem;
  }
  
  .penguins-logo {
    width: 60px;
    height: 60px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-home-button {
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    font-size: 0.9rem;
  }

  .player-selection-row {
    flex-direction: column;
    align-items: stretch;
  }

  .player-number {
    align-self: flex-start;
    margin-bottom: 10px;
    margin-right: 0;
  }

  .remove-btn {
    margin-top: 10px;
    margin-left: 0;
    align-self: flex-start;
  }
}
</style>