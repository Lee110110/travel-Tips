import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cities } from '@/data/cities'
import type { City, FilterState, SceneCategory, NearbyCity, NearbyAttraction, UserLocation } from '@/types/city'
import { filterCities, randomSelect } from '@/utils/random'
import { haversineDistance } from '@/utils/distance'

export const useCityStore = defineStore('city', () => {
  const allCities = ref<City[]>(cities)
  const filter = ref<FilterState>({ region: 'all', types: [] })
  const selectedCity = ref<City | null>(null)
  const isSpinning = ref(false)
  const activeScene = ref<SceneCategory | null>(null)

  const filteredCities = computed(() => filterCities(allCities.value, filter.value))

  const sceneFilteredCities = computed(() => {
    if (!activeScene.value) return filteredCities.value
    return filteredCities.value.filter(c => c.types.includes(activeScene.value!))
  })

  function setFilter(newFilter: FilterState) {
    filter.value = newFilter
  }

  function setScene(scene: SceneCategory | null) {
    activeScene.value = scene
  }

  function pickRandom(): City {
    const pool = sceneFilteredCities.value
    if (pool.length === 0) return allCities.value[0]
    return randomSelect(pool)
  }

  function setSelectedCity(city: City) {
    selectedCity.value = city
  }

  function setSpinning(val: boolean) {
    isSpinning.value = val
  }

  function getCityById(id: string): City | undefined {
    return allCities.value.find((c) => c.id === id)
  }

  function getNearbyCities(location: UserLocation, maxDistanceKm = 500): NearbyCity[] {
    return allCities.value
      .map(city => ({
        ...city,
        distance: haversineDistance(location.latitude, location.longitude, city.latitude, city.longitude),
      }))
      .filter(c => c.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance)
  }

  function getNearbyAttractions(location: UserLocation, maxDistanceKm = 300): NearbyAttraction[] {
    const results: NearbyAttraction[] = []
    for (const city of allCities.value) {
      const dist = haversineDistance(location.latitude, location.longitude, city.latitude, city.longitude)
      if (dist <= maxDistanceKm) {
        for (const attr of city.attractions) {
          results.push({ attraction: attr, cityName: city.name, distance: dist })
        }
      }
    }
    return results.sort((a, b) => a.distance - b.distance)
  }

  return {
    allCities,
    filter,
    selectedCity,
    isSpinning,
    activeScene,
    filteredCities,
    sceneFilteredCities,
    setFilter,
    setScene,
    pickRandom,
    setSelectedCity,
    setSpinning,
    getCityById,
    getNearbyCities,
    getNearbyAttractions,
  }
})
