<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useHistoryStore } from '@/stores/history'
import { useCityStore } from '@/stores/city'
import type { ThemeMode } from '@/stores/user'

const userStore = useUserStore()
const historyStore = useHistoryStore()
const cityStore = useCityStore()

const themeOptions: { label: string; value: ThemeMode }[] = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' },
]

const currentTheme = computed(() => userStore.themeMode)

const discoveredCount = computed(() => historyStore.discoveredCount)
const totalCities = computed(() => cityStore.allCities.length)
const favoriteCount = computed(() => historyStore.favorites.length)

function setTheme(mode: ThemeMode) {
  userStore.setTheme(mode)
}

const badges = computed(() => {
  const count = discoveredCount.value
  return [
    { name: '初出茅庐', threshold: 10, unlocked: count >= 10 },
    { name: '行者无疆', threshold: 50, unlocked: count >= 50 },
    { name: '环游世界', threshold: 100, unlocked: count >= 100 },
    { name: '旅行大师', threshold: 200, unlocked: count >= 200 },
  ]
})
</script>

<template>
  <view class="page-about">
    <!-- App Info -->
    <view class="app-info">
      <view class="app-icon">
        <text class="app-icon-text">🎲</text>
      </view>
      <text class="app-name">旅游Tips</text>
      <text class="app-version">v1.0.0</text>
      <text class="app-desc">让命运选择你的下一站旅行目的地</text>
    </view>

    <!-- Stats -->
    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-value">{{ discoveredCount }}</text>
        <text class="stat-label">已探索</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ favoriteCount }}</text>
        <text class="stat-label">已收藏</text>
      </view>
      <view class="stat-divider" />
      <view class="stat-item">
        <text class="stat-value">{{ totalCities }}</text>
        <text class="stat-label">总城市</text>
      </view>
    </view>

    <!-- Badges -->
    <view class="section">
      <text class="section-title">探索成就</text>
      <view class="badges-grid">
        <view
          v-for="badge in badges"
          :key="badge.name"
          class="badge-item"
          :class="{ unlocked: badge.unlocked }"
        >
          <text class="badge-icon">{{ badge.unlocked ? '🏆' : '🔒' }}</text>
          <text class="badge-name">{{ badge.name }}</text>
          <text class="badge-threshold">{{ badge.threshold }}城</text>
        </view>
      </view>
    </view>

    <!-- Theme -->
    <view class="section">
      <text class="section-title">外观</text>
      <view class="theme-options">
        <view
          v-for="opt in themeOptions"
          :key="opt.value"
          class="theme-option"
          :class="{ active: currentTheme === opt.value }"
          @tap="setTheme(opt.value)"
        >
          <text class="theme-option-text" :class="{ active: currentTheme === opt.value }">{{ opt.label }}</text>
        </view>
      </view>
    </view>

    <!-- About -->
    <view class="section">
      <text class="section-title">关于</text>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">技术栈</text>
          <text class="info-value">UniApp + Vue3 + TypeScript</text>
        </view>
        <view class="info-item">
          <text class="info-label">数据来源</text>
          <text class="info-value">本地数据，无需联网</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-about {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 120rpx;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 32rpx;
}

.app-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.app-icon-text {
  font-size: 56rpx;
}

.app-name {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-primary);
}

.app-version {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
}

.app-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-top: 12rpx;
}

.stats-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 32rpx;
  margin: 0 32rpx;
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

.section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16rpx;
  display: block;
}

.badges-grid {
  display: flex;
  gap: 16rpx;
}

.badge-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 8rpx;
  border-radius: 16rpx;
  background-color: var(--bg-card);
  opacity: 0.5;
}

.badge-item.unlocked {
  opacity: 1;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.15);
}

.badge-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.badge-name {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.badge-threshold {
  font-size: 18rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
}

.theme-options {
  display: flex;
  gap: 16rpx;
}

.theme-option {
  flex: 1;
  padding: 16rpx;
  border-radius: 12rpx;
  background-color: var(--bg-card);
  border: 2rpx solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.theme-option.active {
  border-color: #FF6B35;
  background-color: rgba(255, 107, 53, 0.08);
}

.theme-option-text {
  font-size: 26rpx;
  color: var(--text-secondary);
}

.theme-option-text.active {
  color: #FF6B35;
  font-weight: 600;
}

.info-list {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  overflow: hidden;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: var(--text-secondary);
}

.info-value {
  font-size: 26rpx;
  color: var(--text-primary);
}
</style>
