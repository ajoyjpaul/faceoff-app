import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComparisonTable from '../../src/components/ComparisonTable.vue'
import type { Player } from '../../src/types/player'
import playerData from '../../../shared/data/player_data.json'

describe('ComparisonTable', () => {
  const realPlayers: Player[] = (playerData as Player[]).slice(0, 3) // Use first 3 players
  
  const mockProps = {
    players: realPlayers,
    isBestStat: vi.fn(() => false),
    parseTimeToMinutes: vi.fn((toi: string) => {
      const [minutes, seconds] = toi.split(':').map(Number)
      return minutes + (seconds || 0) / 60
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display correct stat values for each player', () => {
    const wrapper = mount(ComparisonTable, {
      props: mockProps
    })

    const statRows = wrapper.findAll('tbody tr')
    
    // Test goals row (index 1)
    const goalsRow = statRows[1]
    const goalsCells = goalsRow.findAll('td')
    
    // Skip first cell (stat name), check player values
    for (let i = 0; i < realPlayers.length; i++) {
      expect(goalsCells[i + 1].text()).toBe(realPlayers[i].goals.toString())
    }

    // Test assists row (index 2)
    const assistsRow = statRows[2]
    const assistsCells = assistsRow.findAll('td')
    
    for (let i = 0; i < realPlayers.length; i++) {
      expect(assistsCells[i + 1].text()).toBe(realPlayers[i].assists.toString())
    }
  })
})