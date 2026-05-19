<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { useCityStore } from '@/stores/city'
import { useBuddyStore } from '@/stores/buddy'

const historyStore = useHistoryStore()
const cityStore = useCityStore()
const buddyStore = useBuddyStore()

const discoveredCount = computed(() => historyStore.discoveredCount)
const favoriteCount = computed(() => historyStore.favorites.length)
const totalCities = computed(() => cityStore.allCities.length)

const menuItems = [
  { section: '我的服务', items: [
    { label: '搭子', icon: '🏕', desc: `${buddyStore.myTeams.length}个队伍`, path: '' },
    { label: '我的旅行规划', icon: '📋', desc: '制定你的旅行计划', path: '/pages/my-travel/my-travel' },
    { label: '我的消息', icon: '💬', desc: '', path: '/pages/my-messages/my-messages' },
  ]},
  { section: '更多', items: [
    { label: '收藏', icon: '♥', desc: `${favoriteCount.value}个城市`, path: '/pages/favorites/favorites' },
    { label: '历史', icon: '🕐', desc: `已探索${discoveredCount.value}城`, path: '/pages/history/history' },
    { label: '关于', icon: 'ℹ', desc: 'v1.0.0', path: '/pages/about/about' },
  ]},
]

function goPage(path: string) {
  if (!path) return
  uni.navigateTo({ url: path })
}
</script>

<template>
  <view class="page-mine">
    <!-- Custom Nav Bar -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="nav-title">我的</text>
      </view>
    </view>

    <!-- Profile Card -->
    <view class="profile-card">
      <view class="avatar">
        <text class="avatar-text">旅</text>
      </view>
      <view class="profile-info">
        <text class="profile-name">旅行者</text>
        <text class="profile-desc">已探索 {{ discoveredCount }}/{{ totalCities }} 座城市</text>
      </view>
    </view>

    <!-- Stats -->
    <view class="stats-row">
      <view class="stat-item">
        <text class="stat-value">{{ discoveredCount }}</text>
        <text class="stat-label">探索</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ favoriteCount }}</text>
        <text class="stat-label">收藏</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ buddyStore.myTeams.length }}</text>
        <text class="stat-label">队伍</text>
      </view>
    </view>

    <!-- Menu Sections -->
    <view v-for="section in menuItems" :key="section.section" class="menu-section">
      <text class="menu-section-title">{{ section.section }}</text>
      <view class="menu-list">
        <view
          v-for="item in section.items"
          :key="item.label"
          class="menu-item"
          @tap="goPage(item.path)"
        >
          <text class="menu-icon">{{ item.icon }}</text>
          <view class="menu-info">
            <text class="menu-label">{{ item.label }}</text>
            <text v-if="item.desc" class="menu-desc">{{ item.desc }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-mine {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 120rpx;
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

.profile-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  margin: 0 32rpx;
  margin-top: -12rpx;
  background-color: var(--bg-card);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 40rpx;
  color: #FFFFFF;
  font-weight: 700;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.profile-desc {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
  display: block;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 32rpx;
  margin: 20rpx 32rpx 0;
  background-color: var(--bg-card);
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 800;
  color: #FF6B35;
}

.stat-label {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
}

.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: var(--border-color);
}

.menu-section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.menu-section-title {
  font-size: 26rpx;
  color: var(--text-hint);
  font-weight: 600;
  margin-bottom: 12rpx;
  display: block;
}

.menu-list {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  width: 48rpx;
  text-align: center;
}

.menu-info {
  flex: 1;
}

.menu-label {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 500;
  display: block;
}

.menu-desc {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 2rpx;
  display: block;
}

.menu-arrow {
  font-size: 36rpx;
  color: var(--text-hint);
  margin-left: 8rpx;
}
</style>
