import type { TravelGuide, LuggageItem, WeatherInfo, BuddyTeam } from '@/types/city'
import { cities } from '@/data/cities'
import type { City } from '@/types/city'

const WEATHER_DB: Record<string, { summary: string; tempRange: string; suggestion: string }> = {
  '沙漠': { summary: '昼夜温差极大，白天炎热干燥，夜间寒冷', tempRange: '8°C ~ 38°C', suggestion: '准备防晒和保暖双重装备，白天注意防暑，夜晚加衣保暖' },
  '草原': { summary: '紫外线强，风力较大，早晚凉爽', tempRange: '10°C ~ 28°C', suggestion: '防晒霜和防风外套必备，建议携带润唇膏防止干燥' },
  '海边': { summary: '阳光充足，湿度较高，海风明显', tempRange: '20°C ~ 32°C', suggestion: '高倍防晒霜必备，注意防蚊虫，游泳注意安全' },
  '森林': { summary: '湿润多雨，温差适中，蚊虫较多', tempRange: '12°C ~ 25°C', suggestion: '雨具随身携带，穿长袖长裤防蚊虫，注意防滑' },
  '都市': { summary: '室内外温差大，空气质量变化', tempRange: '10°C ~ 30°C', suggestion: '穿可脱卸的外套，备口罩防雾霾，舒适步行鞋很重要' },
  '山地': { summary: '海拔每升高1000米气温下降6°C，紫外线强', tempRange: '0°C ~ 20°C', suggestion: '务必准备防寒衣物和防晒，高海拔注意高原反应' },
  '默认': { summary: '天气多变，建议出行前查看实时天气', tempRange: '10°C ~ 30°C', suggestion: '准备可应对多种天气的装备，关注天气变化' },
}

const SEASONAL_LUGGAGE: Record<string, LuggageItem[]> = {
  '冬季': [
    { name: '羽绒服/厚外套', category: 'clothing', essential: true },
    { name: '保暖内衣', category: 'clothing', essential: true },
    { name: '围巾手套帽子', category: 'clothing', essential: true },
    { name: '暖宝宝', category: 'other', essential: false, note: '贴身保暖神器' },
    { name: '保湿面霜', category: 'toiletry', essential: true },
  ],
  '夏季': [
    { name: '速干T恤', category: 'clothing', essential: true },
    { name: '防晒衣', category: 'clothing', essential: true },
    { name: '凉鞋/拖鞋', category: 'clothing', essential: false },
    { name: '防晒霜(SPF50+)', category: 'toiletry', essential: true },
    { name: '驱蚊液', category: 'toiletry', essential: true, note: '户外必备' },
  ],
  '春秋': [
    { name: '薄外套/风衣', category: 'clothing', essential: true },
    { name: '长袖衬衫', category: 'clothing', essential: true },
    { name: '雨伞/雨衣', category: 'other', essential: true },
    { name: '运动鞋', category: 'clothing', essential: true },
    { name: '薄围巾', category: 'clothing', essential: false },
  ],
}

const SCENE_LUGGAGE: Record<string, LuggageItem[]> = {
  'desert': [
    { name: '魔术头巾', category: 'clothing', essential: true, note: '防沙防尘' },
    { name: '墨镜', category: 'clothing', essential: true, note: '防强光和风沙' },
    { name: '水壶(1L+)', category: 'other', essential: true, note: '沙漠必须大量补水' },
    { name: '沙套/鞋套', category: 'clothing', essential: true, note: '防止沙子灌入鞋内' },
  ],
  'grassland': [
    { name: '防风外套', category: 'clothing', essential: true },
    { name: '望远镜', category: 'other', essential: false, note: '观景观鸟' },
    { name: '野餐垫', category: 'other', essential: false },
    { name: '驱蚊手环', category: 'toiletry', essential: true },
  ],
  'beach': [
    { name: '泳衣', category: 'clothing', essential: true },
    { name: '沙滩巾', category: 'clothing', essential: true },
    { name: '防水手机袋', category: 'electronics', essential: true, note: '保护手机' },
    { name: '浮潜面镜', category: 'other', essential: false, note: '如需浮潜' },
  ],
  'forest': [
    { name: '登山杖', category: 'other', essential: true, note: '防滑防摔' },
    { name: '速干裤(长裤)', category: 'clothing', essential: true, note: '防蚊防划' },
    { name: '头灯/手电', category: 'electronics', essential: true, note: '森林光线不足' },
    { name: '急救包', category: 'medicine', essential: true, note: '创可贴/消毒棉/绷带' },
  ],
}

const UNIVERSAL_LUGGAGE: LuggageItem[] = [
  { name: '身份证/护照', category: 'document', essential: true, note: '务必随身携带' },
  { name: '充电宝(20000mAh)', category: 'electronics', essential: true },
  { name: '常用药品', category: 'medicine', essential: true, note: '感冒药/肠胃药/止痛药' },
  { name: '洗漱包', category: 'toiletry', essential: true },
  { name: '零食和水', category: 'other', essential: false },
  { name: '保鲜袋/密封袋', category: 'other', essential: false, note: '分类收纳防潮' },
  { name: '行程单/门票凭证', category: 'document', essential: true, note: '电子版备份' },
]

function getSeason(month: number): string {
  if (month >= 12 || month <= 2) return '冬季'
  if (month >= 3 && month <= 5) return '春季'
  if (month >= 6 && month <= 8) return '夏季'
  return '秋季'
}

function getSeasonLuggageKey(season: string): string {
  if (season === '冬季') return '冬季'
  if (season === '夏季') return '夏季'
  return '春秋'
}

function detectSceneFromCity(city: City | undefined, dest: string): string {
  if (city) {
    if (city.types.includes('desert')) return 'desert'
    if (city.types.includes('grassland')) return 'grassland'
    if (city.types.includes('beach')) return 'beach'
    if (city.types.includes('forest')) return 'forest'
    if (city.types.includes('mountain')) return '山地'
    if (city.types.includes('city')) return '都市'
  }
  // Fallback: keyword matching on destination name
  const d = dest
  if (/沙漠|敦煌|吐鲁番|喀什|迪拜/.test(d)) return 'desert'
  if (/草原|呼伦贝尔|额尔古纳|满洲里|阿勒泰/.test(d)) return 'grassland'
  if (/海|三亚|厦门|青岛|普吉|巴厘|马尔代夫/.test(d)) return 'beach'
  if (/森林|九寨|版纳|甘孜|阿坝|喀纳斯/.test(d)) return 'forest'
  return '默认'
}

function getWeatherForScene(scene: string): WeatherInfo {
  return WEATHER_DB[scene] || WEATHER_DB['默认']
}

function generateMustBring(scene: string, season: string, city: City | undefined): string[] {
  const items: string[] = []

  if (scene === 'desert') {
    items.push('高倍防晒霜（沙漠紫外线极强）')
    items.push('充足饮用水（每人每天至少2L）')
    items.push('防沙眼镜或墨镜')
  }
  if (scene === 'grassland') {
    items.push('防风保暖外套')
    items.push('防蚊喷雾')
  }
  if (scene === 'beach') {
    items.push('防水防晒霜（SPF50+ PA+++）')
    items.push('防水手机袋')
  }
  if (scene === 'forest') {
    items.push('长袖长裤防蚊虫')
    items.push('雨具（森林多变天气）')
  }

  if (season === '冬季' || season === '春季') {
    items.push('保温杯')
    items.push('暖宝宝')
  }
  if (season === '夏季') {
    items.push('遮阳帽/遮阳伞')
    items.push('藿香正气水（防中暑）')
  }

  if (city) {
    const lat = Math.abs(city.latitude)
    if (lat > 35) items.push('保湿护肤品（北方干燥）')
    if (lat > 25 && lat < 35) items.push('雨伞（南方多雨）')
  }

  items.push('身份证原件（酒店/景区必查）')
  return [...new Set(items)]
}

function generateTips(scene: string, season: string, city: City | undefined, memberCount: number): string[] {
  const tips: string[] = []

  if (city?.travelTips && city.travelTips.length > 0) {
    tips.push(...city.travelTips.slice(0, 2))
  }

  if (memberCount >= 4) {
    tips.push(`${memberCount}人出行建议提前预订大桌餐厅和多人间住宿`)
    tips.push('建议使用群聊同步行程安排，避免走散')
  }

  if (scene === 'desert') {
    tips.push('沙漠中GPS信号可能不稳定，建议提前下载离线地图')
    tips.push('沙漠昼夜温差大，凌晨最冷，注意保暖')
  }
  if (scene === 'grassland') {
    tips.push('草原昼夜温差大，建议洋葱式穿搭')
  }
  if (scene === 'beach') {
    tips.push('下海游泳注意潮汐时间，远离离岸流')
    tips.push('海鲜建议选择正规餐厅，避免食物中毒')
  }
  if (scene === 'forest') {
    tips.push('森林中手机信号可能较弱，提前告知家人行程')
    tips.push('不要偏离标记步道，注意野生动物')
  }

  if (season === '冬季') {
    tips.push('冬季天黑较早，户外活动建议安排在上午')
  }

  tips.push('出行前购买旅行保险，以防意外')
  return tips
}

export function generateTravelGuide(team: BuddyTeam): TravelGuide {
  const destCity = cities.find(c =>
    c.name === team.destination || team.destination.includes(c.name)
  )

  const departMonth = new Date(team.departureTime).getMonth() + 1
  const season = getSeason(departMonth)

  const scene = detectSceneFromCity(destCity, team.destination)
  const weather = getWeatherForScene(scene)

  // Build luggage list
  const seasonKey = getSeasonLuggageKey(season)
  const seasonItems = SEASONAL_LUGGAGE[seasonKey] || SEASONAL_LUGGAGE['春秋']
  const sceneItems = SCENE_LUGGAGE[scene] || []

  const luggageMap = new Map<string, LuggageItem>()
  for (const item of [...UNIVERSAL_LUGGAGE, ...seasonItems, ...sceneItems]) {
    if (!luggageMap.has(item.name)) {
      luggageMap.set(item.name, item)
    }
  }

  const mustBring = generateMustBring(scene, season, destCity)
  const tips = generateTips(scene, season, destCity, team.currentMembers)

  return {
    teamId: team.id,
    destination: team.destination,
    departureTime: team.departureTime,
    returnTime: team.returnTime,
    memberCount: team.currentMembers,
    weather,
    luggageList: Array.from(luggageMap.values()),
    mustBring,
    tips,
    generatedAt: Date.now(),
  }
}
