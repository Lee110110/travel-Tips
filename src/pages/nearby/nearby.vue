<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCityStore } from '@/stores/city'
import { useUserStore } from '@/stores/user'
import type { NearbyCity, NearbyAttraction } from '@/types/city'
import { formatDistance } from '@/utils/distance'

const userStore = useUserStore()
const cityStore = useCityStore()

const nearbyCities = computed<NearbyCity[]>(() => {
  if (!userStore.location) return []
  return cityStore.getNearbyCities(userStore.location, 800)
})

const nearbyAttractions = computed<NearbyAttraction[]>(() => {
  if (!userStore.location) return []
  return cityStore.getNearbyAttractions(userStore.location, 500)
})

onMounted(() => {
  if (!userStore.location && !userStore.locationLoading) {
    userStore.refreshLocation()
  }
})

function goToDetail(cityId: string) {
  uni.navigateTo({ url: `/pages/city-detail/city-detail?id=${cityId}` })
}

function retryLocation() {
  userStore.refreshLocation()
}
</script>

<template>
  <view class="page-nearby">
    <!-- Custom Nav Bar -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="nav-title">周边游</text>
        <text class="nav-subtitle">发现身边的美</text>
      </view>
      <view class="location-btn" @tap="retryLocation">
        <text class="location-text">{{ userStore.location ? '重新定位' : '获取定位' }}</text>
      </view>
    </view>

    <!-- Loading -->
    <view v-if="userStore.locationLoading" class="loading-state">
      <text class="loading-text">正在获取位置...</text>
    </view>

    <!-- Location Denied -->
    <view v-else-if="userStore.locationDenied" class="empty-state">
      <text class="empty-icon">📍</text>
      <text class="empty-text">无法获取位置</text>
      <text class="empty-hint">请授权位置权限后重试</text>
      <view class="retry-btn" @tap="retryLocation">
        <text class="retry-text">重新定位</text>
      </view>
    </view>

    <!-- No Location -->
    <view v-else-if="!userStore.location" class="empty-state">
      <text class="empty-icon">📍</text>
      <text class="empty-text">开启定位</text>
      <text class="empty-hint">获取位置后为你推荐周边好去处</text>
      <view class="retry-btn" @tap="retryLocation">
        <text class="retry-text">获取定位</text>
      </view>
    </view>

    <!-- Content -->
    <view v-else>
      <!-- Nearby Cities -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">周边城市</text>
          <text class="section-count">{{ nearbyCities.length }}个</text>
        </view>
        <scroll-view scroll-x class="city-scroll">
          <view class="city-list">
            <view
              v-for="city in nearbyCities"
              :key="city.id"
              class="city-card"
              @tap="goToDetail(city.id)"
            >
              <image class="city-image" :src="city.heroImage" mode="aspectFill" />
              <view class="city-info">
                <text class="city-name">{{ city.name }}</text>
                <text class="city-dist">{{ formatDistance(city.distance) }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        <view v-if="nearbyCities.length === 0" class="empty-section">
          <text class="empty-section-text">附近800km内暂无城市数据</text>
        </view>
      </view>

      <!-- Nearby Attractions -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">周边景点</text>
          <text class="section-count">{{ nearbyAttractions.length }}个</text>
        </view>
        <view class="attraction-list">
          <view
            v-for="(item, i) in nearbyAttractions.slice(0, 20)"
            :key="i"
            class="attraction-item"
          >
            <image class="attraction-image" :src="item.attraction.image" mode="aspectFill" />
            <view class="attraction-info">
              <text class="attraction-name">{{ item.attraction.name }}</text>
              <text class="attraction-city">{{ item.cityName }}</text>
            </view>
            <view class="attraction-dist">
              <text class="dist-text">{{ formatDistance(item.distance) }}</text>
            </view>
          </view>
        </view>
        <view v-if="nearbyAttractions.length === 0" class="empty-section">
          <text class="empty-section-text">附近500km内暂无景点数据</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-nearby {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.location-btn {
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 255, 255, 0.2);
}

.location-text {
  font-size: 22rpx;
  color: #FFFFFF;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: var(--text-hint);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.retry-btn {
  margin-top: 32rpx;
  padding: 16rpx 48rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
}

.retry-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.section {
  margin-top: 32rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.section-count {
  font-size: 24rpx;
  color: var(--text-hint);
}

.city-scroll {
  white-space: nowrap;
}

.city-list {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx;
}

.city-card {
  flex-shrink: 0;
  width: 240rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: var(--bg-card);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.city-image {
  width: 100%;
  height: 180rpx;
}

.city-info {
  padding: 16rpx;
}

.city-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.city-dist {
  font-size: 22rpx;
  color: #FF6B35;
  margin-top: 4rpx;
  display: block;
}

.attraction-list {
  padding: 0 32rpx;
}

.attraction-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid var(--border-color);
}

.attraction-item:last-child {
  border-bottom: none;
}

.attraction-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.attraction-info {
  flex: 1;
}

.attraction-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.attraction-city {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
  display: block;
}

.attraction-dist {
  flex-shrink: 0;
}

.dist-text {
  font-size: 24rpx;
  color: #FF6B35;
  font-weight: 600;
}

.empty-section {
  padding: 40rpx 0;
  text-align: center;
}

.empty-section-text {
  font-size: 26rpx;
  color: var(--text-hint);
}
</style>
