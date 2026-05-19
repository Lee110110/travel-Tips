<script setup lang="ts">
</script>

<template>
  <view class="page-travel">
    <view class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无旅行规划</text>
      <text class="empty-hint">在出发页随机抽一个城市开始规划吧</text>
    </view>
  </view>
</template>

<style scoped>
.page-travel {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
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
