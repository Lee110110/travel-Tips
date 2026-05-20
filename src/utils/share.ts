import type { City } from '@/types/city'

export function getShareMessage(city: City | null) {
  if (city) {
    return {
      title: `我随机抽到了${city.name}，你也来试试！`,
      path: '/pages/depart/depart',
      imageUrl: city.heroImage,
    }
  }
  return {
    title: '搭伴 - 让命运选择你的下一站',
    path: '/pages/depart/depart',
  }
}
