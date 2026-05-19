<script setup lang="ts">
import { computed } from 'vue'
import type { CityRegion, CityType, FilterState } from '@/types/city'
import { CITY_TYPE_LABELS, CITY_REGION_LABELS } from '@/types/city'

const props = defineProps<{
  filter: FilterState
  cityCount: number
}>()

const emit = defineEmits<{
  (e: 'update:filter', filter: FilterState): void
}>()

const regions: (CityRegion | 'all')[] = ['all', 'domestic', 'international']
const types: CityType[] = ['beach', 'mountain', 'city', 'historical', 'nature', 'foodie', 'romantic', 'adventure']

function setRegion(region: CityRegion | 'all') {
  emit('update:filter', { ...props.filter, region })
}

function toggleType(type: CityType) {
  const current = [...props.filter.types]
  const idx = current.indexOf(type)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(type)
  }
  emit('update:filter', { ...props.filter, types: current })
}

function isActiveRegion(region: CityRegion | 'all') {
  return props.filter.region === region
}

function isActiveType(type: CityType) {
  return props.filter.types.includes(type)
}
</script>

<template>
  <view class="filter-bar">
    <view class="region-row">
      <view
        v-for="region in regions"
        :key="region"
        class="chip"
        :class="{ active: isActiveRegion(region) }"
        @tap="setRegion(region)"
      >
        <text class="chip-text">{{ CITY_REGION_LABELS[region] }}</text>
      </view>
      <view class="count-badge">
        <text class="count-text">{{ cityCount }}城</text>
      </view>
    </view>
    <scroll-view scroll-x class="type-scroll">
      <view class="type-row">
        <view
          v-for="type in types"
          :key="type"
          class="chip type-chip"
          :class="{ active: isActiveType(type) }"
          @tap="toggleType(type)"
        >
          <text class="chip-text">{{ CITY_TYPE_LABELS[type] }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.filter-bar {
  padding: 16rpx 24rpx;
}

.region-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.type-scroll {
  white-space: nowrap;
}

.type-row {
  display: flex;
  gap: 12rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
  background-color: var(--bg-secondary);
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.chip.active {
  background-color: #FF6B35;
  border-color: #FF6B35;
}

.chip-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  white-space: nowrap;
}

.chip.active .chip-text {
  color: #FFFFFF;
  font-weight: 600;
}

.type-chip {
  flex-shrink: 0;
}

.count-badge {
  margin-left: auto;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.1);
}

.count-text {
  font-size: 22rpx;
  color: #FF6B35;
  font-weight: 600;
}
</style>
