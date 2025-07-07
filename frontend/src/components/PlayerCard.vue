<template>
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
        <span class="stat-value" :class="{ 'best-stat': isBestStat('gp', player.gp) }">
          {{ player.gp }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Goals</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('goals', player.goals) }">
          {{ player.goals }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Assists</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('assists', player.assists) }">
          {{ player.assists }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Points</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('points', player.points) }">
          {{ player.points }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Shots</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('shots', player.shots) }">
          {{ player.shots }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">TOI</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('toi', parseTimeToMinutes(player.toi)) }">
          {{ player.toi }}
        </span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Scouting Grade</span>
        <span class="stat-value" :class="{ 'best-stat': isBestStat('scouting_grade', player.scouting_grade) }">
          {{ player.scouting_grade }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '../types'

interface Props {
  player: Player
  isBestStat: (statName: string, value: number) => boolean
  parseTimeToMinutes: (toi: string) => number
  getPlayerInitials: (name: string) => string
}

defineProps<Props>()
</script>

<style scoped>
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

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>