<script setup lang="ts">
import { ref } from 'vue'
import type { City } from '@/types/city'

const props = defineProps<{
  city: City
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const posterImagePath = ref('')
const generating = ref(false)

async function generatePoster() {
  if (generating.value) return
  generating.value = true

  try {
    const ctx = uni.createCanvasContext('posterCanvas')
    const w = 750
    const h = 1334

    // Background gradient
    const grd = ctx.createLinearGradient(0, 0, 0, h)
    grd.addColorStop(0, '#FF6B35')
    grd.addColorStop(1, '#FF8585')
    ctx.setFillStyle(grd)
    ctx.fillRect(0, 0, w, h)

    // City name
    ctx.setFontSize(64)
    ctx.setFillStyle('#FFFFFF')
    ctx.setTextAlign('center')
    ctx.fillText(props.city.name, w / 2, 200)

    // City English name
    ctx.setFontSize(28)
    ctx.setFillStyle('rgba(255, 255, 255, 0.7)')
    ctx.fillText(props.city.nameEn, w / 2, 250)

    // Description
    ctx.setFontSize(26)
    ctx.setFillStyle('rgba(255, 255, 255, 0.9)')
    ctx.setTextAlign('left')
    wrapText(ctx, props.city.description, 80, 700, w - 160, 40)

    // Branding
    ctx.setFontSize(24)
    ctx.setFillStyle('rgba(255, 255, 255, 0.6)')
    ctx.setTextAlign('center')
    ctx.fillText('旅游Tips', w / 2, h - 100)

    // Decorative line
    ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)')
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(w / 2 - 60, h - 60)
    ctx.lineTo(w / 2 + 60, h - 60)
    ctx.stroke()

    ctx.draw(false, () => {
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          success: (res) => {
            posterImagePath.value = res.tempFilePath
          },
          fail: () => {
            uni.showToast({ title: '生成失败', icon: 'none' })
          },
        })
      }, 500)
    })
  } finally {
    generating.value = false
  }
}

function wrapText(
  ctx: UniApp.CanvasContext,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  let line = ''
  let currentY = y
  for (let i = 0; i < text.length; i++) {
    const testLine = line + text[i]
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line.length > 0) {
      ctx.fillText(line, x, currentY)
      line = text[i]
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, currentY)
}

function savePoster() {
  if (!posterImagePath.value) return
  uni.saveImageToPhotosAlbum({
    filePath: posterImagePath.value,
    success: () => {
      uni.showToast({ title: '已保存到相册' })
    },
    fail: () => {
      uni.showToast({ title: '保存失败，请检查相册权限', icon: 'none' })
    },
  })
}

function close() {
  emit('close')
}
</script>

<template>
  <view v-if="visible" class="poster-modal" @tap.self="close">
    <view class="poster-content">
      <!-- Canvas for rendering -->
      <canvas
        canvas-id="posterCanvas"
        class="poster-canvas"
        style="width: 750px; height: 1334px;"
      />

      <!-- Preview -->
      <view v-if="posterImagePath" class="poster-preview">
        <image :src="posterImagePath" mode="widthFix" class="preview-image" />
        <view class="poster-actions">
          <view class="poster-btn save-btn" @tap="savePoster">
            <text class="poster-btn-text">保存到相册</text>
          </view>
          <view class="poster-btn cancel-btn" @tap="close">
            <text class="poster-btn-text cancel-text">取消</text>
          </view>
        </view>
      </view>

      <!-- Generate button -->
      <view v-else class="poster-generate">
        <view class="poster-btn generate-btn" @tap="generatePoster">
          <text class="poster-btn-text">{{ generating ? '生成中...' : '生成海报' }}</text>
        </view>
        <view class="poster-btn cancel-btn" @tap="close">
          <text class="poster-btn-text cancel-text">取消</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.poster-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.poster-content {
  width: 80%;
}

.poster-canvas {
  position: fixed;
  left: -9999px;
  top: -9999px;
}

.poster-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  width: 100%;
  border-radius: 16rpx;
}

.poster-actions,
.poster-generate {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
  width: 100%;
}

.poster-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generate-btn,
.save-btn {
  background: linear-gradient(135deg, #FF6B35, #FF8585);
}

.poster-btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.cancel-btn {
  background-color: rgba(255, 255, 255, 0.2);
}

.cancel-text {
  color: rgba(255, 255, 255, 0.8);
}
</style>
