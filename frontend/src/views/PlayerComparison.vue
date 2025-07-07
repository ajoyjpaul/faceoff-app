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
                <h1 class="page-title">FaceOff</h1>
              </div>
            </div>
            
            <!-- Player Selection Controls -->
            <div class="selection-section mb-5">
              <div class="mb-4">
                <h3 class="selection-title">Compare Players</h3>
              </div>

              <!-- Loading State -->
              <div v-if="isLoading" class="text-center py-4">
                <div class="spinner-border text-warning" role="status">
                  <span class="visually-hidden">Loading players...</span>
                </div>
                <p class="mt-2 text-muted">Loading players...</p>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error loading players</h4>
                <p>{{ error }}</p>
                <hr>
                <p class="mb-0">Please check your connection and try again.</p>
              </div>

              <!-- Player Selection Dropdowns -->
              <div v-else class="player-selections">
                <PlayerSelector
                  v-for="(player, index) in selectedPlayers"
                  :key="`player-${index}`"
                  :index="index"
                  :selected-player="player"
                  :available-players-by-season="getAvailablePlayersBySeasonForIndex(index)"
                  @update="updatePlayer"
                  @remove="removePlayer"
                />

                <!-- Add Player Button -->
                <div class="d-flex align-items-center mt-4">
                  <div class="player-number-placeholder"></div>
                  <div class="add-button-container">
                    <BaseButton 
                      variant="primary" 
                      @click="addPlayer" 
                      :disabled="availablePlayersCount === 0" 
                      title="Add Player"
                      fullWidth
                    >
                      Add Player
                    </BaseButton>
                  </div>
                  <div class="remove-button-placeholder"></div>
                </div>
              </div>
            </div>

            <!-- Player Cards Grid -->
            <div v-if="selectedPlayersData.length > 0" class="comparison-section">
              <div class="players-grid">
                <div v-for="(player, index) in selectedPlayersData" :key="`card-${index}`" class="player-card-wrapper">
                  <PlayerCard
                    :player="player"
                    :is-best-stat="isBestStat"
                    :parse-time-to-minutes="parseTimeToMinutes"
                    :get-player-initials="getPlayerInitials"
                  />
                </div>
              </div>

              <!-- Comparison Table -->
              <ComparisonTable
                v-if="selectedPlayersData.length > 1"
                ref="comparisonTable"
                :players="selectedPlayersData"
                :is-best-stat="isBestStat"
                :parse-time-to-minutes="parseTimeToMinutes"
              />
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
              <h3>Add players to compare their stats</h3>
              <p>Use the "Add Player" button above to start comparing players.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PlayerCard from '../components/PlayerCard.vue'
import PlayerSelector from '../components/PlayerSelector.vue'
import ComparisonTable from '../components/ComparisonTable.vue'
import BaseButton from '../components/BaseButton.vue'
import { usePlayerComparison } from '../composables/usePlayerComparison'
import { usePlayerData } from '../composables/usePlayerData'
import type { Player } from '../types'

const comparisonTable = ref<InstanceType<typeof ComparisonTable> | null>(null)

const {
  selectedPlayers,
  selectedPlayersData,
  parseTimeToMinutes,
  calculateBestStats,
  isBestStat,
  addPlayer: addPlayerToComparison,
  removePlayer: removePlayerFromComparison
} = usePlayerComparison()

const {
  getAvailablePlayersBySeason,
  getAvailablePlayersCount,
  getPlayerInitials,
  isLoading,
  error
} = usePlayerData()

const availablePlayersCount = computed(() => 
  getAvailablePlayersCount(selectedPlayersData.value)
)

const getAvailablePlayersBySeasonForIndex = (index: number) => 
  getAvailablePlayersBySeason(index, selectedPlayers.value, selectedPlayersData.value)

const updatePlayer = (index: number, player: Player | string) => {
  selectedPlayers.value[index] = player
  calculateBestStats()
}

const addPlayer = () => {
  addPlayerToComparison(availablePlayersCount.value)
}

const removePlayer = (index: number) => {
  removePlayerFromComparison(index)
}

watch(selectedPlayersData, () => {
  calculateBestStats()
  if (comparisonTable.value) {
    comparisonTable.value.updateScrollIndicators()
  }
}, { deep: true })

calculateBestStats()
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  color: var(--color-text-primary);
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
  filter: drop-shadow(0 4px 8px var(--color-penguins-gold-shadow));
}

.page-title {
  color: var(--color-text-primary);
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
  color: var(--color-penguins-gold);
  font-weight: 600;
  font-size: 1.5rem;
  margin: 0;
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




.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.player-card-wrapper {
  display: flex;
}


.section-title {
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 2rem;
  border-bottom: 3px solid var(--color-penguins-gold);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  display: inline-block;
}

.comparison-table-container {
  position: relative;
}

.scroll-indicator-left,
.scroll-indicator-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(252, 181, 20, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 1rem;
  cursor: pointer;
  z-index: 12;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(252, 181, 20, 0.4);
  animation: float 2s ease-in-out infinite;
}

.scroll-indicator-left {
  left: 10px;
}

.scroll-indicator-right {
  right: 10px;
}

.scroll-indicator-left:hover,
.scroll-indicator-right:hover {
  background: rgba(252, 181, 20, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(252, 181, 20, 0.6);
}

@keyframes float {
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(-60%);
  }
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
  background: rgba(26, 26, 26, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  min-width: 140px;
  width: 140px;
  max-width: 140px;
  border-right: 1px solid rgba(252, 181, 20, 0.3);
}

.comparison-table td:first-child {
  position: sticky;
  left: 0;
  background: rgba(26, 26, 26, 0.98);
  backdrop-filter: blur(10px);
  z-index: 9;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  min-width: 140px;
  width: 140px;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-right: 1px solid rgba(252, 181, 20, 0.3);
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
  color: var(--color-text-secondary);
}

.empty-state h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
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