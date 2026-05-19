import type { City, FilterState } from '@/types/city'

export function filterCities(cities: City[], filter: FilterState): City[] {
  return cities.filter((city) => {
    if (filter.region !== 'all' && city.region !== filter.region) return false
    if (filter.types.length > 0 && !filter.types.some((t) => city.types.includes(t))) return false
    return true
  })
}

export function randomSelect(pool: City[]): City {
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

export function sampleCities(pool: City[], count: number): City[] {
  const arr = [...pool]
  for (let i = arr.length - 1; i > 0 && i >= arr.length - count; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(-count)
}
