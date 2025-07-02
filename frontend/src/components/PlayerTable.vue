<template>
  <div class="table-container">
    <table class="custom-table">
      <thead class="table-header">
        <tr>
          <th class="player-col">Player</th>
          <th class="pos-col">Pos</th>
          <th class="stat-col">GP</th>
          <th class="stat-col">G</th>
          <th class="stat-col">A</th>
          <th class="stat-col">Pts</th>
          <th class="stat-col">+/-</th>
          <th class="stat-col">TOI</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.playerId" class="table-row">
          <td class="player-col">
            <div class="player-info">
              <img 
                :src="player.headshot" 
                :alt="player.firstName.default + ' ' + player.lastName.default"
                class="player-headshot"
                @error="handleImageError"
              >
              <div class="player-details">
                <div class="player-name">{{ player.firstName.default }} {{ player.lastName.default }}</div>
              </div>
            </div>
          </td>
          <td class="pos-col">{{ player.positionCode === 'R' ? 'RW' : player.positionCode === 'L' ? 'LW' : player.positionCode }}</td>
          <td class="stat-col">{{ player.gamesPlayed }}</td>
          <td class="stat-col">{{ player.goals }}</td>
          <td class="stat-col">{{ player.assists }}</td>
          <td class="stat-col points-column">{{ player.points }}</td>
          <td class="stat-col" :class="getPlusMinusClass(player.plusMinus)">
            {{ formatPlusMinus(player.plusMinus) }}
          </td>
          <td class="stat-col">{{ formatTOI(player.avgTimeOnIcePerGame) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Player {
  playerId: number
  headshot: string
  firstName: { default: string }
  lastName: { default: string }
  positionCode: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  plusMinus: number
  avgTimeOnIcePerGame: number
}

interface Props {
  players: Player[]
}

defineProps<Props>()

// Helper functions
const formatTOI = (avgTimeOnIcePerGame: number): string => {
  const minutes = Math.floor(avgTimeOnIcePerGame / 60)
  const seconds = Math.round(avgTimeOnIcePerGame % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatPlusMinus = (plusMinus: number): string => {
  if (plusMinus === 0) return '0'
  return plusMinus > 0 ? `+${plusMinus}` : `${plusMinus}`
}

const getPlusMinusClass = (plusMinus: number): string => {
  if (plusMinus === 0) return 'plus-minus-neutral'
  return plusMinus > 0 ? 'plus-minus-positive' : 'plus-minus-negative'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/50x50/cccccc/666666?text=N/A'
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-width: 1200px;
  width: 100%;
}

.custom-table {
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  margin: 0;
}

.table-header {
  background: #000 !important;
}

.table-header th {
  color: white;
  font-weight: 600;
  border-bottom: 2px solid #fcb514;
  padding: 1rem 0.75rem;
  border: none;
}

.table-header th.player-col {
  text-align: left;
}

.table-header th.pos-col,
.table-header th.stat-col {
  text-align: center;
}

.player-col {
  width: 35%;
  min-width: 200px;
  text-align: left;
}

.pos-col {
  width: 8%;
  min-width: 50px;
  text-align: center;
}

.stat-col {
  width: 9%;
  min-width: 60px;
  text-align: center;
}

.table-row {
  background: rgba(128, 128, 128, 0.3);
  border-bottom: 1px solid #555;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: rgba(128, 128, 128, 0.4);
}

.table-row:nth-child(odd) {
  background: rgba(128, 128, 128, 0.25);
}

.table-row:nth-child(odd):hover {
  background: rgba(128, 128, 128, 0.35);
}

.table-row td {
  color: white;
  padding: 1rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
  border-left: none;
  border-right: none;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-headshot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fcb514;
  flex-shrink: 0;
}

.player-details {
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.points-column {
  font-weight: 700 !important;
  color: white !important;
}

.plus-minus-positive {
  color: #28a745 !important;
  font-weight: 600;
}

.plus-minus-negative {
  color: #dc3545 !important;
  font-weight: 600;
}

.plus-minus-neutral {
  color: #6c757d !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .player-col {
    min-width: 150px;
  }
  
  .stat-col {
    min-width: 45px;
    font-size: 0.9rem;
  }
  
  .table-header th,
  .table-row td {
    padding: 0.75rem 0.5rem;
  }
  
  .player-headshot {
    width: 40px;
    height: 40px;
  }
  
  .player-name {
    font-size: 0.9rem;
  }
}
</style>