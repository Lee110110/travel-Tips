<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useBuddyStore } from '@/stores/buddy'

const buddyStore = useBuddyStore()

const form = ref({
  departure: '',
  destination: '',
  name: '',
  departureTime: '',
  returnTime: '',
  maxMembers: 6,
  needApproval: true,
  description: '',
})

onLoad((query) => {
  if (query?.destination) {
    form.value.destination = decodeURIComponent(query.destination)
  }
})

const submitting = ref(false)

const departureDate = ref('')
const returnDate = ref('')

function onDepartureDateChange(e: any) {
  departureDate.value = e.detail.value
}

function onReturnDateChange(e: any) {
  returnDate.value = e.detail.value
}

async function submit() {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入队伍名字', icon: 'none' })
    return
  }
  if (!form.value.departure.trim() || !form.value.destination.trim()) {
    uni.showToast({ title: '请输入出发地和目的地', icon: 'none' })
    return
  }
  if (!departureDate.value || !returnDate.value) {
    uni.showToast({ title: '请选择出发和返程时间', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await buddyStore.createTeam({
      name: form.value.name,
      departure: form.value.departure,
      destination: form.value.destination,
      departureTime: new Date(departureDate.value).getTime(),
      returnTime: new Date(returnDate.value).getTime(),
      maxMembers: form.value.maxMembers,
      needApproval: form.value.needApproval,
      tags: [],
      description: form.value.description,
    })
    uni.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch {
    uni.showToast({ title: '创建失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="page-create">
    <view class="form">
      <!-- Team Name -->
      <view class="form-item">
        <text class="form-label">队伍名字</text>
        <input class="form-input" v-model="form.name" placeholder="给你的队伍起个名字" />
      </view>

      <!-- Route -->
      <view class="form-item">
        <text class="form-label">出发地</text>
        <input class="form-input" v-model="form.departure" placeholder="从哪里出发" />
      </view>
      <view class="form-item">
        <text class="form-label">目的地</text>
        <input class="form-input" v-model="form.destination" placeholder="要去哪里" />
      </view>

      <!-- Date -->
      <view class="form-item">
        <text class="form-label">出发时间</text>
        <picker mode="date" @change="onDepartureDateChange">
          <view class="form-picker">
            <text :class="{ placeholder: !departureDate }">{{ departureDate || '选择出发日期' }}</text>
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">返程时间</text>
        <picker mode="date" @change="onReturnDateChange">
          <view class="form-picker">
            <text :class="{ placeholder: !returnDate }">{{ returnDate || '选择返程日期' }}</text>
          </view>
        </picker>
      </view>

      <!-- Max Members -->
      <view class="form-item">
        <text class="form-label">人数上限</text>
        <input class="form-input" type="number" v-model="form.maxMembers" placeholder="6" />
      </view>

      <!-- Need Approval -->
      <view class="form-item switch-row">
        <text class="form-label">需要审核加入</text>
        <switch :checked="form.needApproval" @change="form.needApproval = $event.detail.value" color="#FF6B35" />
      </view>

      <!-- Description -->
      <view class="form-item">
        <text class="form-label">队伍简介</text>
        <textarea class="form-textarea" v-model="form.description" placeholder="介绍一下你的旅行计划..." :maxlength="200" />
      </view>
    </view>

    <!-- Submit -->
    <view class="submit-btn" :class="{ disabled: submitting }" @tap="submit">
      <text class="submit-text">{{ submitting ? '创建中...' : '创建队伍' }}</text>
    </view>
  </view>
</template>

<style scoped>
.page-create {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 24rpx 32rpx 120rpx;
}

.form {
  background-color: var(--bg-card);
  border-radius: 20rpx;
  overflow: hidden;
}

.form-item {
  padding: 24rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
  display: block;
}

.form-input {
  font-size: 30rpx;
  color: var(--text-primary);
  width: 100%;
}

.form-picker {
  padding: 8rpx 0;
}

.form-picker text {
  font-size: 30rpx;
  color: var(--text-primary);
}

.form-picker .placeholder {
  color: var(--text-hint);
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch-row .form-label {
  margin-bottom: 0;
}

.form-textarea {
  font-size: 28rpx;
  color: var(--text-primary);
  width: 100%;
  height: 160rpx;
  line-height: 1.6;
}

.submit-btn {
  margin-top: 40rpx;
  padding: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #FF6B35, #FF8585);
  text-align: center;
}

.submit-btn.disabled {
  opacity: 0.6;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}
</style>
