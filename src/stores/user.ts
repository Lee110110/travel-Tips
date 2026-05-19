import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserLocation } from '@/types/city'
import { getUserLocation } from '@/utils/location'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useUserStore = defineStore('user', () => {
  const themeMode = ref<ThemeMode>(
    (uni.getStorageSync('rt_theme') as ThemeMode) || 'system'
  )
  const onboarded = ref<boolean>(
    uni.getStorageSync('rt_onboarded') === 'true'
  )
  const location = ref<UserLocation | null>(null)
  const locationLoading = ref(false)
  const locationDenied = ref(false)

  const isDark = computed(() => {
    if (themeMode.value === 'dark') return true
    if (themeMode.value === 'light') return false
    try {
      return uni.getSystemInfoSync().theme === 'dark'
    } catch {
      return false
    }
  })

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    uni.setStorageSync('rt_theme', mode)
    applyTheme()
  }

  function setOnboarded(val: boolean) {
    onboarded.value = val
    uni.setStorageSync('rt_onboarded', val ? 'true' : 'false')
  }

  function applyTheme() {
    // #ifdef H5
    document.documentElement.classList.toggle('dark-mode', isDark.value)
    // #endif
  }

  function initTheme() {
    // #ifdef H5
    document.documentElement.classList.toggle('dark-mode', isDark.value)
    // #endif
  }

  async function refreshLocation() {
    locationLoading.value = true
    locationDenied.value = false
    try {
      location.value = await getUserLocation()
      uni.setStorageSync('rt_location', JSON.stringify(location.value))
    } catch {
      locationDenied.value = true
    } finally {
      locationLoading.value = false
    }
  }

  function initLocation() {
    const cached = uni.getStorageSync('rt_location')
    if (cached) {
      try { location.value = JSON.parse(cached) } catch {}
    }
  }

  return {
    themeMode, onboarded, isDark,
    location, locationLoading, locationDenied,
    setTheme, setOnboarded, applyTheme, initTheme,
    refreshLocation, initLocation,
  }
})
