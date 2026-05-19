<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { useCityStore } from '@/stores/city'

const historyStore = useHistoryStore()
const cityStore = useCityStore()

interface HistoryGroup {
  label: string
  entries: { cityId: string; timestamp: number }[]
}

const groupedHistory = computed<HistoryGroup[]>(() => {
  const now = Date.now()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.getTime()
  const yesterdayStart = todayStart - 86400000
  const weekStart = todayStart - 6 * 86400000

  const groups: HistoryGroup[] = [
    { label: '今天', entries: [] },
    { label: '昨天', entries: [] },
    { label: '本周', entries: [] },
    { label: '更早', entries: [] },
  ]

  for (const entry of historyStore.history) {
    if (entry.timestamp >= todayStart) {
      groups[0].entries.push(entry)
    } else if (entry.timestamp >= yesterdayStart) {
      groups[1].entries.push(entry)
    } else if (entry.timestamp >= weekStart) {
      groups[2].entries.push(entry)
    } else {
      groups[3].entries.push(entry)
    }
  }

  return groups.filter((g) => g.entries.length > 0)
})

function getCity(cityId: string) {
  return cityStore.getCityById(cityId)
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

function goToDetail(cityId: string) {
  uni.navigateTo({ url: `/pages/city-detail/city-detail?id=${cityId}` })
}

function deleteItem(timestamp: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyStore.removeFromHistory(timestamp)
      }
    },
  })
}

function clearAll() {
  uni.showModal({
    title: '清空历史',
    content: '确定要清空所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyStore.clearHistory()
      }
    },
  })
}
</script>

<template>
  <view class="page-history">
    <!-- Header -->
    <view v-if="historyStore.history.length > 0" class="header">
      <text class="header-title">共 {{ historyStore.history.length }} 条记录</text>
      <view class="clear-btn" @tap="clearAll">
        <text class="clear-text">清空</text>
      </view>
    </view>

    <!-- History List -->
    <view v-for="group in groupedHistory" :key="group.label" class="group">
      <text class="group-label">{{ group.label }}</text>
      <view
        v-for="(entry, i) in group.entries"
        :key="entry.timestamp"
        class="history-item"
        @tap="goToDetail(entry.cityId)"
        @longpress="deleteItem(entry.timestamp)"
      >
        <image
          v-if="getCity(entry.cityId)"
          class="item-image"
          :src="getCity(entry.cityId)!.heroImage"
          mode="aspectFill"
        />
        <view v-else class="item-image placeholder" />
        <view class="item-info">
          <text class="item-name">{{ getCity(entry.cityId)?.name || entry.cityId }}</text>
          <text class="item-time">{{ formatTime(entry.timestamp) }}</text>
        </view>
      </view>
    </view>

    <!-- Empty State -->
    <view v-if="historyStore.history.length === 0" class="empty-state">
      <text class="empty-icon">🎲</text>
      <text class="empty-text">还没有历史记录</text>
      <text class="empty-hint">去首页随机抽一个城市吧</text>
    </view>
  </view>
</template>

<style scoped>
.page-history {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 120rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
}

.header-title {
  font-size: 26rpx;
  color: var(--text-secondary);
}

.clear-btn {
  padding: 8rpx 24rpx;
}

.clear-text {
  font-size: 26rpx;
  color: #FF6B35;
}

.group {
  margin-bottom: 16rpx;
}

.group-label {
  display: block;
  padding: 16rpx 32rpx 8rpx;
  font-size: 24rpx;
  color: var(--text-hint);
  font-weight: 600;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  background-color: var(--bg-card);
  border-bottom: 1rpx solid var(--border-color);
}

.history-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
}

.item-image.placeholder {
  background-color: var(--bg-secondary);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.item-time {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
  display: block;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
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
