<script setup>
import AppHero from './components/AppHero.vue'
import PageNav from './components/PageNav.vue'
import { useUvWiseApp } from './composables/useUvWiseApp'
import AwarenessPage from './pages/AwarenessPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import ProtectionPage from './pages/ProtectionPage.vue'
import TimerPage from './pages/TimerPage.vue'

const {
  activePage,
  adviceLoading,
  apiBaseUrl,
  awarenessData,
  awarenessLoading,
  awarenessSummary,
  clearProtectionTimer,
  clothingItems,
  dashboardHighlights,
  educationCard,
  locationStatus,
  pages,
  personalizedAdvice,
  protectionTimerActive,
  requestLocation,
  resetProtectionTimer,
  skinType,
  skinTypes,
  startProtectionTimer,
  timerDisplay,
  useMockData,
  userLocation,
  uvCategory,
  uvData,
  uvLoading,
} = useUvWiseApp()
</script>

<template>
  <div class="app-shell">
    <AppHero
      :api-base-url="apiBaseUrl"
      :location-status="locationStatus"
      :use-mock-data="useMockData"
      @refresh="requestLocation"
      @update:api-base-url="apiBaseUrl = $event"
      @update:use-mock-data="useMockData = $event"
    />

    <PageNav
      :active-page="activePage"
      :pages="pages"
      @update:active-page="activePage = $event"
    />

    <main class="page-stack">
      <DashboardPage
        v-if="activePage === 'dashboard'"
        :clothing-items="clothingItems"
        :dashboard-highlights="dashboardHighlights"
        :user-location="userLocation"
        :uv-category="uvCategory"
        :uv-data="uvData"
        :uv-loading="uvLoading"
      />

      <AwarenessPage
        v-else-if="activePage === 'awareness'"
        :awareness-data="awarenessData"
        :awareness-loading="awarenessLoading"
        :awareness-summary="awarenessSummary"
        :education-card="educationCard"
      />

      <ProtectionPage
        v-else-if="activePage === 'protection'"
        :advice-loading="adviceLoading"
        :personalized-advice="personalizedAdvice"
        :skin-type="skinType"
        :skin-types="skinTypes"
        :uv-data="uvData"
        @update:skin-type="skinType = $event"
      />

      <TimerPage
        v-else
        :protection-timer-active="protectionTimerActive"
        :timer-display="timerDisplay"
        @clear="clearProtectionTimer"
        @reset="resetProtectionTimer"
        @start="startProtectionTimer"
      />
    </main>
  </div>
</template>
