<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')
  const userStore = useUserStore()
  userStore.initTheme()
  userStore.initLocation()
})
</script>

<style>
page {
  background-color: var(--bg-primary, #FFFAF5);
  color: var(--text-primary, #2D3436);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --bg-primary: #FFFAF5;
  --bg-secondary: #FFF0E6;
  --bg-card: #FFFFFF;
  --text-primary: #2D3436;
  --text-secondary: #636E72;
  --text-hint: #B2BEC3;
  --border-color: #E8E0D8;
  --color-primary: #FF6B35;
  --color-secondary: #00B4D8;
  --color-accent: #F7C948;
  --color-coral: #FF8585;
}

@media (prefers-color-scheme: dark) {
  page {
    --bg-primary: #1A1A2E;
    --bg-secondary: #16213E;
    --bg-card: #2D2D44;
    --text-primary: #E8E8E8;
    --text-secondary: #A0A0A0;
    --text-hint: #666666;
    --border-color: #3D3D5C;
  }
}

.dark-mode page {
  --bg-primary: #1A1A2E;
  --bg-secondary: #16213E;
  --bg-card: #2D2D44;
  --text-primary: #E8E8E8;
  --text-secondary: #A0A0A0;
  --text-hint: #666666;
  --border-color: #3D3D5C;
}
</style>
