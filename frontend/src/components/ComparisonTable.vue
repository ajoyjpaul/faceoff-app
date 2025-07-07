<template>
  <div class="comparison-stats mt-5">
    <h3 class="section-title mb-4">Statistical Comparison</h3>
    <div class="comparison-table-container">
      <div v-if="showLeftArrow" class="scroll-indicator-left" @click="scrollLeft">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div v-if="showRightArrow" class="scroll-indicator-right" @click="scrollRight">
        <i class="fas fa-chevron-right"></i>
      </div>
      
      <div class="comparison-table-wrapper" ref="tableWrapper" @scroll="handleScroll">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Statistic</th>
              <th v-for="(player, index) in players" :key="`header-${index}`">
                {{ player.season }} {{ player.player_name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stat in statsToShow" :key="stat.key">
              <td class="stat-name">{{ stat.label }}</td>
              <td 
                v-for="(player, index) in players" 
                :key="`${stat.key}-${index}`" 
                :class="{ 'best-stat-cell': isBestStat(stat.key, stat.getValue(player)) }"
              >
                {{ stat.displayValue(player) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import type { Player } from '../types'

interface Props {
  players: Player[]
  isBestStat: (statName: string, value: number) => boolean
  parseTimeToMinutes: (toi: string) => number
}

const props = defineProps<Props>()

const tableWrapper = ref<HTMLElement | null>(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(false)

const statsToShow = [
  {
    key: 'gp',
    label: 'Games Played',
    getValue: (player: Player) => player.gp,
    displayValue: (player: Player) => player.gp.toString()
  },
  {
    key: 'goals',
    label: 'Goals',
    getValue: (player: Player) => player.goals,
    displayValue: (player: Player) => player.goals.toString()
  },
  {
    key: 'assists',
    label: 'Assists',
    getValue: (player: Player) => player.assists,
    displayValue: (player: Player) => player.assists.toString()
  },
  {
    key: 'points',
    label: 'Points',
    getValue: (player: Player) => player.points,
    displayValue: (player: Player) => player.points.toString()
  },
  {
    key: 'shots',
    label: 'Shots',
    getValue: (player: Player) => player.shots,
    displayValue: (player: Player) => player.shots.toString()
  },
  {
    key: 'toi',
    label: 'TOI',
    getValue: (player: Player) => props.parseTimeToMinutes(player.toi),
    displayValue: (player: Player) => player.toi
  },
  {
    key: 'scouting_grade',
    label: 'Grade',
    getValue: (player: Player) => player.scouting_grade,
    displayValue: (player: Player) => player.scouting_grade.toString()
  }
]

const handleScroll = () => {
  if (!tableWrapper.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tableWrapper.value
  
  showLeftArrow.value = scrollLeft > 0
  showRightArrow.value = scrollLeft < (scrollWidth - clientWidth - 1)
}

const scrollLeft = () => {
  if (tableWrapper.value) {
    tableWrapper.value.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (tableWrapper.value) {
    tableWrapper.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const updateScrollIndicators = async () => {
  await nextTick()
  handleScroll()
}

onMounted(() => {
  updateScrollIndicators()
})

defineExpose({
  updateScrollIndicators
})
</script>

<style scoped>
.section-title {
  color: white;
  font-weight: 600;
  font-size: 2rem;
  border-bottom: 3px solid #fcb514;
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

@keyframes highlight {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>