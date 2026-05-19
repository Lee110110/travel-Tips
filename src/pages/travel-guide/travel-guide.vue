<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useBuddyStore } from '@/stores/buddy'
import type { TravelGuide, LuggageItem } from '@/types/city'

const buddyStore = useBuddyStore()
const guide = ref<TravelGuide | null>(null)

const CATEGORY_LABELS: Record<LuggageItem['category'], string> = {
  clothing: '衣物', electronics: '电子', toiletry: '洗漱',
  medicine: '药品', document: '证件', other: '其他',
}
const CATEGORY_ICONS: Record<LuggageItem['category'], string> = {
  clothing: '👔', electronics: '📱', toiletry: '🧴',
  medicine: '💊', document: '📋', other: '🎒',
}

onLoad((options) => {
  if (options?.teamId) {
    guide.value = buddyStore.getGuide(options.teamId) || null
  }
})

const groupedLuggage = computed(() => {
  if (!guide.value) return []
  const groups: Record<string, LuggageItem[]> = {}
  for (const item of guide.value.luggageList) {
    const cat = item.category
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
  }
  return Object.entries(groups).map(([cat, items]) => ({
    category: cat as LuggageItem['category'],
    label: CATEGORY_LABELS[cat as LuggageItem['category']],
    icon: CATEGORY_ICONS[cat as LuggageItem['category']],
    items,
  }))
})

const dateRange = computed(() => {
  if (!guide.value) return ''
  const fmt = (ts: number) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }
  return `${fmt(guide.value.departureTime)} - ${fmt(guide.value.returnTime)}`
})
</script>

<template>
  <view v-if="guide" class="page-guide">
    <!-- AI Banner -->
    <view class="ai-banner">
      <text class="ai-icon">🤖</text>
      <view class="ai-info">
        <text class="ai-title">AI 旅行助手</text>
        <text class="ai-desc">已为{{ guide.memberCount }}人小队生成出行指南</text>
      </view>
    </view>

    <!-- Destination Summary -->
    <view class="summary-card">
      <text class="summary-dest">{{ guide.destination }}</text>
      <text class="summary-date">📅 {{ dateRange }}</text>
      <text class="summary-members">👥 {{ guide.memberCount }}人同行</text>
    </view>

    <!-- Weather -->
    <view class="section">
      <view class="section-header">
        <text class="section-icon">🌤</text>
        <text class="section-title">天气情况</text>
      </view>
      <view class="weather-card">
        <text class="weather-summary">{{ guide.weather.summary }}</text>
        <view class="weather-row">
          <text class="weather-label">温度范围</text>
          <text class="weather-value">{{ guide.weather.tempRange }}</text>
        </view>
        <view class="weather-suggestion">
          <text class="suggestion-text">💡 {{ guide.weather.suggestion }}</text>
        </view>
      </view>
    </view>

    <!-- Must Bring -->
    <view v-if="guide.mustBring.length > 0" class="section">
      <view class="section-header">
        <text class="section-icon">⚠️</text>
        <text class="section-title">必带物品</text>
      </view>
      <view class="must-bring-list">
        <view v-for="(item, i) in guide.mustBring" :key="i" class="must-bring-item">
          <text class="must-bullet">❗</text>
          <text class="must-text">{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- Luggage List -->
    <view class="section">
      <view class="section-header">
        <text class="section-icon">🧳</text>
        <text class="section-title">行李清单</text>
        <text class="section-count">共{{ guide.luggageList.length }}项</text>
      </view>
      <view v-for="group in groupedLuggage" :key="group.category" class="luggage-group">
        <view class="group-header">
          <text class="group-icon">{{ group.icon }}</text>
          <text class="group-label">{{ group.label }}</text>
        </view>
        <view class="group-items">
          <view v-for="item in group.items" :key="item.name" class="luggage-item">
            <view class="item-check">
              <text class="check-icon">☐</text>
            </view>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text v-if="item.note" class="item-note">{{ item.note }}</text>
            </view>
            <view v-if="item.essential" class="essential-badge">
              <text class="essential-text">必带</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Tips -->
    <view v-if="guide.tips.length > 0" class="section">
      <view class="section-header">
        <text class="section-icon">💡</text>
        <text class="section-title">出行贴士</text>
      </view>
      <view class="tips-list">
        <view v-for="(tip, i) in guide.tips" :key="i" class="tip-item">
          <text class="tip-bullet">•</text>
          <text class="tip-text">{{ tip }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-space" />
  </view>

  <!-- No guide -->
  <view v-else class="page-empty">
    <text class="empty-icon">🤖</text>
    <text class="empty-text">暂无旅行指南</text>
    <text class="empty-hint">关闭组队后AI将自动生成</text>
  </view>
</template>

<style scoped>
.page-guide {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 60rpx;
}

.ai-banner {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 32rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
}

.ai-icon {
  font-size: 48rpx;
}

.ai-info {
  flex: 1;
}

.ai-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #FFFFFF;
  display: block;
}

.ai-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
  display: block;
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx;
  margin: 0 32rpx;
  margin-top: -16rpx;
  background-color: var(--bg-card);
  border-radius: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
}

.summary-dest {
  font-size: 44rpx;
  font-weight: 800;
  color: var(--text-primary);
}

.summary-date {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-top: 12rpx;
}

.summary-members {
  font-size: 28rpx;
  color: #FF6B35;
  margin-top: 8rpx;
  font-weight: 600;
}

.section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

.section-icon {
  font-size: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.section-count {
  font-size: 24rpx;
  color: var(--text-hint);
}

.weather-card {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 24rpx;
}

.weather-summary {
  font-size: 28rpx;
  color: var(--text-primary);
  line-height: 1.6;
  display: block;
  margin-bottom: 16rpx;
}

.weather-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
  border-top: 1rpx solid var(--border-color);
}

.weather-label {
  font-size: 26rpx;
  color: var(--text-secondary);
}

.weather-value {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.weather-suggestion {
  padding-top: 12rpx;
  border-top: 1rpx solid var(--border-color);
}

.suggestion-text {
  font-size: 26rpx;
  color: #FF6B35;
  line-height: 1.6;
}

.must-bring-list {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 8rpx 24rpx;
}

.must-bring-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid var(--border-color);
}

.must-bring-item:last-child {
  border-bottom: none;
}

.must-bullet {
  color: #FF6B35;
  font-size: 24rpx;
  margin-top: 2rpx;
}

.must-text {
  font-size: 28rpx;
  color: var(--text-primary);
  flex: 1;
  line-height: 1.5;
}

.luggage-group {
  margin-bottom: 20rpx;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.group-icon {
  font-size: 28rpx;
}

.group-label {
  font-size: 26rpx;
  color: var(--text-hint);
  font-weight: 600;
}

.group-items {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 0 24rpx;
}

.luggage-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border-color);
}

.luggage-item:last-child {
  border-bottom: none;
}

.item-check {
  flex-shrink: 0;
}

.check-icon {
  font-size: 28rpx;
  color: var(--text-hint);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 28rpx;
  color: var(--text-primary);
  display: block;
}

.item-note {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 2rpx;
  display: block;
}

.essential-badge {
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  flex-shrink: 0;
}

.essential-text {
  font-size: 18rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.tips-list {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
}

.tip-item {
  display: flex;
  gap: 12rpx;
  padding: 12rpx 0;
}

.tip-item:last-child {
  padding-bottom: 0;
}

.tip-bullet {
  color: #FF6B35;
  font-size: 28rpx;
  line-height: 1.6;
}

.tip-text {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.bottom-space {
  height: 40rpx;
}

.page-empty {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
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
