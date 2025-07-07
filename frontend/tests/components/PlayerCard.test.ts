import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayerCard from '../../src/components/PlayerCard.vue'
import StatItem from '../../src/components/StatItem.vue'
import type { Player } from '../../src/types/player'
import playerData from '../../../shared/data/player_data.json'

describe('PlayerCard', () => {
  const realPlayer: Player = playerData[0] as Player
  
  const mockProps = {
    player: realPlayer,
    isBestStat: vi.fn(() => false),
    parseTimeToMinutes: vi.fn((toi: string) => {
      const [minutes, seconds] = toi.split(':').map(Number)
      return minutes + (seconds || 0) / 60
    }),
    getPlayerInitials: vi.fn((name: string) => {
      const parts = name.split(', ')
      if (parts.length === 2) {
        return `${parts[1].charAt(0)}${parts[0].charAt(0)}`.toUpperCase()
      }
      return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    })
  }

  it('should render player information correctly', () => {
    const wrapper = mount(PlayerCard, {
      props: mockProps,
      global: {
        components: {
          StatItem
        }
      }
    })

    // Check player name is displayed
    expect(wrapper.find('.player-name').text()).toBe(realPlayer.player_name)
    
    // Check season and team info
    const seasonText = wrapper.find('.player-season').text()
    expect(seasonText).toContain(realPlayer.season.toString())
    expect(seasonText).toContain(realPlayer.team)
  })

  it('should render all stat items', () => {
    const wrapper = mount(PlayerCard, {
      props: mockProps,
      global: {
        components: {
          StatItem
        }
      }
    })

    const statItems = wrapper.findAllComponents(StatItem)
    expect(statItems).toHaveLength(7) // games, goals, assists, points, shots, toi, scouting_grade

    // Verify specific stats are rendered
    const statLabels = statItems.map(item => item.props('label'))
    expect(statLabels).toContain('Games Played')
    expect(statLabels).toContain('Goals')
    expect(statLabels).toContain('Assists')
    expect(statLabels).toContain('Points')
    expect(statLabels).toContain('Shots')
    expect(statLabels).toContain('TOI')
    expect(statLabels).toContain('Scouting Grade')
  })

  it('should highlight best stats when isBestStat returns true', () => {
    const propsWithBestStat = {
      ...mockProps,
      isBestStat: vi.fn((statName: string) => statName === 'goals') // Goals is best stat
    }

    const wrapper = mount(PlayerCard, {
      props: propsWithBestStat,
      global: {
        components: {
          StatItem
        }
      }
    })

    const statItems = wrapper.findAllComponents(StatItem)
    const goalsItem = statItems.find(item => item.props('label') === 'Goals')
    const assistsItem = statItems.find(item => item.props('label') === 'Assists')

    expect(goalsItem?.props('isBest')).toBe(true)
    expect(assistsItem?.props('isBest')).toBe(false)
  })
})