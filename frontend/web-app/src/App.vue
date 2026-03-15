<script setup>
import PageNav from './components/PageNav.vue'
import { useUvWiseApp } from './composables/useUvWiseApp'
import AwarenessPage from './pages/AwarenessPage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import ProtectionPage from './pages/ProtectionPage.vue'
import TimerPage from './pages/TimerPage.vue'

const {
  activePage,
  adviceLoading,
  awarenessData,
  awarenessLoading,
  awarenessSummary,
  clearProtectionTimer,
  clothingItems,
  dashboardHighlights,
  educationCard,
  fetchLocationSuggestions,
  isResolvingLocation,
  locationQuery,
  locationSearchStatus,
  locationSuggestions,
  pages,
  personalizedAdvice,
  protectionTimerActive,
  requestLocation,
  resetProtectionTimer,
  searchHistory,
  searchLocationByName,
  selectLocation,
  skinType,
  skinTypes,
  startProtectionTimer,
  timerDisplay,
  userLocation,
  uvCategory,
  uvData,
  uvLoading,
} = useUvWiseApp()
</script>

<template>
  <div class="app-shell" :class="{ 'dashboard-active': activePage === 'dashboard' }">
    <PageNav
      :active-page="activePage"
      :pages="pages"
      :uv-category="uvCategory"
      :uv-value="uvData.uv_index"
      :uv-color="uvData.color_code"
      @update:active-page="activePage = $event"
    />

    <main class="page-stack">
      <DashboardPage
        v-if="activePage === 'dashboard'"
        :clothing-items="clothingItems"
        :dashboard-highlights="dashboardHighlights"
        :is-resolving-location="isResolvingLocation"
        :location-query="locationQuery"
        :location-search-status="locationSearchStatus"
        :location-suggestions="locationSuggestions"
        :search-history="searchHistory"
        :user-location="userLocation"
        :uv-category="uvCategory"
        :uv-data="uvData"
        :uv-loading="uvLoading"
        @search-location="searchLocationByName"
        @fetch-suggestions="fetchLocationSuggestions"
        @select-location="selectLocation"
        @use-current-location="requestLocation"
        @update:location-query="locationQuery = $event"
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
