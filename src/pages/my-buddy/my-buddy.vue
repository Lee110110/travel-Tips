<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBuddyStore } from '@/stores/buddy'
import type { BuddyTeam } from '@/types/city'

const buddyStore = useBuddyStore()
const currentTab = ref<'created' | 'joined'>('created')

onMounted(() => {
  buddyStore.loadMyTeams()
  buddyStore.loadMyApplications()
})

const createdTeams = computed(() => buddyStore.myTeams.filter(t => t.creatorId === 'me'))
const joinedTeams = computed(() => buddyStore.myTeams.filter(t => t.creatorId !== 'me'))

const displayTeams = computed(() => {
  return currentTab.value === 'created' ? createdTeams.value : joinedTeams.value
})

const hasGuide = (team: BuddyTeam) => !!buddyStore.getGuide(team.id)

function formatDateRange(team: BuddyTeam): string {
  const fmt = (ts: number) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }
  return `${fmt(team.departureTime)} - ${fmt(team.returnTime)}`
}

function goDetail(teamId: string) {
  uni.navigateTo({ url: `/pages/buddy-detail/buddy-detail?id=${teamId}` })
}

function goGuide(teamId: string) {
  uni.navigateTo({ url: `/pages/travel-guide/travel-guide?teamId=${teamId}` })
}
</script>

<template>
  <view class="page-my-buddy">
    <!-- Sub Tabs -->
    <view class="sub-tabs">
      <view
        class="sub-tab"
        :class="{ active: currentTab === 'created' }"
        @tap="currentTab = 'created'"
      >
        <text class="sub-tab-text" :class="{ active: currentTab === 'created' }">我创建的</text>
        <text class="sub-tab-count">{{ createdTeams.length }}</text>
      </view>
      <view
        class="sub-tab"
        :class="{ active: currentTab === 'joined' }"
        @tap="currentTab = 'joined'"
      >
        <text class="sub-tab-text" :class="{ active: currentTab === 'joined' }">我加入的</text>
        <text class="sub-tab-count">{{ joinedTeams.length }}</text>
      </view>
    </view>

    <!-- Team List -->
    <view class="team-list">
      <view
        v-for="team in displayTeams"
        :key="team.id"
        class="team-card"
        @tap="goDetail(team.id)"
      >
        <view class="team-header">
          <image class="creator-avatar" :src="team.creatorAvatar" mode="aspectFill" />
          <text class="creator-name">{{ team.creatorName }}</text>
          <view class="status-badge" :class="team.status">
            <text class="status-text">{{ team.status === 'open' ? '招募中' : team.status === 'full' ? '已满' : '已关闭' }}</text>
          </view>
        </view>
        <text class="team-name">{{ team.name }}</text>
        <view class="team-route">
          <text class="route-text">{{ team.departure }}</text>
          <text class="route-arrow">→</text>
          <text class="route-text">{{ team.destination }}</text>
        </view>
        <view class="team-meta">
          <text class="meta-text">📅 {{ formatDateRange(team) }}</text>
          <text class="meta-text">👥 {{ team.currentMembers }}/{{ team.maxMembers }}人</text>
        </view>
        <view v-if="team.tags.length > 0" class="team-tags">
          <text v-for="tag in team.tags" :key="tag" class="team-tag">{{ tag }}</text>
        </view>
        <view v-if="hasGuide(team)" class="guide-entry" @tap.stop="goGuide(team.id)">
          <text class="guide-entry-text">🤖 查看AI旅行指南</text>
          <text class="guide-entry-arrow">›</text>
        </view>
      </view>

      <!-- Empty -->
      <view v-if="displayTeams.length === 0" class="empty-state">
        <text class="empty-icon">{{ currentTab === 'created' ? '🏕' : '👋' }}</text>
        <text class="empty-text">{{ currentTab === 'created' ? '还没有创建队伍' : '还没有加入队伍' }}</text>
        <text class="empty-hint">{{ currentTab === 'created' ? '去搭子广场发起组队吧' : '去搭子广场找到你的旅伴' }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-my-buddy {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 40rpx;
}

.sub-tabs {
  display: flex;
  padding: 24rpx 32rpx 0;
  gap: 40rpx;
}

.sub-tab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-bottom: 12rpx;
  border-bottom: 4rpx solid transparent;
}

.sub-tab.active {
  border-bottom-color: #FF6B35;
}

.sub-tab-text {
  font-size: 30rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.sub-tab-text.active {
  color: #FF6B35;
  font-weight: 700;
}

.sub-tab-count {
  font-size: 22rpx;
  color: #FF6B35;
  background-color: rgba(255, 107, 53, 0.1);
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  font-weight: 600;
}

.team-list {
  padding: 20rpx 32rpx 0;
}

.team-card {
  background-color: var(--bg-card);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.team-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.creator-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
}

.creator-name {
  font-size: 26rpx;
  color: var(--text-secondary);
  flex: 1;
}

.status-badge {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.1);
}

.status-badge.full, .status-badge.closed {
  background-color: rgba(0, 0, 0, 0.06);
}

.status-text {
  font-size: 20rpx;
  color: #FF6B35;
  font-weight: 600;
}

.status-badge.full .status-text, .status-badge.closed .status-text {
  color: var(--text-hint);
}

.team-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
  margin-bottom: 12rpx;
}

.team-route {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.route-text {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.route-arrow {
  font-size: 28rpx;
  color: #FF6B35;
}

.team-meta {
  display: flex;
  gap: 24rpx;
  margin-bottom: 12rpx;
}

.meta-text {
  font-size: 24rpx;
  color: var(--text-secondary);
}

.team-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.team-tag {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.08);
  font-size: 20rpx;
  color: #FF6B35;
}

.guide-entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid var(--border-color);
}

.guide-entry-text {
  font-size: 26rpx;
  color: #6C5CE7;
  font-weight: 600;
}

.guide-entry-arrow {
  font-size: 28rpx;
  color: #6C5CE7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.empty-hint {
  font-size: 26rpx;
  color: var(--text-hint);
  margin-top: 8rpx;
}
</style>
