import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref, computed } from "vue";
import PlayerComparison from "../../src/views/PlayerComparison.vue";
import type { Player } from "../../src/types/player";
import playerData from "../../../shared/data/player_data.json";

// Mock the composables
vi.mock("../../src/composables/usePlayerData", () => ({
  usePlayerData: vi.fn(),
}));

vi.mock("../../src/composables/usePlayerComparison", () => ({
  usePlayerComparison: vi.fn(),
}));

describe("PlayerComparison", () => {
  const realPlayers: Player[] = (playerData as Player[]).slice(0, 3);

  const mockUsePlayerData = {
    allPlayersGrouped: computed(() => ({})),
    getAvailablePlayersBySeason: vi.fn(() => ({})),
    getAvailablePlayersCount: vi.fn(() => 10),
    getPlayerInitials: vi.fn((name: string) => name.slice(0, 2).toUpperCase()),
    isLoading: ref(false),
    error: ref(null),
    loadPlayers: vi.fn()
  };

  const mockUsePlayerComparison = {
    selectedPlayers: ref([]),
    selectedPlayersData: computed(() => []),
    bestStats: ref({}),
    parseTimeToMinutes: vi.fn((toi: string) => parseInt(toi)),
    calculateBestStats: vi.fn(),
    isBestStat: vi.fn(() => false),
    addPlayer: vi.fn(),
    removePlayer: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const { usePlayerData } = await import(
      "../../src/composables/usePlayerData"
    );
    const { usePlayerComparison } = await import(
      "../../src/composables/usePlayerComparison"
    );

    vi.mocked(usePlayerData).mockReturnValue(mockUsePlayerData);
    vi.mocked(usePlayerComparison).mockReturnValue(mockUsePlayerComparison);
  });

  it("should render PlayerCard components when players are selected", async () => {
    const mockWithSelectedPlayersData = {
      ...mockUsePlayerComparison,
      selectedPlayersData: computed(() => realPlayers.slice(0, 2)),
    };

    const { usePlayerComparison } = await import(
      "../../src/composables/usePlayerComparison"
    );
    vi.mocked(usePlayerComparison).mockReturnValue(mockWithSelectedPlayersData);

    const wrapper = mount(PlayerComparison, {
      global: {
        stubs: {
          PlayerSelector: true,
          BaseButton: true,
          PlayerCard: true,
          ComparisonTable: true,
        },
      },
    });

    expect(wrapper.find(".comparison-section").exists()).toBe(true);
    expect(wrapper.find(".players-grid").exists()).toBe(true);

    const playerCards = wrapper.findAllComponents({ name: "PlayerCard" });
    expect(playerCards).toHaveLength(2);
  });

  it("should pass correct props to PlayerCard components", async () => {
    const mockWithSelectedPlayersData = {
      ...mockUsePlayerComparison,
      selectedPlayersData: computed(() => [realPlayers[0]]),
    };

    const { usePlayerComparison } = await import(
      "../../src/composables/usePlayerComparison"
    );
    vi.mocked(usePlayerComparison).mockReturnValue(mockWithSelectedPlayersData);

    const wrapper = mount(PlayerComparison, {
      global: {
        stubs: {
          PlayerSelector: true,
          BaseButton: true,
          PlayerCard: true,
          ComparisonTable: true,
        },
      },
    });

    const playerCard = wrapper.findComponent({ name: "PlayerCard" });
    expect(playerCard.props("player")).toEqual(realPlayers[0]);
    expect(playerCard.props("isBestStat")).toBe(
      mockUsePlayerComparison.isBestStat
    );
    expect(playerCard.props("parseTimeToMinutes")).toBe(
      mockUsePlayerComparison.parseTimeToMinutes
    );
    expect(playerCard.props("getPlayerInitials")).toBe(
      mockUsePlayerData.getPlayerInitials
    );
  });
});
