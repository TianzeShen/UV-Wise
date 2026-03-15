<script setup>
import { ref } from 'vue'

const props = defineProps({
  clothingItems: {
    type: Array,
    required: true,
  },
  dashboardHighlights: {
    type: Array,
    required: true,
  },
  isResolvingLocation: {
    type: Boolean,
    required: true,
  },
  locationQuery: {
    type: String,
    required: true,
  },
  locationSearchStatus: {
    type: String,
    required: true,
  },
  userLocation: {
    type: Object,
    required: true,
  },
  uvCategory: {
    type: String,
    required: true,
  },
  uvData: {
    type: Object,
    required: true,
  },
  uvLoading: {
    type: Boolean,
    required: true,
  },
  locationSuggestions: {
    type: Array,
    default: () => [],
  },
  searchHistory: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'search-location',
  'update:locationQuery',
  'fetch-suggestions',
  'select-location',
  'use-current-location',
])

const showDropdown = ref(false)
const debounceTimeout = ref(null)

function handleInput(event) {
  const value = event.target.value
  emit('update:locationQuery', value)

  if (debounceTimeout.value) clearTimeout(debounceTimeout.value)
  debounceTimeout.value = setTimeout(() => {
    emit('fetch-suggestions', value)
    showDropdown.value = true
  }, 300)
}

function handleFocus() {
  showDropdown.value = true
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function selectItem(item) {
  emit('select-location', item)
  showDropdown.value = false
}
</script>

<template>
  <section class="dashboard-home">
    <div class="landing-hero" :style="{ '--uv-accent': uvData.color_code }">
      <div class="landing-copy">
        <p class="landing-kicker">UV Wise</p>
        <h1>Plan outdoor time with clearer UV guidance.</h1>
        <p class="landing-text">
          Search any location, understand the current UV risk instantly, and turn science-backed
          advice into simple actions before you head outside.
        </p>

        <div class="landing-search-wrapper">
          <div class="landing-search">
            <button
              class="location-icon-button"
              title="Use current location"
              @click="$emit('use-current-location')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
            </button>
            <input
              class="landing-search-input"
              :value="locationQuery"
              type="text"
              placeholder="Search a city, suburb, or postcode"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup.enter="$emit('search-location')"
            />
            <button class="landing-search-button" @click="$emit('search-location')">
              {{ isResolvingLocation ? 'Searching...' : 'Check UV' }}
            </button>
          </div>

          <div
            v-if="showDropdown && (locationSuggestions.length > 0 || (!locationQuery && searchHistory.length > 0))"
            class="search-dropdown"
          >
            <ul v-if="locationQuery && locationSuggestions.length > 0" class="dropdown-list">
              <li
                v-for="item in locationSuggestions"
                :key="item.lat + '-' + item.lon"
                class="dropdown-item"
                @click="selectItem(item)"
              >
                <strong>{{ item.shortName || item.name.split(',')[0] }}</strong>
                <span class="dropdown-meta">{{ item.name }}</span>
              </li>
            </ul>
            <ul
              v-else-if="!locationQuery && searchHistory.length > 0"
              class="dropdown-list history-list"
            >
              <li class="dropdown-header">Recent Searches</li>
              <li
                v-for="(item, index) in searchHistory"
                :key="index"
                class="dropdown-item"
                @click="selectItem(item)"
              >
                <span class="history-icon">🕒</span>
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid landing-grid">
      <article class="feature-card landing-summary-card landing-card-wide">
        <p class="card-label">Current location</p>
        <h2>{{ userLocation.name }}</h2>
        <p class="meta">{{ userLocation.lat }}, {{ userLocation.lon }}</p>
        <div class="landing-uv-readout">
          <div>
            <span class="card-label">UV Index</span>
            <strong class="landing-uv-number">{{ uvData.uv_index }}</strong>
          </div>
          <div>
            <span class="card-label">Risk</span>
            <strong class="landing-uv-category">{{ uvCategory }}</strong>
          </div>
        </div>
        <p class="landing-alert">{{ uvData.alert_message }}</p>
        <p class="helper-text">{{ uvLoading ? 'Refreshing UV forecast...' : 'Latest UV guidance loaded.' }}</p>
      </article>

      <article
        v-for="highlight in dashboardHighlights"
        :key="highlight.label"
        class="feature-card metric-card landing-metric-card"
      >
        <p class="card-label">{{ highlight.label }}</p>
        <strong class="metric-value">{{ highlight.value }}</strong>
        <p class="helper-text">{{ highlight.helper }}</p>
      </article>

      <article class="feature-card icon-card">
        <p class="card-label">Recommended wear</p>
        <h3>{{ uvData.protection_guidance.clothing }}</h3>
        <p class="helper-text">Pair sunscreen with protective clothing for better coverage during high UV periods.</p>
      </article>

    </div>
  </section>
</template>
