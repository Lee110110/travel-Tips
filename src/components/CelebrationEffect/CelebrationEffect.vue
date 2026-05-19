<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  visible: boolean
}>()

const particles = ref<Array<{
  id: number
  color: string
  left: string
  size: string
  duration: string
  delay: string
  drift: string
}>>([])

const colors = ['#FF6B35', '#00B4D8', '#F7C948', '#FF8585', '#4ECDC4', '#FFE66D', '#A8E6CF']

let timer: ReturnType<typeof setTimeout> | null = null

function generateParticles() {
  const items = []
  for (let i = 0; i < 40; i++) {
    items.push({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      size: `${6 + Math.random() * 12}rpx`,
      duration: `${1.5 + Math.random() * 1.5}s`,
      delay: `${Math.random() * 0.5}s`,
      drift: `${-30 + Math.random() * 60}rpx`,
    })
  }
  particles.value = items
}

watch(() => props.visible, (val) => {
  if (val) {
    generateParticles()
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      particles.value = []
    }, 3500)
  } else {
    particles.value = []
    if (timer) { clearTimeout(timer); timer = null }
  }
}, { immediate: true })

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <view v-if="particles.length > 0" class="celebration">
    <view
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        backgroundColor: p.color,
        left: p.left,
        width: p.size,
        height: p.size,
        animationDuration: p.duration,
        animationDelay: p.delay,
        '--drift': p.drift,
      }"
    />
  </view>
</template>

<style scoped>
.celebration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.particle {
  position: absolute;
  top: -20rpx;
  border-radius: 50%;
  animation: particleFall linear forwards;
}

@keyframes particleFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(var(--drift)) rotate(720deg);
    opacity: 0;
  }
}
</style>
