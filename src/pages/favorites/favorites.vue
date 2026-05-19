<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { useCityStore } from '@/stores/city'
import type { City } from '@/types/city'
import { CITY_TYPE_LABELS } from '@/types/city'

const historyStore = useHistoryStore()
const cityStore = useCityStore()

const favoriteCities = computed<City[]>(() => {
  return historyStore.favorites
    .map((id) => cityStore.getCityById(id))
    .filter((c): c is City => c !== undefined)
})

function goToDetail(city: City) {
  uni.navigateTo({ url: `/pages/city-detail/city-detail?id=${city.id}` })
}

function unfavorite(city: City) {
  uni.showModal({
    title: '取消收藏',
    content: `确定要取消收藏${city.name}吗？`,
    success: (res) => {
      if (res.confirm) {
        historyStore.toggleFavorite(city.id)
      }
    },
  })
}
</script>

<template>
  <view class="page-favorites">
    <!-- Grid -->
    <view v-if="favoriteCities.length > 0" class="city-grid">
      <view
        v-for="city in favoriteCities"
        :key="city.id"
        class="city-card"
        @tap="goToDetail(city)"
      >
        <image class="card-image" :src="city.heroImage" mode="aspectFill" />
        <view class="card-overlay">
          <text class="card-name">{{ city.name }}</text>
          <view class="card-tags">
            <text class="card-tag">{{ city.region === 'domestic' ? '国内' : '国外' }}</text>
          </view>
        </view>
        <view class="card-fav" @tap.stop="unfavorite(city)">
          <text class="fav-icon">♥</text>
        </view>
      </view>
    </view>

    <!-- Empty State -->
    <view v-else class="empty-state">
      <text class="empty-icon">♡</text>
      <text class="empty-text">还没有收藏城市</text>
      <text class="empty-hint">随机抽一个试试吧！</text>
    </view>
  </view>
</template>

<style scoped>
.page-favorites {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 16rpx;
  padding-bottom: 120rpx;
}

.city-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.city-card {
  position: relative;
  width: calc(50% - 8rpx);
  border-radius: 16rpx;
  overflow: hidden;
  background-color: var(--bg-card);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-image {
  width: 100%;
  height: 260rpx;
}

.card-overlay {
  padding: 16rpx;
}

.card-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
  display: block;
}

.card-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 8rpx;
}

.card-tag {
  font-size: 20rpx;
  color: #FF6B35;
  padding: 2rpx 10rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.1);
}

.card-fav {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-icon {
  font-size: 28rpx;
  color: #FF8585;
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
  color: var(--text-hint);
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
