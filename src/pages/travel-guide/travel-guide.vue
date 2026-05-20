<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow, onShareAppMessage } from '@dcloudio/uni-app'
import { useBuddyStore } from '@/stores/buddy'
import type { TravelGuide, LuggageItem, DestinationAlert } from '@/types/city'
import { getWeatherIcon } from '@/services/travel-guide'

const buddyStore = useBuddyStore()
const guide = ref<TravelGuide | null>(null)
const teamId = ref('')

const CATEGORY_LABELS: Record<LuggageItem['category'], string> = {
  clothing: '衣物', electronics: '电子', toiletry: '洗漱',
  medicine: '药品', document: '证件', other: '其他',
}
const CATEGORY_ICONS: Record<LuggageItem['category'], string> = {
  clothing: '👔', electronics: '📱', toiletry: '🧴',
  medicine: '💊', document: '📋', other: '🎒',
}

const ALERT_TYPE_LABELS: Record<DestinationAlert['type'], string> = {
  plug: '插头/电压',
  culture: '文化禁忌',
  visa: '签证提醒',
  health: '健康安全',
  currency: '货币/支付',
}

const ALERT_TYPE_COLORS: Record<DestinationAlert['type'], string> = {
  plug: '#6C5CE7',
  culture: '#E17055',
  visa: '#FDCB6E',
  health: '#00B894',
  currency: '#0984E3',
}

async function loadGuide() {
  if (!teamId.value) return
  // Load teams first if lists are empty (e.g. opened via shared link in new session)
  if (buddyStore.teamList.length === 0 && buddyStore.myTeams.length === 0) {
    await buddyStore.loadTeams()
  }
  const team = buddyStore.teamList.find(t => t.id === teamId.value)
    || buddyStore.myTeams.find(t => t.id === teamId.value)
  if (team) {
    buddyStore.generateGuideOnly(team)
    guide.value = buddyStore.getGuide(teamId.value) || null
  } else {
    guide.value = buddyStore.getGuide(teamId.value) || null
  }
}

onLoad((options) => {
  if (options?.teamId) {
    teamId.value = options.teamId
  }
})

onShow(() => {
  loadGuide()
})

onShareAppMessage(() => {
  if (guide.value) {
    return {
      title: `${guide.value.destination}出行指南 - AI旅行助手`,
      path: `/pages/travel-guide/travel-guide?teamId=${guide.value.teamId}`,
    }
  }
  return { title: 'AI旅行指南 - 搭伴', path: '/pages/buddy/buddy' }
})

function h5Share() {
  const shareData = {
    title: guide.value
      ? `${guide.value.destination}出行指南 - AI旅行助手`
      : 'AI旅行指南 - 搭伴',
    text: guide.value
      ? `${guide.value.destination}出行指南：天气、装备、行李清单一网打尽`
      : '找搭子，备行囊，说走就走',
    url: window.location.href,
  }
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    uni.setClipboardData({
      data: window.location.href,
      success: () => uni.showToast({ title: '链接已复制，快去分享吧', icon: 'none' }),
    })
  }
}

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

// Scene equipment items split into primary (essential) and secondary
const sceneEqDisplay = computed(() => {
  if (!guide.value) return []
  return guide.value.sceneEquipments.map(eq => {
    const primary = eq.items.filter(i => i.essential)
    const secondary = eq.items.filter(i => !i.essential)
    return { ...eq, primary, secondary }
  })
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
      <view class="share-wrap" @tap="h5Share">
        <button class="share-btn" open-type="share">
          <text class="share-btn-icon">↗</text>
        </button>
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
      <!-- Daily Forecast -->
      <view v-if="guide.dailyForecast.length > 0" class="daily-forecast">
        <view class="forecast-scroll">
          <view v-for="(day, i) in guide.dailyForecast" :key="i" class="forecast-day">
            <text class="forecast-date">{{ day.date }}</text>
            <text class="forecast-week">{{ day.weekDay }}</text>
            <text class="forecast-icon">{{ getWeatherIcon(day.textDay) }}</text>
            <text class="forecast-text">{{ day.textDay }}</text>
            <text class="forecast-temp">{{ day.tempMin }}°/{{ day.tempMax }}°</text>
            <text class="forecast-humidity">💧{{ day.humidity }}%</text>
            <text class="forecast-wind">{{ day.windScale }}</text>
          </view>
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

    <!-- Scene Equipment -->
    <view v-if="guide.sceneEquipments.length > 0" class="section">
      <view class="section-header">
        <text class="section-icon">🎯</text>
        <text class="section-title">场景装备推荐</text>
      </view>
      <view v-for="eq in sceneEqDisplay" :key="eq.scene" class="scene-eq-card">
        <view class="scene-eq-header">
          <text class="scene-eq-label">{{ eq.label }}</text>
        </view>
        <view class="scene-eq-items">
          <view v-for="item in eq.primary" :key="item.name" class="scene-eq-item primary">
            <view class="scene-eq-check">
              <text class="check-icon">☐</text>
            </view>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text v-if="item.note" class="item-note">{{ item.note }}</text>
            </view>
            <view class="essential-badge">
              <text class="essential-text">必带</text>
            </view>
          </view>
          <view v-if="eq.secondary.length > 0" class="secondary-divider">
            <text class="secondary-label">选带</text>
          </view>
          <view v-for="item in eq.secondary" :key="item.name" class="scene-eq-item secondary">
            <view class="scene-eq-check">
              <text class="check-icon">☐</text>
            </view>
            <view class="item-info">
              <text class="item-name secondary-name">{{ item.name }}</text>
              <text v-if="item.note" class="item-note">{{ item.note }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Destination Alerts -->
    <view v-if="guide.alerts.length > 0" class="section">
      <view class="section-header">
        <text class="section-icon">🛡</text>
        <text class="section-title">目的地出行提醒</text>
      </view>
      <view class="alert-list">
        <view v-for="(alert, i) in guide.alerts" :key="i" class="alert-card">
          <view class="alert-top">
            <text class="alert-icon">{{ alert.icon }}</text>
            <view class="alert-header-info">
              <text class="alert-title">{{ alert.title }}</text>
              <view class="alert-type-tag" :style="{ backgroundColor: ALERT_TYPE_COLORS[alert.type] + '15', borderColor: ALERT_TYPE_COLORS[alert.type] }">
                <text class="alert-type-text" :style="{ color: ALERT_TYPE_COLORS[alert.type] }">{{ ALERT_TYPE_LABELS[alert.type] }}</text>
              </view>
            </view>
          </view>
          <text class="alert-desc">{{ alert.description }}</text>
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

    <!-- Tips (after scene equipment) -->
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

.share-wrap {
  flex-shrink: 0;
}

.share-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  line-height: 1;
}

.share-btn::after {
  border: none;
}

.share-btn-icon {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 700;
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

/* Daily Forecast */
.daily-forecast {
  margin-top: 20rpx;
}

.forecast-scroll {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8rpx;
}

.forecast-day {
  flex-shrink: 0;
  width: 160rpx;
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.forecast-date {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.forecast-week {
  font-size: 20rpx;
  color: var(--text-hint);
}

.forecast-icon {
  font-size: 40rpx;
  margin: 4rpx 0;
}

.forecast-text {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.forecast-temp {
  font-size: 22rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.forecast-humidity {
  font-size: 20rpx;
  color: var(--text-hint);
}

.forecast-wind {
  font-size: 20rpx;
  color: var(--text-hint);
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

/* Scene Equipment */
.scene-eq-card {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.scene-eq-header {
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #6C5CE7, #A29BFE);
}

.scene-eq-label {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.scene-eq-items {
  padding: 0 24rpx;
}

.scene-eq-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border-color);
}

.scene-eq-item:last-child {
  border-bottom: none;
}

.scene-eq-item.secondary {
  padding: 14rpx 0;
}

.secondary-name {
  color: var(--text-secondary);
  font-size: 26rpx;
}

.secondary-divider {
  display: flex;
  align-items: center;
  padding: 8rpx 0 4rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.secondary-label {
  font-size: 20rpx;
  color: var(--text-hint);
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  background-color: var(--bg-secondary);
}

.scene-eq-check {
  flex-shrink: 0;
}

/* Destination Alerts */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.alert-card {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  border-left: 6rpx solid #6C5CE7;
}

.alert-top {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.alert-icon {
  font-size: 32rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.alert-header-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.alert-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.alert-type-tag {
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  border: 1rpx solid;
}

.alert-type-text {
  font-size: 18rpx;
  font-weight: 600;
}

.alert-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-left: 44rpx;
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
