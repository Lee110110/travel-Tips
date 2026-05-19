import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface HistoryEntry {
  cityId: string
  timestamp: number
}

export const useHistoryStore = defineStore('history', () => {
  const history = ref<HistoryEntry[]>(
    JSON.parse(uni.getStorageSync('rt_history') || '[]')
  )
  const favorites = ref<string[]>(
    JSON.parse(uni.getStorageSync('rt_favorites') || '[]')
  )

  function addToHistory(cityId: string) {
    history.value.unshift({ cityId, timestamp: Date.now() })
    if (history.value.length > 100) {
      history.value = history.value.slice(0, 100)
    }
    persistHistory()
  }

  function toggleFavorite(cityId: string) {
    const idx = favorites.value.indexOf(cityId)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(cityId)
    }
    persistFavorites()
  }

  function isFavorite(cityId: string): boolean {
    return favorites.value.includes(cityId)
  }

  function removeFromHistory(timestamp: number) {
    const idx = history.value.findIndex((h) => h.timestamp === timestamp)
    if (idx >= 0) {
      history.value.splice(idx, 1)
    }
    persistHistory()
  }

  function clearHistory() {
    history.value = []
    persistHistory()
  }

  const discoveredCount = computed(() => {
    const uniqueCityIds = new Set(history.value.map((h) => h.cityId))
    return uniqueCityIds.size
  })

  function persistHistory() {
    uni.setStorageSync('rt_history', JSON.stringify(history.value))
  }

  function persistFavorites() {
    uni.setStorageSync('rt_favorites', JSON.stringify(favorites.value))
  }

  return {
    history,
    favorites,
    discoveredCount,
    addToHistory,
    toggleFavorite,
    isFavorite,
    removeFromHistory,
    clearHistory,
  }
})
