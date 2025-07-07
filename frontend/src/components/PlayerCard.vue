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
      <StatItem
        v-for="stat in playerStats"
        :key="stat.key"
        :label="stat.label"
        :value="stat.value"
        :is-best="stat.isBest"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatItem from './StatItem.vue'
import type { Player } from '../types'

interface Props {
  player: Player
  isBestStat: (statName: string, value: number) => boolean
  parseTimeToMinutes: (toi: string) => number
  getPlayerInitials: (name: string) => string
}

const props = defineProps<Props>()

const playerStats = computed(() => [
  {
    key: 'gp',
    label: 'Games Played',
    value: props.player.gp,
    isBest: props.isBestStat('gp', props.player.gp)
  },
  {
    key: 'goals',
    label: 'Goals',
    value: props.player.goals,
    isBest: props.isBestStat('goals', props.player.goals)
  },
  {
    key: 'assists',
    label: 'Assists',
    value: props.player.assists,
    isBest: props.isBestStat('assists', props.player.assists)
  },
  {
    key: 'points',
    label: 'Points',
    value: props.player.points,
    isBest: props.isBestStat('points', props.player.points)
  },
  {
    key: 'shots',
    label: 'Shots',
    value: props.player.shots,
    isBest: props.isBestStat('shots', props.player.shots)
  },
  {
    key: 'toi',
    label: 'TOI',
    value: props.player.toi,
    isBest: props.isBestStat('toi', props.parseTimeToMinutes(props.player.toi))
  },
  {
    key: 'scouting_grade',
    label: 'Scouting Grade',
    value: props.player.scouting_grade,
    isBest: props.isBestStat('scouting_grade', props.player.scouting_grade)
  }
])
</script>

<style scoped>

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>