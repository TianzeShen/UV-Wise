import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'protection', label: 'Protection' },
  { id: 'timer', label: 'Timer' },
]

const skinTypes = [
  { value: 1, label: 'Type I', note: 'Very fair, always burns' },
  { value: 2, label: 'Type II', note: 'Fair, burns easily' },
  { value: 3, label: 'Type III', note: 'Medium, sometimes burns' },
  { value: 4, label: 'Type IV', note: 'Olive, rarely burns' },
  { value: 5, label: 'Type V', note: 'Brown, very rarely burns' },
  { value: 6, label: 'Type VI', note: 'Deeply pigmented, almost never burns' },
]

export function useUvWiseApp() {
  const activePage = ref('dashboard')
  const apiBaseUrl = ref('http://localhost:8000')
  const useMockData = ref(true)
  const locationStatus = ref('Requesting location permission...')
  const adviceLoading = ref(false)
  const awarenessLoading = ref(false)
  const uvLoading = ref(false)
  const timerNow = ref(Date.now())
  const skinType = ref(Number(localStorage.getItem('uvwise-skin-type')) || 2)
  const protectionTimerEnd = ref(Number(localStorage.getItem('uvwise-timer-end')) || 0)
  const protectionTimerActive = ref(protectionTimerEnd.value > Date.now())

  const userLocation = reactive({
    lat: -37.8136,
    lon: 144.9631,
    name: 'Melbourne, VIC',
  })

  const uvData = reactive({
    uv_index: 8.5,
    color_code: '#d94841',
    alert_message: 'Your skin will start damaging in 12 minutes. Find shade now.',
    protection_guidance: {
      sunscreen_dosage: '2 teaspoons for face and neck',
      clothing: 'Wide-brimmed hat, UV-rated sunglasses, and long sleeves',
      action: 'Avoid outdoors between 11 AM and 3 PM',
    },
  })

  const awarenessData = reactive({
    cancer_statistics: {
      labels: ['2015', '2017', '2019', '2021'],
      data: [12500, 13800, 15200, 16000],
    },
    heat_trends: {
      labels: ['Jan', 'Feb', 'Mar'],
      avg_temp: [26, 27, 24],
    },
  })

  const educationCard = reactive({
    myth: "You can't get sunburnt on a cloudy day.",
    fact: 'Up to 80% of UV radiation can pass through light clouds.',
  })

  const personalizedAdvice = reactive({
    skin_type_desc: 'Fair skin, burns easily',
    risk_assessment: 'High risk of sunburn and long-term DNA damage.',
    personalized_tips: 'Increase sunscreen reapplication frequency to every 90 minutes.',
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
      label: 'UV Index',
      value: uvData.uv_index?.toFixed?.(1) ?? uvData.uv_index,
      helper: uvCategory.value,
    },
    {
      label: 'Dosage',
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
    const latestCancer =
      awarenessData.cancer_statistics.data[awarenessData.cancer_statistics.data.length - 1]
    const hottestMonth = awarenessData.heat_trends.labels.reduce(
      (best, label, index) => {
        if (awarenessData.heat_trends.avg_temp[index] > awarenessData.heat_trends.avg_temp[best.index]) {
          return { label, index }
        }
        return best
      },
      { label: awarenessData.heat_trends.labels[0], index: 0 },
    )

    return {
      latestCancer,
      hottestMonth: `${hottestMonth.label} at ${awarenessData.heat_trends.avg_temp[hottestMonth.index]}\u00B0C`,
    }
  })

  function createMockUvResponse() {
    return {
      location: userLocation.name,
      uv_index: 8.5,
      color_code: '#d94841',
      alert_message: 'Your skin will start damaging in 12 minutes. Find shade now.',
      protection_guidance: {
        sunscreen_dosage: '2 teaspoons for face and neck',
        clothing: 'Wide-brimmed hat, UV-rated sunglasses, and long sleeves',
        action: 'Avoid outdoors between 11 AM and 3 PM',
      },
    }
  }

  function createMockAwarenessResponse() {
    return {
      statistics: {
        cancer_statistics: {
          labels: ['2015', '2017', '2019', '2021'],
          data: [12500, 13800, 15200, 16000],
        },
        heat_trends: {
          labels: ['Jan', 'Feb', 'Mar'],
          avg_temp: [26, 27, 24],
        },
      },
      education: {
        myth: "You can't get sunburnt on a cloudy day.",
        fact: 'Up to 80% of UV radiation can pass through light clouds.',
      },
    }
  }

  function createMockAdviceResponse() {
    const map = {
      1: {
        skin_type_desc: 'Very fair skin, always burns quickly',
        risk_assessment: 'Very high burn risk under Australian UV conditions.',
        personalized_tips: 'Reapply sunscreen every 60-90 minutes and prioritise shade.',
      },
      2: {
        skin_type_desc: 'Fair skin, burns easily',
        risk_assessment: 'High risk of sunburn and long-term DNA damage.',
        personalized_tips: 'Increase sunscreen reapplication frequency to every 90 minutes.',
      },
      3: {
        skin_type_desc: 'Medium skin, can tan but still burns',
        risk_assessment: 'Moderate risk, especially around midday UV peaks.',
        personalized_tips: 'Use SPF 50+ and wear a hat during extended outdoor time.',
      },
      4: {
        skin_type_desc: 'Olive skin, rarely burns',
        risk_assessment: 'Lower burn risk, but UV damage still accumulates.',
        personalized_tips: 'Keep using sunscreen and protective clothing on high UV days.',
      },
      5: {
        skin_type_desc: 'Brown skin, very rarely burns',
        risk_assessment: 'Sunburn is less common, but UV exposure still harms skin.',
        personalized_tips: 'Use broad-spectrum sunscreen and do not skip eye protection.',
      },
      6: {
        skin_type_desc: 'Deeply pigmented skin, almost never burns',
        risk_assessment: 'Visible burning may be rare, but cumulative UV damage still matters.',
        personalized_tips: 'Maintain sun-safe habits and use sunscreen during prolonged exposure.',
      },
    }
    return map[skinType.value] || map[2]
  }

  function normaliseUvResponse(payload) {
    userLocation.name = payload.location || userLocation.name
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

  async function loadUvForecast() {
    uvLoading.value = true
    try {
      if (useMockData.value) {
        normaliseUvResponse(createMockUvResponse())
        return
      }
      const payload = await fetchJson(
        `${apiBaseUrl.value}/api/v1/uv/forecast?lat=${userLocation.lat}&lon=${userLocation.lon}`,
      )
      normaliseUvResponse(payload)
    } catch {
      useMockData.value = true
      normaliseUvResponse(createMockUvResponse())
    } finally {
      uvLoading.value = false
    }
  }

  async function loadAwareness() {
    awarenessLoading.value = true
    try {
      if (useMockData.value) {
        const mock = createMockAwarenessResponse()
        awarenessData.cancer_statistics = mock.statistics.cancer_statistics
        awarenessData.heat_trends = mock.statistics.heat_trends
        educationCard.myth = mock.education.myth
        educationCard.fact = mock.education.fact
        return
      }

      const [statistics, education] = await Promise.all([
        fetchJson(`${apiBaseUrl.value}/api/v1/awareness/statistics`),
        fetchJson(`${apiBaseUrl.value}/api/v1/awareness/education`),
      ])
      awarenessData.cancer_statistics = statistics.cancer_statistics
      awarenessData.heat_trends = statistics.heat_trends
      educationCard.myth = education.myth
      educationCard.fact = education.fact
    } catch {
      useMockData.value = true
      const mock = createMockAwarenessResponse()
      awarenessData.cancer_statistics = mock.statistics.cancer_statistics
      awarenessData.heat_trends = mock.statistics.heat_trends
      educationCard.myth = mock.education.myth
      educationCard.fact = mock.education.fact
    } finally {
      awarenessLoading.value = false
    }
  }

  async function loadPersonalizedAdvice() {
    adviceLoading.value = true
    try {
      if (useMockData.value) {
        Object.assign(personalizedAdvice, createMockAdviceResponse())
        return
      }
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
    } catch {
      useMockData.value = true
      Object.assign(personalizedAdvice, createMockAdviceResponse())
    } finally {
      adviceLoading.value = false
    }
  }

  function refreshAllData() {
    loadUvForecast()
    loadAwareness()
    loadPersonalizedAdvice()
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
    clearProtectionTimer,
    useMockData,
    userLocation,
    uvCategory,
    uvData,
    uvLoading,
  }
}
