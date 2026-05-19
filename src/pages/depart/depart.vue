<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useCityStore } from '@/stores/city'
import { useHistoryStore } from '@/stores/history'
import type { City, SceneCategory } from '@/types/city'
import { CITY_TYPE_LABELS } from '@/types/city'
import SpinWheel from '@/components/SpinWheel/SpinWheel.vue'
import FilterBar from '@/components/FilterBar/FilterBar.vue'
import CelebrationEffect from '@/components/CelebrationEffect/CelebrationEffect.vue'

const cityStore = useCityStore()
const historyStore = useHistoryStore()

const showResult = ref(false)
const showCelebration = ref(false)
const wheelRef = ref<InstanceType<typeof SpinWheel> | null>(null)

const scenes: { value: SceneCategory; icon: string; label: string }[] = [
  { value: 'desert', icon: '🏜', label: '沙漠' },
  { value: 'grassland', icon: '🌿', label: '草原' },
  { value: 'beach', icon: '🏖', label: '海边' },
  { value: 'forest', icon: '🌲', label: '森林' },
]

const filter = computed({
  get: () => cityStore.filter,
  set: (val) => cityStore.setFilter(val),
})

const filteredCities = computed(() => cityStore.sceneFilteredCities)
const discoveredCount = computed(() => historyStore.discoveredCount)
const totalCities = computed(() => cityStore.allCities.length)
const progressPercent = computed(() =>
  totalCities.value > 0 ? Math.round((discoveredCount.value / totalCities.value) * 100) : 0
)

onShareAppMessage(() => {
  if (cityStore.selectedCity) {
    return {
      title: `我随机抽到了${cityStore.selectedCity.name}，你也来试试！`,
      path: '/pages/depart/depart',
      imageUrl: cityStore.selectedCity.heroImage,
    }
  }
  return {
    title: '旅游Tips - 让命运选择你的下一站',
    path: '/pages/depart/depart',
  }
})

function toggleScene(scene: SceneCategory) {
  cityStore.setScene(cityStore.activeScene === scene ? null : scene)
}

function onSpinResult(city: City) {
  cityStore.setSelectedCity(city)
  historyStore.addToHistory(city.id)
  showCelebration.value = true
  setTimeout(() => { showResult.value = true }, 300)
  setTimeout(() => { showCelebration.value = false }, 3500)
}

function spinAgain() {
  showResult.value = false
  showCelebration.value = false
  cityStore.setSelectedCity(null)
  if (wheelRef.value) wheelRef.value.reset()
}

function viewDetail(city: City) {
  uni.navigateTo({ url: `/pages/city-detail/city-detail?id=${city.id}` })
}

function toggleFavorite(city: City) {
  historyStore.toggleFavorite(city.id)
}

function isFavorite(city: City): boolean {
  return historyStore.isFavorite(city.id)
}
</script>

<template>
  <view class="page-depart">
    <!-- Custom Nav Bar -->
    <view class="nav-bar">
      <view class="nav-content">
        <text class="nav-title">出发</text>
        <text class="nav-subtitle">让命运选择你的下一站</text>
      </view>
    </view>

    <!-- Scene Categories -->
    <view class="scene-row">
      <view
        v-for="scene in scenes"
        :key="scene.value"
        class="scene-chip"
        :class="{ active: cityStore.activeScene === scene.value }"
        @tap="toggleScene(scene.value)"
      >
        <text class="scene-icon">{{ scene.icon }}</text>
        <text class="scene-text">{{ scene.label }}</text>
      </view>
    </view>

    <!-- Filter Bar -->
    <FilterBar
      :filter="filter"
      :city-count="filteredCities.length"
      @update:filter="filter = $event"
    />

    <!-- Exploration Progress -->
    <view class="progress-bar">
      <view class="progress-info">
        <text class="progress-text">已探索 {{ discoveredCount }}/{{ totalCities }} 座城市</text>
        <text class="progress-percent">{{ progressPercent }}%</text>
      </view>
      <view class="progress-track">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }" />
      </view>
    </view>

    <!-- Spin Wheel -->
    <view class="wheel-section">
      <SpinWheel
        ref="wheelRef"
        :cities="filteredCities"
        :spinning="cityStore.isSpinning"
        @result="onSpinResult"
        @update:spinning="cityStore.setSpinning"
      />
    </view>

    <!-- Result Card -->
    <view v-if="showResult && cityStore.selectedCity" class="result-section" :class="{ show: showResult }">
      <view class="result-card">
        <image class="result-image" :src="cityStore.selectedCity.heroImage" mode="aspectFill" />
        <view class="result-overlay">
          <view class="result-tags">
            <text class="tag">{{ cityStore.selectedCity.region === 'domestic' ? '国内' : '国外' }}</text>
            <text v-for="t in cityStore.selectedCity.types.slice(0, 2)" :key="t" class="tag">{{ CITY_TYPE_LABELS[t] }}</text>
          </view>
          <text class="result-city-name">{{ cityStore.selectedCity.name }}</text>
          <text class="result-city-en">{{ cityStore.selectedCity.nameEn }}</text>
          <text class="result-desc">{{ cityStore.selectedCity.description }}</text>
          <view class="result-actions">
            <view class="btn btn-primary" @tap="viewDetail(cityStore.selectedCity)">
              <text class="btn-text">查看详情</text>
            </view>
            <view class="btn btn-secondary" @tap="spinAgain">
              <text class="btn-text-secondary">再抽一次</text>
            </view>
            <view class="btn-fav" @tap="toggleFavorite(cityStore.selectedCity)">
              <text class="fav-icon">{{ isFavorite(cityStore.selectedCity) ? '♥' : '♡' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Celebration Effect -->
    <CelebrationEffect :visible="showCelebration" />
  </view>
</template>

<style scoped>
.page-depart {
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

.nav-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.scene-row {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 32rpx 8rpx;
}

.scene-chip {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background-color: var(--bg-secondary);
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.scene-chip.active {
  background-color: #FF6B35;
  border-color: #FF6B35;
}

.scene-icon {
  font-size: 28rpx;
}

.scene-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  font-weight: 600;
}

.scene-chip.active .scene-text {
  color: #FFFFFF;
}

.progress-bar {
  padding: 0 32rpx 16rpx;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.progress-text {
  font-size: 22rpx;
  color: var(--text-secondary);
}

.progress-percent {
  font-size: 22rpx;
  color: #FF6B35;
  font-weight: 600;
}

.progress-track {
  height: 8rpx;
  background-color: var(--bg-secondary);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #F7C948);
  border-radius: 4rpx;
  transition: width 0.5s ease;
}

.wheel-section {
  display: flex;
  justify-content: center;
  padding: 32rpx 0;
}

.result-section {
  padding: 0 32rpx;
  opacity: 0;
  transform: translateY(40rpx);
  transition: all 0.4s ease;
}

.result-section.show {
  opacity: 1;
  transform: translateY(0);
}

.result-card {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
  background-color: var(--bg-card);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.result-image {
  width: 100%;
  height: 300rpx;
}

.result-overlay {
  padding: 24rpx;
}

.result-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 12rpx;
}

.tag {
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.1);
  font-size: 20rpx;
  color: #FF6B35;
}

.result-city-name {
  font-size: 44rpx;
  font-weight: 800;
  color: var(--text-primary);
  display: block;
}

.result-city-en {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
  display: block;
}

.result-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-top: 12rpx;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 24rpx;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  border-radius: 999rpx;
}

.btn-primary {
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  flex: 1;
}

.btn-secondary {
  flex: 1;
  border: 2rpx solid #FF6B35;
  background-color: transparent;
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.btn-text-secondary {
  font-size: 28rpx;
  font-weight: 600;
  color: #FF6B35;
}

.btn-fav {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2rpx solid #FF8585;
}

.fav-icon {
  font-size: 36rpx;
  color: #FF8585;
}
</style>
