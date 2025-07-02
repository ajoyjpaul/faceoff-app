<template>
  <div class="table-container">
    <table class="custom-table">
      <thead class="table-header">
        <tr>
          <th class="player-col">Player</th>
          <th class="pos-col">Pos</th>
          <th class="stat-col">GP</th>
          <th class="stat-col">W</th>
          <th class="stat-col">L</th>
          <th class="stat-col">OTL</th>
          <th class="stat-col">GAA</th>
          <th class="stat-col">SV%</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="goalie in goalies" :key="goalie.playerId" class="table-row">
          <td class="player-col">
            <div class="player-info">
              <img 
                :src="goalie.headshot" 
                :alt="goalie.firstName.default + ' ' + goalie.lastName.default"
                class="player-headshot"
                @error="handleImageError"
              >
              <div class="player-details">
                <div class="player-name">{{ goalie.firstName.default }} {{ goalie.lastName.default }}</div>
              </div>
            </div>
          </td>
          <td class="pos-col">G</td>
          <td class="stat-col">{{ goalie.gamesPlayed }}</td>
          <td class="stat-col">{{ goalie.wins }}</td>
          <td class="stat-col">{{ goalie.losses }}</td>
          <td class="stat-col">{{ goalie.overtimeLosses }}</td>
          <td class="stat-col">{{ goalie.goalsAgainstAverage.toFixed(2) }}</td>
          <td class="stat-col">{{ goalie.savePercentage.toFixed(3) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Goalie {
  playerId: number
  headshot: string
  firstName: { default: string }
  lastName: { default: string }
  gamesPlayed: number
  wins: number
  losses: number
  overtimeLosses: number
  goalsAgainstAverage: number
  savePercentage: number
}

interface Props {
  goalies: Goalie[]
}

defineProps<Props>()

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