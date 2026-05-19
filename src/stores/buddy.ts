import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BuddyTeam, BuddyApplication, TravelGuide } from '@/types/city'
import { fetchTeams, createTeam as apiCreateTeam, applyToJoin as apiApplyToJoin, closeTeam as apiCloseTeam, fetchMyTeams, fetchMyApplications } from '@/services/buddy'
import { generateTravelGuide } from '@/services/travel-guide'

export const useBuddyStore = defineStore('buddy', () => {
  const teamList = ref<BuddyTeam[]>([])
  const myTeams = ref<BuddyTeam[]>([])
  const myApplications = ref<BuddyApplication[]>([])
  const loading = ref(false)
  const currentTab = ref<'hot' | 'latest' | 'nearby'>('hot')
  const guideMap = ref<Record<string, TravelGuide>>({})

  async function loadTeams() {
    loading.value = true
    try {
      const res = await fetchTeams({ tab: currentTab.value })
      teamList.value = res.list
    } finally {
      loading.value = false
    }
  }

  async function createTeam(data: Parameters<typeof apiCreateTeam>[0]) {
    return await apiCreateTeam(data)
  }

  async function applyJoin(teamId: string, message: string) {
    const app = await apiApplyToJoin(teamId, message)
    myApplications.value.push(app)
    return app
  }

  async function closeTeamAndGenerateGuide(team: BuddyTeam): Promise<TravelGuide> {
    await apiCloseTeam(team.id)
    team.status = 'closed'
    const guide = generateTravelGuide(team)
    guideMap.value[team.id] = guide
    return guide
  }

  function getGuide(teamId: string): TravelGuide | undefined {
    return guideMap.value[teamId]
  }

  async function loadMyTeams() {
    myTeams.value = await fetchMyTeams()
  }

  async function loadMyApplications() {
    myApplications.value = await fetchMyApplications()
  }

  function setTab(tab: 'hot' | 'latest' | 'nearby') {
    currentTab.value = tab
    loadTeams()
  }

  return {
    teamList,
    myTeams,
    myApplications,
    loading,
    currentTab,
    guideMap,
    loadTeams,
    createTeam,
    applyJoin,
    closeTeamAndGenerateGuide,
    getGuide,
    loadMyTeams,
    loadMyApplications,
    setTab,
  }
})
