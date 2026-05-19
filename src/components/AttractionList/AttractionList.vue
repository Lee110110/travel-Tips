<script setup lang="ts">
import type { Attraction } from '@/types/city'

defineProps<{
  attractions: Attraction[]
}>()
</script>

<template>
  <view v-if="attractions.length > 0" class="attraction-section">
    <view class="section-header">
      <text class="section-title">必游景点</text>
    </view>
    <scroll-view scroll-x class="attraction-scroll">
      <view class="attraction-list">
        <view
          v-for="(item, i) in attractions"
          :key="i"
          class="attraction-card"
        >
          <image class="attraction-image" :src="item.image" mode="aspectFill" />
          <view class="attraction-info">
            <text class="attraction-name">{{ item.name }}</text>
            <text class="attraction-desc">{{ item.description }}</text>
            <view class="rating">
              <text v-for="s in 5" :key="s" class="star" :class="{ filled: s <= item.rating }">★</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.attraction-section {
  margin-top: 32rpx;
}

.section-header {
  padding: 0 32rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.attraction-scroll {
  white-space: nowrap;
}

.attraction-list {
  display: flex;
  gap: 16rpx;
  padding: 0 32rpx;
}

.attraction-card {
  flex-shrink: 0;
  width: 300rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background-color: var(--bg-card);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.attraction-image {
  width: 100%;
  height: 200rpx;
}

.attraction-info {
  padding: 16rpx;
}

.attraction-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.attraction-desc {
  font-size: 22rpx;
  color: var(--text-secondary);
  margin-top: 6rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  margin-top: 8rpx;
  display: flex;
  gap: 2rpx;
}

.star {
  font-size: 20rpx;
  color: #DDD;
}

.star.filled {
  color: #F7C948;
}
</style>
