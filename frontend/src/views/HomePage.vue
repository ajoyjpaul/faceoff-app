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
                <h1 class="roster-title">FaceOff</h1>
              </div>
            </div>
            
            <div class="mb-4">
              <h2 class="roster-subtitle">NHL Stats 2024-25</h2>
            </div>

            <!-- Forwards Section -->
            <div class="mb-5">
              <h2 class="section-title mb-3">Forwards</h2>
              <div class="table-wrapper">
                <PlayerTable :players="forwards" />
              </div>
            </div>

            <!-- Defensemen Section -->
            <div class="mb-5">
              <h2 class="section-title mb-3">Defensemen</h2>
              <div class="table-wrapper">
                <PlayerTable :players="defensemen" />
              </div>
            </div>

            <!-- Goalies Section -->
            <div class="mb-5">
              <h2 class="section-title mb-3">Goalies</h2>
              <div class="table-wrapper">
                <GoalieTable :goalies="goalies" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Ask FaceOff AI Button -->
    <button class="floating-ai-button" @click="openAI">
      Ask FaceOff AI
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PlayerTable from '../components/PlayerTable.vue'
import GoalieTable from '../components/GoalieTable.vue'

// Import the roster data
import rosterData from '../../../shared/data/2024_2025_penguins_roster.json'

// Router instance
const router = useRouter()

// Define interfaces for type safety
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

// Computed properties to filter players by position
const forwards = computed(() => {
  return rosterData.skaters.filter((player: Player) => 
    ['C', 'L', 'R', 'LW', 'RW'].includes(player.positionCode)
  ).sort((a, b) => a.lastName.default.localeCompare(b.lastName.default))
})

const defensemen = computed(() => {
  return rosterData.skaters.filter((player: Player) => 
    player.positionCode === 'D'
  ).sort((a, b) => a.lastName.default.localeCompare(b.lastName.default))
})

const goalies = computed(() => {
  return rosterData.goalies.sort((a: Goalie, b: Goalie) => 
    a.lastName.default.localeCompare(b.lastName.default)
  )
})

// Helper functions
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/hockey-logo.png'
}

const openAI = () => {
  router.push('/ai')
}
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

.hockey-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(252, 181, 20, 0.3));
}

.roster-title {
  color: white;
  font-weight: bold;
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
}

.roster-subtitle {
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
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

.floating-ai-button {
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

.floating-ai-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(252, 181, 20, 0.6);
  background: linear-gradient(135deg, #f39c12 0%, #fcb514 100%);
}

.floating-ai-button:active {
  transform: translateY(0);
}

.table-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (max-width: 768px) {
  .roster-title {
    font-size: 2.5rem;
  }
  
  .hockey-logo {
    width: 60px;
    height: 60px;
  }
  
  .floating-ai-button {
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}
</style>