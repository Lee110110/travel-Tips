<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onPageScroll, onShareAppMessage } from '@dcloudio/uni-app'
import { useCityStore } from '@/stores/city'
import { useHistoryStore } from '@/stores/history'
import type { City } from '@/types/city'
import { CITY_TYPE_LABELS } from '@/types/city'
import AttractionList from '@/components/AttractionList/AttractionList.vue'
import FoodList from '@/components/FoodList/FoodList.vue'

const cityStore = useCityStore()
const historyStore = useHistoryStore()

const city = ref<City | null>(null)
const parallaxOffset = ref(0)
const isFav = computed(() => city.value ? historyStore.isFavorite(city.value.id) : false)

onLoad((options) => {
  if (options?.id) {
    const found = cityStore.getCityById(options.id)
    if (found) {
      city.value = found
    }
  }
})

onPageScroll((e) => {
  parallaxOffset.value = Math.min(e.scrollTop * 0.4, 150)
})

onShareAppMessage(() => {
  if (!city.value) {
    return { title: '旅游Tips', path: '/pages/index/index' }
  }
  return {
    title: `我随机抽到了${city.value.name}，一起去旅行吧！`,
    path: `/pages/city-detail/city-detail?id=${city.value.id}`,
    imageUrl: city.value.heroImage,
  }
})

function toggleFav() {
  if (city.value) {
    historyStore.toggleFavorite(city.value.id)
  }
}

function openFlights() {
  if (!city.value) return
  uni.setClipboardData({
    data: `${city.value.name} 机票`,
    success: () => {
      uni.showToast({ title: '已复制搜索关键词', icon: 'none' })
    },
  })
}

function openHotels() {
  if (!city.value) return
  uni.setClipboardData({
    data: `${city.value.name} 酒店`,
    success: () => {
      uni.showToast({ title: '已复制搜索关键词', icon: 'none' })
    },
  })
}

function openWeather() {
  if (!city.value) return
  uni.setClipboardData({
    data: `${city.value.name} 天气`,
    success: () => {
      uni.showToast({ title: '已复制搜索关键词', icon: 'none' })
    },
  })
}

function openGuide() {
  if (!city.value) return
  uni.setClipboardData({
    data: `${city.value.name} 旅游攻略`,
    success: () => {
      uni.showToast({ title: '已复制搜索关键词', icon: 'none' })
    },
  })
}

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view v-if="city" class="page-detail">
    <!-- Hero Section -->
    <view class="hero-section">
      <image
        class="hero-image"
        :src="city.heroImage"
        mode="aspectFill"
        :style="{ transform: `translateY(${parallaxOffset}rpx)` }"
      />
      <view class="hero-overlay" />
      <view class="hero-content">
        <view class="hero-tags">
          <text class="hero-tag">{{ city.region === 'domestic' ? '国内' : '国外' }}</text>
          <text v-for="t in city.types" :key="t" class="hero-tag">{{ CITY_TYPE_LABELS[t] }}</text>
        </view>
        <text class="hero-city-name">{{ city.name }}</text>
        <text class="hero-city-en">{{ city.nameEn }}</text>
      </view>
      <!-- Fav Button -->
      <view class="fav-btn" @tap="toggleFav">
        <text class="fav-icon">{{ isFav ? '♥' : '♡' }}</text>
      </view>
      <!-- Back Button -->
      <view class="back-btn" @tap="goBack">
        <text class="back-icon">‹</text>
      </view>
    </view>

    <!-- Overview Grid -->
    <view class="overview-grid">
      <view v-if="city.population" class="overview-item">
        <text class="overview-label">人口</text>
        <text class="overview-value">{{ city.population }}</text>
      </view>
      <view v-if="city.climate" class="overview-item">
        <text class="overview-label">气候</text>
        <text class="overview-value">{{ city.climate }}</text>
      </view>
      <view v-if="city.bestSeason" class="overview-item">
        <text class="overview-label">最佳季节</text>
        <text class="overview-value">{{ city.bestSeason }}</text>
      </view>
      <view v-if="city.avgBudget.label" class="overview-item">
        <text class="overview-label">预算</text>
        <text class="overview-value">{{ city.avgBudget.label }} ¥{{ city.avgBudget.dailyMin }}-{{ city.avgBudget.dailyMax }}/天</text>
      </view>
    </view>

    <!-- Description -->
    <view class="description-section">
      <text class="description-text">{{ city.description }}</text>
    </view>

    <!-- Travel Services -->
    <view class="services-section">
      <view class="section-header">
        <text class="section-title">旅行服务</text>
      </view>
      <view class="services-grid">
        <view class="service-card" @tap="openFlights">
          <text class="service-icon">✈</text>
          <text class="service-name">机票查询</text>
        </view>
        <view class="service-card" @tap="openHotels">
          <text class="service-icon">🏨</text>
          <text class="service-name">酒店预订</text>
        </view>
        <view class="service-card" @tap="openWeather">
          <text class="service-icon">🌤</text>
          <text class="service-name">天气预报</text>
        </view>
        <view class="service-card" @tap="openGuide">
          <text class="service-icon">📖</text>
          <text class="service-name">旅行攻略</text>
        </view>
      </view>
    </view>

    <!-- Attractions -->
    <AttractionList :attractions="city.attractions" />

    <!-- Cuisine -->
    <FoodList :cuisine="city.cuisine" />

    <!-- Mini Map -->
    <view class="map-section">
      <view class="section-header">
        <text class="section-title">地理位置</text>
      </view>
      <map
        class="mini-map"
        :latitude="city.latitude"
        :longitude="city.longitude"
        :markers="[{ latitude: city.latitude, longitude: city.longitude, title: city.name }]"
        :scale="10"
      />
    </view>

    <!-- Travel Tips -->
    <view v-if="city.travelTips.length > 0" class="tips-section">
      <view class="section-header">
        <text class="section-title">旅行贴士</text>
      </view>
      <view class="tips-list">
        <view v-for="(tip, i) in city.travelTips" :key="i" class="tip-item">
          <text class="tip-bullet">•</text>
          <text class="tip-text">{{ tip }}</text>
        </view>
      </view>
    </view>

    <!-- Bottom spacing -->
    <view class="bottom-space" />
  </view>

  <!-- Not found -->
  <view v-else class="page-empty">
    <text class="empty-text">城市未找到</text>
    <view class="btn-back" @tap="goBack">
      <text class="btn-back-text">返回首页</text>
    </view>
  </view>
</template>

<style scoped>
.page-detail {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.hero-section {
  position: relative;
  height: 500rpx;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 600rpx;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.hero-content {
  position: absolute;
  bottom: 32rpx;
  left: 32rpx;
  right: 80rpx;
}

.hero-tags {
  display: flex;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.hero-tag {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 20rpx;
  color: #FFFFFF;
}

.hero-city-name {
  font-size: 52rpx;
  font-weight: 800;
  color: #FFFFFF;
  display: block;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.hero-city-en {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-top: 4rpx;
}

.fav-btn {
  position: absolute;
  top: env(safe-area-inset-top, 20rpx);
  right: 32rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
}

.fav-icon {
  font-size: 36rpx;
  color: #FF8585;
}

.back-btn {
  position: absolute;
  top: env(safe-area-inset-top, 20rpx);
  left: 32rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80rpx;
}

.back-icon {
  font-size: 44rpx;
  color: #FFFFFF;
  font-weight: 300;
  line-height: 1;
  margin-top: -4rpx;
}

.overview-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 24rpx 32rpx;
  gap: 16rpx;
}

.overview-item {
  flex: 1;
  min-width: 300rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: var(--bg-card);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.overview-label {
  font-size: 22rpx;
  color: var(--text-hint);
  display: block;
}

.overview-value {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 4rpx;
  display: block;
}

.description-section {
  padding: 0 32rpx 24rpx;
}

.description-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.8;
}

.services-section {
  padding: 0 32rpx;
  margin-top: 16rpx;
}

.section-header {
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.services-grid {
  display: flex;
  gap: 16rpx;
}

.service-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 12rpx;
  border-radius: 16rpx;
  background-color: var(--bg-card);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.service-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.service-name {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.map-section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.mini-map {
  width: 100%;
  height: 300rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.tips-section {
  margin-top: 32rpx;
  padding: 0 32rpx;
}

.tips-list {
  background-color: var(--bg-card);
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.tip-item {
  display: flex;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.tip-item:last-child {
  margin-bottom: 0;
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
  height: 60rpx;
}

.page-empty {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
}

.empty-text {
  font-size: 32rpx;
  color: var(--text-hint);
}

.btn-back {
  margin-top: 24rpx;
  padding: 16rpx 48rpx;
  border-radius: 999rpx;
  background-color: #FF6B35;
}

.btn-back-text {
  font-size: 28rpx;
  color: #FFFFFF;
  font-weight: 600;
}
</style>
