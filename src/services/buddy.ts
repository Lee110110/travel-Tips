import type { BuddyTeam, BuddyApplication } from '@/types/city'

// Mock data store — replaced by real API later
const mockTeams: BuddyTeam[] = [
  {
    id: 't1', name: '3天2晚敦煌沙漠之旅', departure: '兰州', destination: '敦煌',
    departureTime: Date.now() + 7 * 86400000, returnTime: Date.now() + 10 * 86400000,
    maxMembers: 6, needApproval: true, creatorId: 'u1', creatorName: '沙漠行者',
    creatorAvatar: 'https://picsum.photos/seed/u1/100/100', currentMembers: 3,
    tags: ['沙漠', '摄影', '自驾'], description: '一起去看鸣沙山月牙泉，感受大漠孤烟直的壮美。', createdAt: Date.now() - 86400000, status: 'open',
  },
  {
    id: 't2', name: '呼伦贝尔草原深度游', departure: '北京', destination: '呼伦贝尔',
    departureTime: Date.now() + 14 * 86400000, returnTime: Date.now() + 19 * 86400000,
    maxMembers: 8, needApproval: false, creatorId: 'u2', creatorName: '草原牧歌',
    creatorAvatar: 'https://picsum.photos/seed/u2/100/100', currentMembers: 5,
    tags: ['草原', '骑马', '篝火'], description: '策马奔腾，看日出日落，体验蒙古包住宿。', createdAt: Date.now() - 2 * 86400000, status: 'open',
  },
  {
    id: 't3', name: '三亚海边度假小分队', departure: '上海', destination: '三亚',
    departureTime: Date.now() + 5 * 86400000, returnTime: Date.now() + 9 * 86400000,
    maxMembers: 4, needApproval: true, creatorId: 'u3', creatorName: '海边冲浪客',
    creatorAvatar: 'https://picsum.photos/seed/u3/100/100', currentMembers: 2,
    tags: ['海边', '冲浪', '潜水'], description: '冲浪、潜水、吃海鲜，享受阳光沙滩。', createdAt: Date.now() - 3600000, status: 'open',
  },
  {
    id: 't4', name: '九寨沟森林徒步', departure: '成都', destination: '九寨沟',
    departureTime: Date.now() + 10 * 86400000, returnTime: Date.now() + 13 * 86400000,
    maxMembers: 6, needApproval: true, creatorId: 'u4', creatorName: '山林探险家',
    creatorAvatar: 'https://picsum.photos/seed/u4/100/100', currentMembers: 4,
    tags: ['森林', '徒步', '摄影'], description: '深入原始森林，探访童话世界九寨沟。', createdAt: Date.now() - 3 * 86400000, status: 'open',
  },
  {
    id: 't5', name: '新疆沙漠公路穿越', departure: '乌鲁木齐', destination: '喀什',
    departureTime: Date.now() + 20 * 86400000, returnTime: Date.now() + 28 * 86400000,
    maxMembers: 5, needApproval: true, creatorId: 'u5', creatorName: '丝路旅人',
    creatorAvatar: 'https://picsum.photos/seed/u5/100/100', currentMembers: 3,
    tags: ['沙漠', '自驾', '人文'], description: '沿着沙漠公路一路向西，探访古丝绸之路遗迹。', createdAt: Date.now() - 5 * 86400000, status: 'open',
  },
  {
    id: 't6', name: '青岛海边周末游', departure: '济南', destination: '青岛',
    departureTime: Date.now() + 3 * 86400000, returnTime: Date.now() + 5 * 86400000,
    maxMembers: 6, needApproval: false, creatorId: 'u6', creatorName: '啤酒爱好者',
    creatorAvatar: 'https://picsum.photos/seed/u6/100/100', currentMembers: 6,
    tags: ['海边', '美食', '啤酒'], description: '喝啤酒吃海鲜，栈桥看日落。', createdAt: Date.now() - 43200000, status: 'full',
  },
]

let idCounter = 100

export async function fetchTeams(params: {
  tab: 'hot' | 'latest' | 'nearby'
  page?: number
  pageSize?: number
}): Promise<{ list: BuddyTeam[]; total: number }> {
  // Mock: sort by tab type
  await delay(300)
  let sorted = [...mockTeams]
  if (params.tab === 'hot') {
    sorted.sort((a, b) => b.currentMembers - a.currentMembers)
  } else if (params.tab === 'latest') {
    sorted.sort((a, b) => b.createdAt - a.createdAt)
  }
  // 'nearby' would need location — return same list for mock
  return { list: sorted, total: sorted.length }
}

export async function createTeam(data: Omit<BuddyTeam, 'id' | 'creatorId' | 'creatorName' | 'creatorAvatar' | 'currentMembers' | 'createdAt' | 'status'>): Promise<BuddyTeam> {
  await delay(200)
  const team: BuddyTeam = {
    ...data,
    id: `t${++idCounter}`,
    creatorId: 'me',
    creatorName: '我',
    creatorAvatar: 'https://picsum.photos/seed/me/100/100',
    currentMembers: 1,
    createdAt: Date.now(),
    status: 'open',
  }
  mockTeams.unshift(team)
  return team
}

export async function closeTeam(teamId: string): Promise<void> {
  await delay(200)
  const team = mockTeams.find(t => t.id === teamId)
  if (team) team.status = 'closed'
}

export async function applyToJoin(teamId: string, message: string): Promise<BuddyApplication> {
  await delay(200)
  const app: BuddyApplication = {
    id: `a${++idCounter}`,
    teamId,
    applicantId: 'me',
    applicantName: '我',
    applicantAvatar: 'https://picsum.photos/seed/me/100/100',
    message,
    status: 'pending',
    createdAt: Date.now(),
  }
  return app
}

export async function fetchMyTeams(): Promise<BuddyTeam[]> {
  await delay(200)
  return mockTeams.filter(t => t.creatorId === 'me')
}

export async function fetchMyApplications(): Promise<BuddyApplication[]> {
  await delay(200)
  return []
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
