<script setup lang="ts">
import type { FoodItem } from '@/types/city'

defineProps<{
  cuisine: FoodItem[]
}>()
</script>

<template>
  <view v-if="cuisine.length > 0" class="food-section">
    <view class="section-header">
      <text class="section-title">美食推荐</text>
    </view>
    <view class="food-list">
      <view
        v-for="(item, i) in cuisine"
        :key="i"
        class="food-item"
        :class="{ reverse: i % 2 === 1 }"
      >
        <image class="food-image" :src="item.image" mode="aspectFill" />
        <view class="food-info">
          <view class="food-name-row">
            <text class="food-name">{{ item.name }}</text>
            <view v-if="item.mustTry" class="must-try-badge">
              <text class="must-try-text">必吃</text>
            </view>
          </view>
          <text class="food-desc">{{ item.description }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.food-section {
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

.food-list {
  padding: 0 32rpx;
}

.food-item {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
  background-color: var(--bg-card);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
}

.food-item.reverse {
  flex-direction: row-reverse;
}

.food-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.food-info {
  flex: 1;
  padding: 20rpx 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.food-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.food-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.must-try-badge {
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
}

.must-try-text {
  font-size: 18rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.food-desc {
  font-size: 24rpx;
  color: var(--text-secondary);
  margin-top: 8rpx;
  line-height: 1.5;
}
</style>
