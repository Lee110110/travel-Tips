<script setup lang="ts">
import { onMounted } from 'vue'
import { useBuddyStore } from '@/stores/buddy'
import type { BuddyTeam } from '@/types/city'

const buddyStore = useBuddyStore()

const tabs: { key: 'hot' | 'latest' | 'nearby'; label: string }[] = [
  { key: 'hot', label: '热门' },
  { key: 'latest', label: '最新' },
  { key: 'nearby', label: '附近' },
]

onMounted(() => {
  buddyStore.loadTeams()
})

function formatDateRange(team: BuddyTeam): string {
  const d1 = new Date(team.departureTime)
  const d2 = new Date(team.returnTime)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(d1)} - ${fmt(d2)}`
}

function goCreate() {
  uni.navigateTo({ url: '/pages/buddy-create/buddy-create' })
}

function goDetail(teamId: string) {
  uni.navigateTo({ url: `/pages/buddy-detail/buddy-detail?id=${teamId}` })
}
</script>

<template>
  <view class="page-buddy">
    <!-- Custom Nav Bar -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="nav-title">搭子</text>
        <text class="nav-subtitle">找到志同道合的旅伴</text>
      </view>
    </view>

    <!-- Sub Tabs -->
    <view class="sub-tabs">
      <view
        v-for="tab in tabs"
        :key="tab.key"
        class="sub-tab"
        :class="{ active: buddyStore.currentTab === tab.key }"
        @tap="buddyStore.setTab(tab.key)"
      >
        <text class="sub-tab-text" :class="{ active: buddyStore.currentTab === tab.key }">{{ tab.label }}</text>
      </view>
    </view>

    <!-- Team List -->
    <view class="team-list">
      <view
        v-for="team in buddyStore.teamList"
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
      </view>

      <!-- Empty -->
      <view v-if="!buddyStore.loading && buddyStore.teamList.length === 0" class="empty-state">
        <text class="empty-icon">🏕</text>
        <text class="empty-text">暂无队伍</text>
        <text class="empty-hint">成为第一个发起组队的人吧</text>
      </view>
    </view>

    <!-- FAB -->
    <view class="fab" @tap="goCreate">
      <text class="fab-text">+</text>
    </view>
  </view>
</template>

<style scoped>
.page-buddy {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 160rpx;
}

.nav-bar {
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  padding-top: env(safe-area-inset-top);
  padding-bottom: 24rpx;
  padding-left: 32rpx;
  padding-right: 32rpx;
}

.nav-content {
  display: flex;
  flex-direction: column;
}

.nav-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #FFFFFF;
}

.nav-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.sub-tabs {
  display: flex;
  padding: 16rpx 32rpx;
  gap: 32rpx;
}

.sub-tab {
  padding-bottom: 8rpx;
  border-bottom: 4rpx solid transparent;
}

.sub-tab.active {
  border-bottom-color: #FF6B35;
}

.sub-tab-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  font-weight: 500;
}

.sub-tab-text.active {
  color: #FF6B35;
  font-weight: 700;
}

.team-list {
  padding: 0 32rpx;
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

.status-badge.full {
  background-color: rgba(0, 0, 0, 0.06);
}

.status-badge.closed {
  background-color: rgba(0, 0, 0, 0.06);
}

.status-text {
  font-size: 20rpx;
  color: #FF6B35;
  font-weight: 600;
}

.status-badge.full .status-text,
.status-badge.closed .status-text {
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

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(255, 107, 53, 0.4);
  z-index: 100;
}

.fab-text {
  font-size: 56rpx;
  color: #FFFFFF;
  font-weight: 300;
  margin-top: -4rpx;
}
</style>
