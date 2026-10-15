<script setup>
import {
  RouterView,
} from 'vue-router'

import AppHeader
  from './components/AppHeader.vue'

import AppFooter
  from './components/AppFooter.vue'

import OfflineStatusBanner
  from './components/OfflineStatusBanner.vue'
</script>

<template>
  <AppHeader />

  <OfflineStatusBanner />

  <RouterView />

  <AppFooter />
</template>