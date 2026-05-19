<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { City } from '@/types/city'
import { sampleCities } from '@/utils/random'

const props = defineProps<{
  cities: City[]
  spinning: boolean
}>()

const emit = defineEmits<{
  (e: 'result', city: City): void
  (e: 'update:spinning', val: boolean): void
}>()

const SEGMENTS = 10
const segmentAngle = 360 / SEGMENTS

const wheelRotation = ref(0)
const wheelTransition = ref('')
const visibleCities = ref<City[]>([])
const currentRotation = ref(0)

const wheelStyle = computed(() => ({
  transform: `rotate(${wheelRotation.value}deg)`,
  transition: wheelTransition.value,
}))

const segmentStyle = (index: number) => ({
  transform: `rotate(${index * segmentAngle}deg)`,
})

function spin() {
  if (props.spinning || props.cities.length === 0) return

  // Sample visible cities for the wheel
  const pool = props.cities.length <= SEGMENTS
    ? [...props.cities]
    : sampleCities(props.cities, SEGMENTS)

  // Pre-determine the result
  const targetIndex = Math.floor(Math.random() * pool.length)
  const targetCity = pool[targetIndex]

  // Place target city at a random position in the visible list
  const displayCities = [...pool]
  visibleCities.value = displayCities

  emit('update:spinning', true)

  // Calculate target rotation
  // The pointer is at top (0 deg), so we need to rotate so the target segment aligns with 0
  // Target segment center is at: targetIndex * segmentAngle + segmentAngle/2
  const targetAngle = targetIndex * segmentAngle + segmentAngle / 2
  // We want this angle to be at the top (0/360), so we rotate by (360 - targetAngle)
  const offsetToTop = 360 - targetAngle
  // Add multiple full rotations for visual effect
  const fullRotations = 360 * (5 + Math.floor(Math.random() * 4))
  const finalRotation = currentRotation.value + fullRotations + offsetToTop

  wheelTransition.value = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
  wheelRotation.value = finalRotation
  currentRotation.value = finalRotation

  // Wait for animation to complete
  setTimeout(() => {
    emit('update:spinning', false)
    emit('result', targetCity)
  }, 4200)
}

function reset() {
  wheelTransition.value = 'transform 0.3s ease'
  wheelRotation.value = 0
  currentRotation.value = 0
  visibleCities.value = []
}

defineExpose({ spin, reset })
</script>

<template>
  <view class="wheel-wrapper">
    <!-- Pointer -->
    <view class="wheel-pointer">
      <view class="pointer-arrow" />
    </view>

    <!-- Wheel -->
    <view
      class="wheel-container"
      :style="wheelStyle"
    >
      <view
        v-for="(city, i) in visibleCities"
        :key="i"
        class="wheel-segment"
        :style="segmentStyle(i)"
      >
        <text class="segment-text">{{ city.name }}</text>
      </view>
      <!-- Center button -->
      <view class="wheel-center" @tap="spin">
        <text class="center-text">GO!</text>
      </view>
    </view>

    <!-- Fallback when no visible cities -->
    <view v-if="visibleCities.length === 0" class="wheel-empty" @tap="spin">
      <view class="empty-circle">
        <text class="empty-text">点击\n出发</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.wheel-wrapper {
  position: relative;
  width: 560rpx;
  height: 560rpx;
  margin: 0 auto;
}

.wheel-pointer {
  position: absolute;
  top: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.pointer-arrow {
  width: 0;
  height: 0;
  border-left: 20rpx solid transparent;
  border-right: 20rpx solid transparent;
  border-top: 40rpx solid #FF6B35;
  filter: drop-shadow(0 4rpx 8rpx rgba(255, 107, 53, 0.4));
}

.wheel-container {
  position: relative;
  width: 560rpx;
  height: 560rpx;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #FFE8D6 0deg, #FFD4B8 36deg,
    #FFE8D6 36deg, #FFD4B8 72deg,
    #FFE8D6 72deg, #FFD4B8 108deg,
    #FFE8D6 108deg, #FFD4B8 144deg,
    #FFE8D6 144deg, #FFD4B8 180deg,
    #FFE8D6 180deg, #FFD4B8 216deg,
    #FFE8D6 216deg, #FFD4B8 252deg,
    #FFE8D6 252deg, #FFD4B8 288deg,
    #FFE8D6 288deg, #FFD4B8 324deg,
    #FFE8D6 324deg, #FFD4B8 360deg
  );
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 53, 0.3), inset 0 0 0 8rpx #FF6B35;
  will-change: transform;
}

.wheel-segment {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1rpx;
  height: 280rpx;
  transform-origin: 0 280rpx;
}

.segment-text {
  position: absolute;
  top: 60rpx;
  left: -40rpx;
  width: 80rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: #2D3436;
  text-align: center;
  white-space: nowrap;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.5);
  z-index: 5;
}

.center-text {
  font-size: 36rpx;
  font-weight: 800;
  color: #FFFFFF;
}

.wheel-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.empty-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 24rpx rgba(255, 107, 53, 0.5);
}

.empty-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
  line-height: 1.4;
}
</style>
