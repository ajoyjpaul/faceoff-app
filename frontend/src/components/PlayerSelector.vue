<template>
  <div class="player-selection-row mb-3">
    <div class="d-flex align-items-center">
      <div class="player-number">{{ index + 1 }}</div>
      <select 
        :value="typeof selectedPlayer === 'string' ? selectedPlayer : JSON.stringify(selectedPlayer)" 
        @change="handlePlayerChange"
        class="player-select flex-grow-1"
      >
        <option value="">Select a player...</option>
        <optgroup 
          v-for="(seasonPlayers, season) in availablePlayersBySeason" 
          :key="season" 
          :label="`${season} Season`"
        >
          <option 
            v-for="player in seasonPlayers" 
            :key="`${player.season}-${player.player_name}`" 
            :value="JSON.stringify(player)"
          >
            {{ player.season }} {{ player.player_name }} ({{ player.team }})
          </option>
        </optgroup>
      </select>
      <BaseButton 
        variant="outline-danger" 
        icon="fas fa-trash-alt"
        @click="$emit('remove', index)"
        :aria-label="'Remove player ' + (index + 1)"
        class="ms-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import type { Player } from '../types'

interface Props {
  index: number
  selectedPlayer: Player | string
  availablePlayersBySeason: Record<number, Player[]>
}

interface Emits {
  (e: 'update', index: number, player: Player | string): void
  (e: 'remove', index: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handlePlayerChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  
  if (value === '') {
    emit('update', props.index, '')
  } else {
    try {
      const player = JSON.parse(value) as Player
      emit('update', props.index, player)
    } catch (error) {
      console.error('Failed to parse player data:', error)
      emit('update', props.index, '')
    }
  }
}
</script>

<style scoped>
/* Uses shared .player-selection-row from components.css */

/* Uses shared .player-number from components.css */

/* Override shared .player-select styles for dropdown visibility fix */
.player-select {
  -webkit-text-fill-color: var(--color-text-primary) !important;
  width: 100% !important;
  min-height: 44px !important;
  font-family: inherit !important;
  outline: none !important;
}

.player-select:focus {
  -webkit-text-fill-color: var(--color-text-primary) !important;
}


@media (max-width: 768px) {
  .player-selection-row {
    flex-direction: column;
    align-items: stretch;
  }

  .player-number {
    align-self: flex-start;
    margin-bottom: 10px;
    margin-right: 0;
  }

}
</style>