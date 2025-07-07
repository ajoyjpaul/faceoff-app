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
/* All player card styles are now in /styles/components.css */
/* Only component-specific overrides remain here */

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>