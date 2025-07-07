<template>
  <div class="player-selection-row mb-3">
    <div class="d-flex align-items-center">
      <div class="player-number">{{ index + 1 }}</div>
      <select 
        :value="selectedPlayer" 
        @change="handlePlayerChange"
        class="form-select player-select flex-grow-1"
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