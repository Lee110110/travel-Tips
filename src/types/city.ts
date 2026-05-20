export type CityRegion = 'domestic' | 'international'

export type CityType = 'beach' | 'mountain' | 'city' | 'historical' | 'nature' | 'foodie' | 'romantic' | 'adventure' | 'desert' | 'grassland' | 'forest'

export interface BudgetRange {
  label: string
  dailyMin: number
  dailyMax: number
  currency: string
}

export interface Attraction {
  name: string
  description: string
  image: string
  rating: number
}

export interface FoodItem {
  name: string
  description: string
  image: string
  mustTry: boolean
}

export interface City {
  id: string
  name: string
  nameEn: string
  country: string
  region: CityRegion
  types: CityType[]
  description: string
  population: string
  climate: string
  bestSeason: string
  avgBudget: BudgetRange
  latitude: number
  longitude: number
  heroImage: string
  attractions: Attraction[]
  cuisine: FoodItem[]
  travelTips: string[]
}

export interface FilterState {
  region: CityRegion | 'all'
  types: CityType[]
}

export const CITY_TYPE_LABELS: Record<CityType, string> = {
  beach: '海滩',
  mountain: '山岳',
  city: '都市',
  historical: '历史',
  nature: '自然',
  foodie: '美食',
  romantic: '浪漫',
  adventure: '探险',
  desert: '沙漠',
  grassland: '草原',
  forest: '森林',
}

export const CITY_REGION_LABELS: Record<CityRegion | 'all', string> = {
  all: '全部',
  domestic: '国内',
  international: '国外',
}

// Scene categories for Depart page
export type SceneCategory = 'desert' | 'grassland' | 'beach' | 'forest'

export const SCENE_CATEGORY_LABELS: Record<SceneCategory, string> = {
  desert: '沙漠',
  grassland: '草原',
  beach: '海边',
  forest: '森林',
}

// Buddy / Team-up types
export interface BuddyTeam {
  id: string
  name: string
  departure: string
  destination: string
  departureTime: number
  returnTime: number
  maxMembers: number
  needApproval: boolean
  creatorId: string
  creatorName: string
  creatorAvatar: string
  currentMembers: number
  tags: string[]
  description: string
  createdAt: number
  status: 'open' | 'full' | 'closed'
}

export interface BuddyApplication {
  id: string
  teamId: string
  applicantId: string
  applicantName: string
  applicantAvatar: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

// Location
export interface UserLocation {
  latitude: number
  longitude: number
  timestamp: number
}

export interface NearbyCity extends City {
  distance: number
}

export interface NearbyAttraction {
  attraction: Attraction
  cityName: string
  distance: number
}

// AI Travel Guide (generated when team is closed)
export interface LuggageItem {
  name: string
  category: 'clothing' | 'electronics' | 'toiletry' | 'medicine' | 'document' | 'other'
  essential: boolean
  note?: string
}

export interface WeatherInfo {
  summary: string
  tempRange: string
  suggestion: string
}

export interface DailyForecast {
  date: string
  weekDay: string
  textDay: string
  tempMin: number
  tempMax: number
  humidity: number
  windScale: string
}

export interface SceneEquipment {
  scene: string
  label: string
  items: LuggageItem[]
}

export interface DestinationAlert {
  type: 'plug' | 'culture' | 'visa' | 'health' | 'currency'
  title: string
  description: string
  icon: string
}

export interface TravelGuide {
  teamId: string
  destination: string
  departureTime: number
  returnTime: number
  memberCount: number
  weather: WeatherInfo
  dailyForecast: DailyForecast[]
  luggageList: LuggageItem[]
  mustBring: string[]
  sceneEquipments: SceneEquipment[]
  alerts: DestinationAlert[]
  tips: string[]
  generatedAt: number
}
