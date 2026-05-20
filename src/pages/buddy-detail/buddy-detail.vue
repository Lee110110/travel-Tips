<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { useBuddyStore } from '@/stores/buddy'
import type { BuddyTeam } from '@/types/city'

const buddyStore = useBuddyStore()
const team = ref<BuddyTeam | null>(null)
const showApplyModal = ref(false)
const applyMessage = ref('')
const closing = ref(false)
const generating = ref(false)

onLoad(async (options) => {
  if (options?.id) {
    // Try to find team in store first
    let found = buddyStore.teamList.find(t => t.id === options.id)
      || buddyStore.myTeams.find(t => t.id === options.id)

    // If not found, load from server/mock
    if (!found && buddyStore.teamList.length === 0) {
      await buddyStore.loadTeams()
      found = buddyStore.teamList.find(t => t.id === options.id)
    }

    // If still not found, try to restore from URL-encoded team data (shared link scenario)
    if (!found && options.data) {
      try {
        found = JSON.parse(decodeURIComponent(options.data as string)) as BuddyTeam
      } catch {}
    }

    if (found) team.value = found
  }
})

function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

const isFull = computed(() => team.value?.status === 'full')
const isClosed = computed(() => team.value?.status === 'closed')
const isCreator = computed(() => team.value?.creatorId === 'me')
const hasGuide = computed(() => team.value ? !!buddyStore.getGuide(team.value.id) : false)

function openApply() {
  showApplyModal.value = true
}

async function submitApply() {
  if (!team.value) return
  await buddyStore.applyJoin(team.value.id, applyMessage.value)
  showApplyModal.value = false
  applyMessage.value = ''
  uni.showToast({ title: '申请已发送', icon: 'success' })
}

async function closeTeam() {
  if (!team.value) return
  uni.showModal({
    title: '关闭组队',
    content: '关闭后将生成AI旅行指南，确定关闭？',
    success: async (res) => {
      if (res.confirm && team.value) {
        closing.value = true
        try {
          await buddyStore.closeTeamAndGenerateGuide(team.value)
          uni.showToast({ title: '旅行指南已生成', icon: 'success' })
        } finally {
          closing.value = false
        }
      }
    },
  })
}

function viewGuide() {
  if (!team.value) return
  uni.navigateTo({ url: `/pages/travel-guide/travel-guide?teamId=${team.value.id}` })
}

async function generateGuide() {
  if (!team.value) return
  generating.value = true
  try {
    buddyStore.generateGuideOnly(team.value)
    uni.showToast({ title: '出行清单已生成', icon: 'success' })
    setTimeout(() => {
      viewGuide()
    }, 1000)
  } finally {
    generating.value = false
  }
}

function closeModal() {
  showApplyModal.value = false
}

function h5Share() {
  if (!team.value) return
  // Encode team data into URL so other users can see it from a shared link
  const teamData = encodeURIComponent(JSON.stringify(team.value))
  const baseUrl = window.location.origin + window.location.pathname
  const shareUrl = `${baseUrl}#/pages/buddy-detail/buddy-detail?id=${team.value.id}&data=${teamData}`
  const shareData = {
    title: `${team.value.name} | ${team.value.departure}→${team.value.destination}，快来一起出发！`,
    text: `${team.value.name} - ${team.value.departure}→${team.value.destination}，快来一起出发！`,
    url: shareUrl,
  }
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    uni.setClipboardData({
      data: shareUrl,
      success: () => uni.showToast({ title: '链接已复制，快去分享吧', icon: 'none' }),
    })
  }
}

onShareAppMessage(() => {
  if (!team.value) {
    return { title: '搭伴 — 找搭子一起旅行', path: '/pages/buddy/buddy' }
  }
  return {
    title: `${team.value.name} | ${team.value.departure}→${team.value.destination}，快来一起出发！`,
    path: `/pages/buddy-detail/buddy-detail?id=${team.value.id}`,
  }
})
</script>

<template>
  <view v-if="team" class="page-detail">
    <!-- Header -->
    <view class="detail-header">
      <view class="creator-row">
        <image class="creator-avatar" :src="team.creatorAvatar" mode="aspectFill" />
        <view class="creator-info">
          <text class="creator-name">{{ team.creatorName }}</text>
          <text class="create-time">{{ formatDate(team.createdAt) }} 发布</text>
        </view>
        <view class="status-badge" :class="team.status">
          <text class="status-text">{{ team.status === 'open' ? '招募中' : team.status === 'full' ? '已满' : '已关闭' }}</text>
        </view>
      </view>
    </view>

    <!-- Team Info -->
    <view class="detail-body">
      <text class="team-name">{{ team.name }}</text>

      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">出发地</text>
          <text class="info-value">{{ team.departure }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">目的地</text>
          <text class="info-value">{{ team.destination }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">出发时间</text>
          <text class="info-value">{{ formatDate(team.departureTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">返程时间</text>
          <text class="info-value">{{ formatDate(team.returnTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">人数</text>
          <text class="info-value">{{ team.currentMembers }}/{{ team.maxMembers }}人</text>
        </view>
        <view class="info-item">
          <text class="info-label">审核</text>
          <text class="info-value">{{ team.needApproval ? '需要审核' : '自由加入' }}</text>
        </view>
      </view>

      <view v-if="team.description" class="desc-section">
        <text class="desc-label">队伍介绍</text>
        <text class="desc-text">{{ team.description }}</text>
      </view>

      <view v-if="team.tags.length > 0" class="tags-section">
        <text v-for="tag in team.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
    </view>

    <!-- AI Guide Banner (shown when team is closed and guide exists) -->
    <view v-if="isClosed && hasGuide" class="guide-banner" @tap="viewGuide">
      <view class="guide-banner-content">
        <text class="guide-banner-icon">🤖</text>
        <view class="guide-banner-info">
          <text class="guide-banner-title">AI旅行指南已生成</text>
          <text class="guide-banner-desc">行李清单 · 天气情况 · 必带物品</text>
        </view>
        <text class="guide-banner-arrow">›</text>
      </view>
    </view>

    <!-- Action Bar -->
    <view v-if="!isClosed" class="action-bar">
      <!-- Creator actions -->
      <template v-if="isCreator">
        <view class="share-wrap" @tap="h5Share">
          <button class="share-btn" open-type="share">
            <text class="share-btn-text">分享</text>
          </button>
        </view>
        <view class="guide-gen-btn" :class="{ disabled: generating }" @tap="generateGuide">
          <text class="guide-gen-text">{{ generating ? '生成中...' : '生成出行清单' }}</text>
        </view>
        <view class="close-btn" :class="{ disabled: closing }" @tap="closeTeam">
          <text class="close-text">{{ closing ? '处理中...' : '关闭组队' }}</text>
        </view>
      </template>
      <!-- Member actions -->
      <template v-else>
        <view class="share-wrap" @tap="h5Share">
          <button class="share-btn" open-type="share">
            <text class="share-btn-text">分享</text>
          </button>
        </view>
        <view class="apply-btn" :class="{ disabled: isFull }" @tap="!isFull && openApply()">
          <text class="apply-text">{{ isFull ? '队伍已满' : '申请加入' }}</text>
        </view>
      </template>
    </view>

    <!-- View Guide Button (for closed teams with guide) -->
    <view v-if="isClosed && hasGuide" class="action-bar">
      <view class="share-wrap" @tap="h5Share">
        <button class="share-btn" open-type="share">
          <text class="share-btn-text">分享</text>
        </button>
      </view>
      <view class="guide-btn" @tap="viewGuide">
        <text class="guide-btn-text">🤖 查看AI旅行指南</text>
      </view>
    </view>
  </view>

  <!-- Not Found -->
  <view v-else class="page-empty">
    <text class="empty-text">队伍未找到</text>
  </view>

  <!-- Apply Modal -->
  <view v-if="showApplyModal" class="modal-overlay" @tap.self="closeModal">
    <view class="modal-content">
      <text class="modal-title">申请加入</text>
      <textarea
        class="modal-input"
        v-model="applyMessage"
        placeholder="说点什么，让队长了解你..."
        :maxlength="100"
      />
      <view class="modal-actions">
        <view class="modal-btn cancel" @tap="closeModal">
          <text class="modal-btn-text cancel">取消</text>
        </view>
        <view class="modal-btn confirm" @tap="submitApply">
          <text class="modal-btn-text">发送申请</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-detail {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding-bottom: 200rpx;
}

.detail-header {
  padding: 24rpx 32rpx;
  background-color: var(--bg-card);
}

.creator-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.creator-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.creator-info {
  flex: 1;
}

.creator-name {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
}

.create-time {
  font-size: 22rpx;
  color: var(--text-hint);
  margin-top: 4rpx;
  display: block;
}

.status-badge {
  padding: 6rpx 20rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.1);
}

.status-badge.full, .status-badge.closed {
  background-color: rgba(0, 0, 0, 0.06);
}

.status-text {
  font-size: 22rpx;
  color: #FF6B35;
  font-weight: 600;
}

.status-badge.full .status-text,
.status-badge.closed .status-text {
  color: var(--text-hint);
}

.detail-body {
  padding: 24rpx 32rpx;
}

.team-name {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--text-primary);
  display: block;
  margin-bottom: 24rpx;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.info-item {
  flex: 1;
  min-width: 300rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: var(--bg-card);
}

.info-label {
  font-size: 22rpx;
  color: var(--text-hint);
  display: block;
}

.info-value {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 4rpx;
  display: block;
}

.desc-section {
  margin-bottom: 24rpx;
}

.desc-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12rpx;
  display: block;
}

.desc-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.8;
}

.tags-section {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 6rpx 20rpx;
  border-radius: 999rpx;
  background-color: rgba(255, 107, 53, 0.08);
  font-size: 24rpx;
  color: #FF6B35;
}

.guide-banner {
  margin: 0 32rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #1A1A2E, #2D2D44);
  box-shadow: 0 4rpx 16rpx rgba(255, 107, 53, 0.2);
}

.guide-banner-content {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
}

.guide-banner-icon {
  font-size: 48rpx;
}

.guide-banner-info {
  flex: 1;
}

.guide-banner-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.guide-banner-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4rpx;
  display: block;
}

.guide-banner-arrow {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.5);
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: var(--bg-card);
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.apply-btn, .close-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  text-align: center;
}

.apply-btn.disabled {
  background: var(--bg-secondary);
}

.close-btn {
  background: linear-gradient(135deg, #1A1A2E, #2D2D44);
}

.close-btn.disabled {
  opacity: 0.6;
}

.guide-gen-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #6C5CE7, #A29BFE);
  text-align: center;
}

.guide-gen-btn.disabled {
  opacity: 0.6;
}

.guide-gen-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.apply-text, .close-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.apply-btn.disabled .apply-text {
  color: var(--text-hint);
}

.guide-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #1A1A2E, #2D2D44);
  text-align: center;
  border: 2rpx solid #FF6B35;
}

.guide-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.share-wrap {
  flex-shrink: 0;
}

.share-btn {
  padding: 24rpx 32rpx;
  border-radius: 999rpx;
  background-color: var(--bg-secondary);
  border: 2rpx solid var(--border-color);
  line-height: 1;
  margin: 0;
  font-size: 0;
}

.share-btn::after {
  border: none;
}

.share-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-secondary);
}

.page-empty {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
}

.empty-text {
  font-size: 32rpx;
  color: var(--text-hint);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 80%;
  background-color: var(--bg-card);
  border-radius: 20rpx;
  padding: 32rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20rpx;
  display: block;
}

.modal-input {
  width: 100%;
  height: 160rpx;
  font-size: 28rpx;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 24rpx;
}

.modal-actions {
  display: flex;
  gap: 16rpx;
}

.modal-btn {
  flex: 1;
  padding: 16rpx;
  border-radius: 999rpx;
  text-align: center;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #FF6B35, #FF8585);
}

.modal-btn.cancel {
  background-color: var(--bg-secondary);
}

.modal-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.modal-btn-text.cancel {
  color: var(--text-secondary);
}
</style>
