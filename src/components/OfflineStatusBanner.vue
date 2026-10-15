<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

const isOnline =
  ref(navigator.onLine)

function updateOnlineStatus() {
  isOnline.value =
    navigator.onLine
}

onMounted(() => {
  window.addEventListener(
    'online',
    updateOnlineStatus,
  )

  window.addEventListener(
    'offline',
    updateOnlineStatus,
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'online',
    updateOnlineStatus,
  )

  window.removeEventListener(
    'offline',
    updateOnlineStatus,
  )
})
</script>

<template>
  <div
    class="network-banner"
    :class="{
      online: isOnline,
      offline: !isOnline,
    }"
    role="status"
    aria-live="polite"
  >
    <div class="banner-content">
      <span
        class="status-dot"
        aria-hidden="true"
      ></span>

      <strong>
        {{
          isOnline
            ? 'Online'
            : 'Offline mode'
        }}
      </strong>

      <span>
        {{
          isOnline
            ? 'Internet connection is available.'
            : 'Some online features may be unavailable. Saved recycling information can still be viewed.'
        }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.network-banner {
  width: 100%;
  padding: 9px 20px;

  font-size: 13px;

  border-bottom: 1px solid;
}

.banner-content {
  max-width: 1320px;
  margin: 0 auto;

  display: flex;
  align-items: center;

  gap: 8px;
}

.network-banner.online {
  border-color: #cfe2c8;

  background-color: #edf7e9;
  color: #285d1d;
}

.network-banner.offline {
  border-color: #eed49a;

  background-color: #fff8e6;
  color: #805700;
}

.status-dot {
  width: 9px;
  height: 9px;

  flex-shrink: 0;

  border-radius: 50%;
}

.online .status-dot {
  background-color: #438c2b;
}

.offline .status-dot {
  background-color: #d18a00;
}

.banner-content strong {
  margin-right: 3px;
}

@media (
  max-width: 576px
) {
  .network-banner {
    padding: 9px 14px;
  }

  .banner-content {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>