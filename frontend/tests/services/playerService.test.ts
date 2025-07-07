import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { playerService } from '../../src/services/playerService'
import type { Player } from '../../src/types/player'
import playerData from '../../../shared/data/player_data.json'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('playerService', () => {
  const realPlayers: Player[] = playerData as Player[]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('mock-token')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getPlayers', () => {
    it('should fetch players successfully with auth token', async () => {
      // Use real player data for more realistic testing
      const testPlayers = realPlayers.slice(0, 5)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          players: testPlayers
        })
      })

      const result = await playerService.getPlayers()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/players',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }
        }
      )
      expect(result).toEqual(testPlayers)
      expect(result[0]).toHaveProperty('player_name')
      expect(result[0]).toHaveProperty('season')
    })
  })
})