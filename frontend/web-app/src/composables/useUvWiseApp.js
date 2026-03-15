import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

const pages = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'awareness', label: 'Awareness' },
  { id: 'protection', label: 'Protection' },
  { id: 'timer', label: 'Timer' },
]

const skinTypes = [
  { value: 1, label: 'Type I', note: 'Very fair, always burns', tone: '#f6d8c6', accent: '#fff2e8' },
  { value: 2, label: 'Type II', note: 'Fair, burns easily', tone: '#ebc2a5', accent: '#f8e5d4' },
  { value: 3, label: 'Type III', note: 'Medium, sometimes burns', tone: '#cf9f79', accent: '#e7c6a9' },
  { value: 4, label: 'Type IV', note: 'Olive, rarely burns', tone: '#b57e56', accent: '#d9ab82' },
  { value: 5, label: 'Type V', note: 'Brown, very rarely burns', tone: '#8a5a3b', accent: '#b18462' },
  { value: 6, label: 'Type VI', note: 'Deeply pigmented, almost never burns', tone: '#5b3928', accent: '#7a5440' },
]

export function useUvWiseApp() {
  const savedActivePage = localStorage.getItem('uvwise-active-page')
  const activePage = ref(
    pages.some((page) => page.id === savedActivePage) ? savedActivePage : 'dashboard',
  )
  const apiBaseUrl = ref('https://uv-wise.onrender.com')
  const useMockData = ref(false)
  const locationStatus = ref('Requesting location permission...')
  const locationQuery = ref('Melbourne, VIC')
  const locationSearchStatus = ref('')
  const isResolvingLocation = ref(false)
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
    melanoma_trend: {
      labels: [
        '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991',
        '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001',
        '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011',
        '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021',
        '2022', '2023',
      ],
      data: [
        425, 419, 412, 434, 484, 546, 607, 514, 512, 541,
        508, 483, 544, 617, 579, 614, 435, 533, 472, 432,
        495, 430, 470, 392, 394, 352, 362, 358, 240, 281,
        295, 277, 281, 244, 264, 241, 293, 311, 277, 266,
        272, 278,
      ],
    },
    uv_history: {
      labels: [
        '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015',
        '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024',
      ],
      average: [0.98, 1.21, 1.22, 1.23, 1.09, 1.06, 1.12, 1.18, 1.14, 1.16, 1.12, 1.16, 1.11, 1.15, 1.14, 1.14, 1.10, 1.06],
      max: [3.45, 3.54, 3.46, 3.17, 3.14, 3.04, 3.57, 3.07, 3.21, 3.10, 3.20, 3.13, 3.00, 3.00, 3.32, 3.14, 3.07, 3.03],
      min: [0.07, 0.13, 0.11, 0.06, 0.07, 0.08, 0.13, 0.12, 0.07, 0.09, 0.13, 0.09, 0.09, 0.08, 0.07, 0.09, 0.11, 0.09],
      max_dates: [
        '2007-12-22', '2008-12-22', '2009-12-22', '2010-12-22', '2011-12-22', '2012-12-22',
        '2013-12-22', '2014-12-22', '2015-12-22', '2016-12-22', '2017-12-22', '2018-12-22',
        '2019-12-22', '2020-12-22', '2021-12-22', '2022-12-22', '2023-12-22', '2024-12-22',
      ],
      min_dates: [
        '2007-06-21', '2008-06-21', '2009-06-21', '2010-06-21', '2011-06-21', '2012-06-21',
        '2013-06-21', '2014-06-21', '2015-06-21', '2016-06-21', '2017-06-21', '2018-06-21',
        '2019-06-21', '2020-06-21', '2021-06-21', '2022-06-21', '2023-06-21', '2024-06-21',
      ],
      daily_dates: [],
      daily_values: [],
    },
    protection_behaviours: {
      labels: [
        'Stayed in the shade',
        'Used SPF30 or higher sunscreen',
        'Sunglasses',
        'Broad brimmed hat',
        'Clothing covering legs',
        'Clothing covering arms',
      ],
      percentages: [56.3, 47.1, 42.3, 38.0, 33.9, 26.7],
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
    if (uvValue < 3) {
      return {
        color: '#45b36b',
        alert: 'UV is low right now. Basic protection is enough for short outdoor time.',
        action: 'Enjoy the outdoors and keep sunglasses handy.',
        dosage: '1 teaspoon for face and neck',
        clothing: 'Sunglasses and a light layer if staying out longer',
      }
    }
    if (uvValue < 6) {
      return {
        color: '#d4b632',
        alert: 'Moderate UV detected. Sunscreen and shade are recommended.',
        action: 'Use SPF and look for shade around midday.',
        dosage: '1.5 teaspoons for face and neck',
        clothing: 'Sunglasses, a cap, and breathable sleeves',
      }
    }
    if (uvValue < 8) {
      return {
        color: '#ef8f2f',
        alert: 'High UV conditions. Unprotected skin can burn quickly.',
        action: 'Reduce long exposure between late morning and mid-afternoon.',
        dosage: '2 teaspoons for face and neck',
        clothing: 'Wide-brim hat, sunglasses, and long sleeves',
      }
    }
    if (uvValue < 11) {
      return {
        color: '#d94841',
        alert: 'Very high UV conditions. Find shade and protect exposed skin now.',
        action: 'Avoid extended outdoor time between 11 AM and 3 PM.',
        dosage: '2 teaspoons for face and neck',
        clothing: 'Wide-brim hat, UV-rated sunglasses, and long sleeves',
      }
    }
    return {
      color: '#7e57c2',
      alert: 'Extreme UV conditions. Minimise outdoor exposure where possible.',
      action: 'Stay indoors during peak hours or keep in full shade.',
      dosage: '2.5 teaspoons for face and neck',
      clothing: 'Full-coverage clothing, sunglasses, and a broad-brim hat',
    }
  }

  function calculateMockUv(lat, lon) {
    const seed = Math.abs(Math.round(lat * 13 + lon * 7))
    const uv = ((seed % 110) / 10) + 1
    return Number(Math.min(12, Math.max(1, uv)).toFixed(1))
  }

  function createMockUvResponse() {
    const uvValue = calculateMockUv(userLocation.lat, userLocation.lon)
    const meta = getMockUvMeta(uvValue)
    return {
      location: userLocation.name,
      uv_index: uvValue,
      color_code: meta.color,
      alert_message: meta.alert,
      protection_guidance: {
        sunscreen_dosage: meta.dosage,
        clothing: meta.clothing,
        action: meta.action,
      },
    }
  }

  function createMockAwarenessResponse() {
    return {
      statistics: {
        melanoma_trend: {
          labels: [
            '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991',
            '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001',
            '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011',
            '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021',
            '2022', '2023',
          ],
          data: [
            425, 419, 412, 434, 484, 546, 607, 514, 512, 541,
            508, 483, 544, 617, 579, 614, 435, 533, 472, 432,
            495, 430, 470, 392, 394, 352, 362, 358, 240, 281,
            295, 277, 281, 244, 264, 241, 293, 311, 277, 266,
            272, 278,
          ],
        },
        uv_history: {
          labels: [
            '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015',
            '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024',
          ],
          average: [0.98, 1.21, 1.22, 1.23, 1.09, 1.06, 1.12, 1.18, 1.14, 1.16, 1.12, 1.16, 1.11, 1.15, 1.14, 1.14, 1.10, 1.06],
          max: [3.45, 3.54, 3.46, 3.17, 3.14, 3.04, 3.57, 3.07, 3.21, 3.10, 3.20, 3.13, 3.00, 3.00, 3.32, 3.14, 3.07, 3.03],
          min: [0.07, 0.13, 0.11, 0.06, 0.07, 0.08, 0.13, 0.12, 0.07, 0.09, 0.13, 0.09, 0.09, 0.08, 0.07, 0.09, 0.11, 0.09],
        },
        protection_behaviours: {
          labels: [
            'Stayed in the shade',
            'Used SPF30 or higher sunscreen',
            'Sunglasses',
            'Broad brimmed hat',
            'Clothing covering legs',
            'Clothing covering arms',
          ],
          percentages: [56.3, 47.1, 42.3, 38.0, 33.9, 26.7],
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
      // Always use local data for awareness
      const localData = await loadLocalAwarenessCsv()
      const mock = createMockAwarenessResponse()
      awarenessData.melanoma_trend = localData.melanoma_trend
      awarenessData.uv_history = localData.uv_history
      awarenessData.protection_behaviours = mock.statistics.protection_behaviours
      educationCard.myth = mock.education.myth
      educationCard.fact = mock.education.fact
    } catch (e) {
      console.error('Failed to load awareness data', e)
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
        locationQuery.value = userLocation.name
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
      locationSearchStatus.value = `Showing UV for ${userLocation.name}.`
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
    pages,
    personalizedAdvice,
    protectionTimerActive,
    requestLocation,
    resetProtectionTimer,
    searchLocationByName,
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
