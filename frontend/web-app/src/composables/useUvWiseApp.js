import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'protection', label: 'Protection' },
  { id: 'timer', label: 'Timer' },
]

const skinTypes = [
  { value: 1, label: 'Fair', note: 'Always burns', tone: '#f6d8c6', accent: '#fff2e8' },
  { value: 2, label: 'Light', note: 'Burns easily', tone: '#ebc2a5', accent: '#f8e5d4' },
  { value: 3, label: 'Medium', note: 'Sometimes burns', tone: '#cf9f79', accent: '#e7c6a9' },
  { value: 4, label: 'Olive', note: 'Rarely burns', tone: '#b57e56', accent: '#d9ab82' },
  { value: 5, label: 'Dark', note: 'Very rarely burns', tone: '#8a5a3b', accent: '#b18462' },
  { value: 6, label: 'Deep', note: 'Almost never burns', tone: '#5b3928', accent: '#7a5440' },
]

export function useUvWiseApp() {
  const savedActivePage = localStorage.getItem('uvwise-active-page')
  const activePage = ref(
    pages.some((page) => page.id === savedActivePage) ? savedActivePage : 'dashboard',
  )
  const apiBaseUrl = ref('https://uv-wise.onrender.com')
  const locationStatus = ref('Requesting location permission...')
  const locationQuery = ref('')
  const locationSearchStatus = ref('')
  const isResolvingLocation = ref(false)
  const adviceLoading = ref(false)
  const awarenessLoading = ref(false)
  const uvLoading = ref(false)
  const timerNow = ref(Date.now())
  const skinType = ref(Number(localStorage.getItem('uvwise-skin-type')) || 2)
  const protectionTimerEnd = ref(Number(localStorage.getItem('uvwise-timer-end')) || 0)
  const protectionTimerActive = ref(protectionTimerEnd.value > Date.now())
  const searchHistory = ref(JSON.parse(localStorage.getItem('uvwise-search-history') || '[]'))
  const locationSuggestions = ref([])

  const userLocation = reactive({
    lat: -37.8136,
    lon: 144.9631,
    name: 'Melbourne, VIC',
  })

  const uvData = reactive({
    uv_index: null,
    color_code: '#d94841',
    alert_message: 'Loading UV data...',
    protection_guidance: {
      sunscreen_dosage: 'Loading...',
      clothing: 'Loading...',
      action: 'Loading...',
    },
  })

  const awarenessData = reactive({
    melanoma_trend: {
      labels: [],
      data: [],
    },
    uv_history: {
      labels: [],
      average: [],
      max: [],
      min: [],
      max_dates: [],
      min_dates: [],
      daily_dates: [],
      daily_values: [],
    },
    protection_behaviours: {
      labels: [],
      percentages: [],
    },
  })

  const educationCard = reactive({
    myth: 'Loading...',
    fact: 'Loading...',
  })

  const personalizedAdvice = reactive({
    skin_type_desc: 'Loading...',
    risk_assessment: 'Loading...',
    personalized_tips: 'Loading...',
    sunscreen_dosage: 'Loading...',
    clothing: 'Loading...',
  })

  const uvCategory = computed(() => {
    const value = Number(uvData.uv_index || 0)
    if (value < 3) return 'Low'
    if (value < 6) return 'Moderate'
    if (value < 8) return 'High'
    if (value < 11) return 'Very High'
    return 'Extreme'
  })

  const dashboardHighlights = computed(() => [
    {
      label: 'Sunscreen Dosage',
      value: uvData.protection_guidance.sunscreen_dosage,
      helper: 'Based on current UV conditions',
    },
    {
      label: 'Outdoor action',
      value: uvData.protection_guidance.action,
      helper: 'Use this as your daily planning guide',
    },
  ])

  const clothingItems = computed(() => {
    const text = uvData.protection_guidance.clothing.toLowerCase()
    const items = [
      { icon: 'hat', label: 'Hat', show: text.includes('hat') },
      { icon: 'glasses', label: 'Sunglasses', show: text.includes('sunglass') },
      { icon: 'shirt', label: 'Long sleeves', show: text.includes('sleeve') },
    ]
    return items.filter((item) => item.show)
  })

  const timerRemainingMs = computed(() => Math.max(0, protectionTimerEnd.value - timerNow.value))

  const timerDisplay = computed(() => {
    const totalSeconds = Math.floor(timerRemainingMs.value / 1000)
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
    const seconds = String(totalSeconds % 60).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  })

  const awarenessSummary = computed(() => {
    if (
      !awarenessData.melanoma_trend.data ||
      !awarenessData.melanoma_trend.data.length ||
      !awarenessData.uv_history.labels ||
      !awarenessData.uv_history.labels.length ||
      !awarenessData.protection_behaviours.percentages ||
      !awarenessData.protection_behaviours.percentages.length
    ) {
      return {
        latestCancer: 0,
        hottestMonth: 'Loading...',
        topBehaviour: 'Loading...',
      }
    }

    const latestCancer =
      awarenessData.melanoma_trend.data[awarenessData.melanoma_trend.data.length - 1]
    const peakUvYear = awarenessData.uv_history.labels.reduce(
      (best, label, index) => {
        if (awarenessData.uv_history.max[index] > awarenessData.uv_history.max[best.index]) {
          return { label, index }
        }
        return best
      },
      { label: awarenessData.uv_history.labels[0], index: 0 },
    )
    const topBehaviourIndex = awarenessData.protection_behaviours.percentages.indexOf(
      Math.max(...awarenessData.protection_behaviours.percentages),
    )

    return {
      latestCancer,
      hottestMonth: `${peakUvYear.label} max UV ${awarenessData.uv_history.max[peakUvYear.index].toFixed(2)}`,
      topBehaviour: `${awarenessData.protection_behaviours.labels[topBehaviourIndex]} (${awarenessData.protection_behaviours.percentages[topBehaviourIndex]}%)`,
    }
  })

  function getMockUvMeta(uvValue) {
    return {}
  }

  function calculateMockUv(lat, lon) {
    return 0
  }

  function createMockUvResponse() {
    return {}
  }

  function createMockAwarenessResponse() {
    return {}
  }

  function createMockAdviceResponse() {
    return {}
  }

  function normaliseUvResponse(payload) {
    // If we have a specific user-selected location name (e.g. from Nominatim), preserve it.
    // Otherwise, fallback to what the backend returns.
    if (!userLocation.name) {
      userLocation.name = payload.location
    }
    uvData.uv_index = payload.uv_index
    uvData.color_code = payload.color_code
    uvData.alert_message = payload.alert_message
    uvData.protection_guidance = payload.protection_guidance
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return response.json()
  }

  async function fetchText(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return response.text()
  }

  function parseCsvRows(csvText) {
    return csvText
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(',').map((cell) => cell.trim()))
      .filter((row) => row.length >= 2)
  }

  function parseMelanomaCsv(csvText) {
    const rows = parseCsvRows(csvText)
    return {
      labels: rows.map((row) => row[0]),
      data: rows.map((row) => Number(row[1])),
    }
  }

  function parseUvCsv(csvText) {
    const rows = parseCsvRows(csvText)
    const daily_dates = rows.map((row) => row[0])
    const daily_values = rows.map((row) => Number(row[1]))
    const yearly = new Map()

    rows.forEach(([date, valueText]) => {
      const value = Number(valueText)
      const year = date.slice(0, 4)
      const current = yearly.get(year) || {
        values: [],
        max: { value: -Infinity, date: '' },
        min: { value: Infinity, date: '' },
      }

      current.values.push(value)
      if (value > current.max.value) current.max = { value, date }
      if (value < current.min.value) current.min = { value, date }
      yearly.set(year, current)
    })

    const labels = Array.from(yearly.keys())

    return {
      labels,
      average: labels.map((year) => {
        const values = yearly.get(year).values
        return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
      }),
      max: labels.map((year) => Number(yearly.get(year).max.value.toFixed(2))),
      min: labels.map((year) => Number(yearly.get(year).min.value.toFixed(2))),
      max_dates: labels.map((year) => yearly.get(year).max.date),
      min_dates: labels.map((year) => yearly.get(year).min.date),
      daily_dates,
      daily_values,
    }
  }

  async function loadLocalAwarenessCsv() {
    const [melanomaCsv, uvCsv] = await Promise.all([
      fetchText('/data/melanoma_genz_yearly.csv'),
      fetchText('/data/melbourne_uv_daily_2007_2024.csv'),
    ])

    return {
      melanoma_trend: parseMelanomaCsv(melanomaCsv),
      uv_history: parseUvCsv(uvCsv),
    }
  }

  async function loadUvForecast() {
    uvLoading.value = true
    try {
      const payload = await fetchJson(
        `${apiBaseUrl.value}/api/v1/uv/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}`,
      )
      normaliseUvResponse(payload)
    } catch (e) {
      console.error('Failed to load UV forecast', e)
      uvData.alert_message = 'Failed to load UV data. Please check your connection.'
      uvData.uv_index = null
      uvData.protection_guidance = {
        sunscreen_dosage: 'Unavailable',
        clothing: 'Unavailable',
        action: 'Unavailable',
      }
    } finally {
      uvLoading.value = false
    }
  }

  async function loadAwareness() {
    awarenessLoading.value = true
    try {
      // Always use local data for awareness
      const localData = await loadLocalAwarenessCsv()
      awarenessData.melanoma_trend = localData.melanoma_trend
      awarenessData.uv_history = localData.uv_history
      
      awarenessData.protection_behaviours = {
        labels: [],
        percentages: [],
      }
      educationCard.myth = 'Loading...'
      educationCard.fact = 'Loading...'
    } catch (e) {
      console.error('Failed to load awareness data', e)
    } finally {
      awarenessLoading.value = false
    }
  }

  async function loadPersonalizedAdvice() {
    adviceLoading.value = true
    try {
      const payload = await fetchJson(`${apiBaseUrl.value}/api/v1/protection/personalized-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skin_type: skinType.value,
          current_uv: uvData.uv_index,
        }),
      })
      Object.assign(personalizedAdvice, payload)
    } catch (e) {
      console.error('Failed to load personalized advice', e)
      Object.assign(personalizedAdvice, {
        skin_type_desc: 'Unavailable',
        risk_assessment: 'Failed to load advice.',
        personalized_tips: 'Please check your connection.',
        sunscreen_dosage: 'Unavailable',
        clothing: 'Unavailable',
      })
    } finally {
      adviceLoading.value = false
    }
  }

  async function refreshAllData() {
    await loadUvForecast()
    await Promise.all([loadAwareness(), loadPersonalizedAdvice()])
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      locationStatus.value = 'Geolocation is unavailable in this browser. Using demo location.'
      refreshAllData()
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.lat = Number(position.coords.latitude.toFixed(4))
        userLocation.lon = Number(position.coords.longitude.toFixed(4))
        // Clear name so backend response can fill it
        userLocation.name = '' 
        locationSearchStatus.value = ''
        locationStatus.value = 'Live location detected successfully.'
        refreshAllData()
      },
      () => {
        locationStatus.value = 'Location permission denied. Using Melbourne demo data.'
        refreshAllData()
      },
      {
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 300000,
      },
    )
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  function addToSearchHistory(location) {
    const exists = searchHistory.value.some((item) => item.name === location.name)
    if (!exists) {
      searchHistory.value.unshift(location)
      if (searchHistory.value.length > 5) searchHistory.value.pop()
      localStorage.setItem('uvwise-search-history', JSON.stringify(searchHistory.value))
    }
  }

  async function fetchLocationSuggestions(query) {
    if (!query || query.length < 3) {
      locationSuggestions.value = []
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=10&countrycodes=au&q=${encodeURIComponent(query)}`,
      )
      if (!response.ok) return
      const results = await response.json()

      const formattedResults = results.map((r) => ({
        lat: Number(r.lat),
        lon: Number(r.lon),
        name: r.display_name,
        shortName: r.display_name.split(',').slice(0, 2).join(', '),
      }))

      // Sort by distance if userLocation is valid
      if (userLocation.lat && userLocation.lon) {
        formattedResults.forEach((r) => {
          r.distance = calculateDistance(userLocation.lat, userLocation.lon, r.lat, r.lon)
        })
        formattedResults.sort((a, b) => a.distance - b.distance)
      }

      locationSuggestions.value = formattedResults
    } catch (e) {
      console.error('Failed to fetch suggestions', e)
    }
  }

  async function selectLocation(location) {
    userLocation.lat = location.lat
    userLocation.lon = location.lon
    userLocation.name = location.shortName || location.name
    locationQuery.value = userLocation.name
    locationSuggestions.value = []
    // locationSearchStatus.value = `Showing UV for ${userLocation.name}.`
    locationSearchStatus.value = ''
    
    addToSearchHistory({
      name: userLocation.name,
      lat: userLocation.lat,
      lon: userLocation.lon,
    })
    
    await refreshAllData()
  }

  async function searchLocationByName() {
    const query = locationQuery.value.trim()
    if (!query) {
      locationSearchStatus.value = 'Enter a location name to search.'
      return
    }

    isResolvingLocation.value = true
    locationSearchStatus.value = 'Searching for location...'

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
      )
      if (!response.ok) {
        throw new Error(`Location search failed: ${response.status}`)
      }

      const results = await response.json()
      if (!results.length) {
        locationSearchStatus.value = 'No matching location found. Try a city, suburb, or postcode.'
        return
      }

      const result = results[0]
      userLocation.lat = Number(Number(result.lat).toFixed(4))
      userLocation.lon = Number(Number(result.lon).toFixed(4))
      userLocation.name = result.display_name.split(',').slice(0, 2).join(', ')
      locationQuery.value = userLocation.name
      // locationSearchStatus.value = `Showing UV for ${userLocation.name}.`
      locationSearchStatus.value = ''
      await refreshAllData()
    } catch {
      locationSearchStatus.value = 'Location search is unavailable right now. Please try again.'
    } finally {
      isResolvingLocation.value = false
    }
  }

  function startProtectionTimer() {
    protectionTimerEnd.value = Date.now() + 2 * 60 * 60 * 1000
    protectionTimerActive.value = true
    localStorage.setItem('uvwise-timer-end', String(protectionTimerEnd.value))
  }

  function resetProtectionTimer() {
    startProtectionTimer()
  }

  function clearProtectionTimer() {
    protectionTimerEnd.value = 0
    protectionTimerActive.value = false
    localStorage.removeItem('uvwise-timer-end')
  }

  watch(skinType, () => {
    localStorage.setItem('uvwise-skin-type', String(skinType.value))
    loadPersonalizedAdvice()
  })

  watch(activePage, () => {
    localStorage.setItem('uvwise-active-page', activePage.value)
  })

  watch([timerRemainingMs, protectionTimerEnd], () => {
    protectionTimerActive.value = protectionTimerEnd.value > Date.now()
    if (!protectionTimerActive.value && protectionTimerEnd.value !== 0) {
      localStorage.removeItem('uvwise-timer-end')
    }
  })

  let intervalId = null

  onMounted(() => {
    intervalId = window.setInterval(() => {
      timerNow.value = Date.now()
    }, 1000)
    requestLocation()
  })

  onBeforeUnmount(() => {
    if (intervalId) window.clearInterval(intervalId)
  })

  return {
    activePage,
    adviceLoading,
    apiBaseUrl,
    awarenessData,
    awarenessLoading,
    awarenessSummary,
    clothingItems,
    dashboardHighlights,
    educationCard,
    isResolvingLocation,
    locationStatus,
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
    fetchLocationSuggestions,
    selectLocation,
    skinType,
    skinTypes,
    startProtectionTimer,
    timerDisplay,
    clearProtectionTimer,
    userLocation,
    uvCategory,
    uvData,
    uvLoading,
  }
}
