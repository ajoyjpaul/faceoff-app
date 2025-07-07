import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Player } from '../../src/types/player'
import playerData from '../../../shared/data/player_data.json'
import { playerService } from '../../src/services/playerService'

// Mock the player service
vi.mock('../../src/services/playerService', () => ({
  playerService: {
    getPlayers: vi.fn()
  }
}))

describe('usePlayerData', () => {
  const realPlayers: Player[] = playerData as Player[]
  
  // Get a few real players from different seasons for testing
  const testPlayers = realPlayers.slice(0, 10)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('player service integration', () => {
    it('should be mocked correctly', () => {
      expect(vi.isMockFunction(playerService.getPlayers)).toBe(true)
    })
  })

  describe('real data validation', () => {
    it('should load real player data', () => {
      expect(realPlayers.length).toBeGreaterThan(0)
      expect(realPlayers[0]).toHaveProperty('player_name')
      expect(realPlayers[0]).toHaveProperty('season')
    })
  })
})