<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import { RouterLink } from 'vue-router'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  recyclingLocations,
} from '../data/recyclingLocations.js'

/*
 * Custom marker.
 * This avoids Leaflet's default PNG marker path problem
 * in Vite and Cloudflare production builds.
 */
const recyclingMarkerIcon = L.divIcon({
  className: 'custom-recycling-marker',

  html: `
    <div class="marker-pin">
      <span>♻</span>
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -40],
})

const mapElement = ref(null)

const suburbSearch = ref('')
const wasteType = ref('')

const userPosition = ref(null)

const isLocating = ref(false)
const locationError = ref('')

const isRouting = ref(false)
const routingLocationId = ref(null)
const routeError = ref('')
const routeInfo = ref(null)

const searchStatus = ref('')

let map = null
let locationsLayer = null
let userMarker = null
let routeLayer = null

const locationMarkers = new Map()

const wasteTypes = computed(() => {
  const values =
    recyclingLocations.flatMap(
      (location) => location.accepts,
    )

  return [
    ...new Set(values),
  ].sort()
})

const filteredLocations = computed(() => {
  const search =
    suburbSearch.value
      .trim()
      .toLowerCase()

  return recyclingLocations.filter(
    (location) => {
      const searchableText = [
        location.name,
        location.address,
        location.suburb,
        location.postcode,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !search ||
        searchableText.includes(search)

      const matchesWasteType =
        !wasteType.value ||
        location.accepts.includes(
          wasteType.value,
        )

      return (
        matchesSearch &&
        matchesWasteType
      )
    },
  )
})

const displayedLocations = computed(() => {
  const locations =
    filteredLocations.value.map(
      (location) => {
        const distanceKm =
          userPosition.value
            ? calculateDistanceKm(
                userPosition.value.latitude,
                userPosition.value.longitude,
                location.latitude,
                location.longitude,
              )
            : null

        return {
          ...location,
          distanceKm,
        }
      },
    )

  if (userPosition.value) {
    locations.sort(
      (first, second) =>
        first.distanceKm -
        second.distanceKm,
    )
  }

  return locations
})

function degreesToRadians(value) {
  return value * (Math.PI / 180)
}

function calculateDistanceKm(
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude,
) {
  const earthRadiusKm = 6371

  const latitudeDifference =
    degreesToRadians(
      endLatitude -
        startLatitude,
    )

  const longitudeDifference =
    degreesToRadians(
      endLongitude -
        startLongitude,
    )

  const firstLatitude =
    degreesToRadians(
      startLatitude,
    )

  const secondLatitude =
    degreesToRadians(
      endLatitude,
    )

  const calculation =
    Math.sin(
      latitudeDifference / 2,
    ) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(
        longitudeDifference / 2,
      ) ** 2

  const angle =
    2 *
    Math.atan2(
      Math.sqrt(calculation),
      Math.sqrt(1 - calculation),
    )

  return (
    Math.round(
      earthRadiusKm *
        angle *
        10,
    ) / 10
  )
}

function initialiseMap() {
  if (!mapElement.value) {
    return
  }

  map = L.map(
    mapElement.value,
    {
      keyboard: true,
      scrollWheelZoom: true,
    },
  ).setView(
    [
      -37.91,
      145.13,
    ],
    11,
  )

  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,

      attribution:
        '&copy; OpenStreetMap contributors',
    },
  ).addTo(map)

  locationsLayer =
    L.layerGroup().addTo(map)

  updateLocationMarkers()

  nextTick(() => {
    map.invalidateSize()
    fitMapToResults()
  })
}

function updateLocationMarkers() {
  if (
    !map ||
    !locationsLayer
  ) {
    return
  }

  locationsLayer.clearLayers()
  locationMarkers.clear()

  filteredLocations.value.forEach(
    (location) => {
      const marker = L.marker(
        [
          location.latitude,
          location.longitude,
        ],
        {
          title: location.name,
          keyboard: true,
          icon: recyclingMarkerIcon,
        },
      )

      marker.bindPopup(
        `
          <strong>${location.name}</strong>
          <br>
          ${location.suburb}
          ${location.postcode}
          <br>
          Accepts:
          ${location.accepts.join(', ')}
        `,
      )

      marker.addTo(
        locationsLayer,
      )

      locationMarkers.set(
        location.id,
        marker,
      )
    },
  )
}

function fitMapToResults() {
  if (!map) {
    return
  }

  const points =
    filteredLocations.value.map(
      (location) => [
        location.latitude,
        location.longitude,
      ],
    )

  if (userPosition.value) {
    points.push([
      userPosition.value.latitude,
      userPosition.value.longitude,
    ])
  }

  if (points.length === 0) {
    return
  }

  if (points.length === 1) {
    map.setView(
      points[0],
      14,
    )

    return
  }

  map.fitBounds(
    L.latLngBounds(points),
    {
      padding: [
        35,
        35,
      ],

      maxZoom: 14,
    },
  )
}

function searchLocations() {
  clearRoute()

  const count =
    filteredLocations.value.length

  searchStatus.value =
    `${count} location${count === 1 ? '' : 's'} found.`

  updateLocationMarkers()

  nextTick(() => {
    fitMapToResults()
  })
}

function resetSearch() {
  suburbSearch.value = ''
  wasteType.value = ''
  searchStatus.value = ''
  locationError.value = ''

  clearRoute()

  nextTick(() => {
    updateLocationMarkers()
    fitMapToResults()
  })
}

function focusLocation(location) {
  if (!map) {
    return
  }

  map.setView(
    [
      location.latitude,
      location.longitude,
    ],
    15,
  )

  const marker =
    locationMarkers.get(
      location.id,
    )

  marker?.openPopup()
}

function addUserMarker() {
  if (
    !map ||
    !userPosition.value
  ) {
    return
  }

  if (userMarker) {
    userMarker.remove()
  }

  userMarker =
    L.circleMarker(
      [
        userPosition.value.latitude,
        userPosition.value.longitude,
      ],
      {
        radius: 9,
        weight: 3,
        opacity: 1,
        fillOpacity: 0.85,
      },
    ).addTo(map)

  userMarker.bindPopup(
    '<strong>Your current location</strong>',
  )

  userMarker.openPopup()
}

function useMyLocation() {
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value =
      'Geolocation is not supported by this browser.'

    return
  }

  isLocating.value = true

  navigator.geolocation
    .getCurrentPosition(
      (position) => {
        userPosition.value = {
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,
        }

        isLocating.value = false

        addUserMarker()

        searchStatus.value =
          'Your location has been added. Results are sorted by straight-line distance.'

        nextTick(() => {
          fitMapToResults()
        })
      },

      (error) => {
        isLocating.value = false

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          locationError.value =
            'Location permission was denied. Allow location access in your browser and try again.'

          return
        }

        locationError.value =
          'Your current location could not be determined. Please try again.'
      },

      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
}

function clearRoute() {
  if (
    routeLayer &&
    map
  ) {
    map.removeLayer(
      routeLayer,
    )
  }

  routeLayer = null
  routeInfo.value = null
  routeError.value = ''
  routingLocationId.value = null
}

async function planRoute(location) {
  routeError.value = ''
  routeInfo.value = null

  if (!userPosition.value) {
    routeError.value =
      'Use My Location first so the map has a starting point for the route.'

    return
  }

  isRouting.value = true

  routingLocationId.value =
    location.id

  if (
    routeLayer &&
    map
  ) {
    map.removeLayer(
      routeLayer,
    )

    routeLayer = null
  }

  try {
    const startLongitude =
      userPosition.value.longitude

    const startLatitude =
      userPosition.value.latitude

    const endLongitude =
      location.longitude

    const endLatitude =
      location.latitude

    const routeUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${startLongitude},${startLatitude};` +
      `${endLongitude},${endLatitude}` +
      '?overview=full&geometries=geojson'

    const response =
      await fetch(routeUrl)

    if (!response.ok) {
      throw new Error(
        'Routing service returned an error.',
      )
    }

    const data =
      await response.json()

    const route =
      data.routes?.[0]

    if (!route) {
      throw new Error(
        'No driving route was found.',
      )
    }

    routeLayer =
      L.geoJSON(
        route.geometry,
        {
          style: {
            color: '#347521',
            weight: 6,
            opacity: 0.85,
          },
        },
      ).addTo(map)

    map.fitBounds(
      routeLayer.getBounds(),
      {
        padding: [
          40,
          40,
        ],
      },
    )

    routeInfo.value = {
      destination:
        location.name,

      distanceKm:
        (
          route.distance /
          1000
        ).toFixed(1),

      durationMinutes:
        Math.max(
          1,
          Math.round(
            route.duration /
              60,
          ),
        ),
    }
  } catch (error) {
    console.error(
      'Route planning failed:',
      error,
    )

    routeError.value =
      'The route could not be calculated. Please try again.'
  } finally {
    isRouting.value = false
    routingLocationId.value = null
  }
}

watch(
  [
    suburbSearch,
    wasteType,
  ],

  () => {
    searchStatus.value = ''

    updateLocationMarkers()
  },
)

onMounted(() => {
  initialiseMap()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <main>
    <section class="location-hero">
      <div class="container">
        <p class="eyebrow">
          Interactive recycling map
        </p>

        <h1>
          Find a Recycling Location
        </h1>

        <p class="hero-description">
          Search recycling points, use your
          current location and plan a driving
          route to a selected facility.
        </p>

        <form
          class="row g-3 location-search-form"
          @submit.prevent="
            searchLocations
          "
        >
          <div class="col-12 col-lg-5">
            <label
              class="visually-hidden"
              for="location-search"
            >
              Suburb, postcode or location
            </label>

            <div class="search-control">
              <span aria-hidden="true">
                📍
              </span>

              <input
                id="location-search"
                v-model="suburbSearch"
                type="search"
                placeholder="Enter suburb or postcode"
                maxlength="80"
              />
            </div>
          </div>

          <div class="col-12 col-lg-3">
            <label
              class="visually-hidden"
              for="waste-type"
            >
              Waste type
            </label>

            <div class="search-control">
              <span aria-hidden="true">
                ♻
              </span>

              <select
                id="waste-type"
                v-model="wasteType"
              >
                <option value="">
                  All waste types
                </option>

                <option
                  v-for="
                    option in wasteTypes
                  "
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <div class="col-6 col-lg-2">
            <button
              class="btn search-button"
              type="submit"
            >
              Search
            </button>
          </div>

          <div class="col-6 col-lg-2">
            <button
              class="btn location-button"
              type="button"
              :disabled="isLocating"
              @click="useMyLocation"
            >
              {{
                isLocating
                  ? 'Locating…'
                  : 'Use My Location'
              }}
            </button>
          </div>
        </form>

        <div class="search-actions">
          <button
            type="button"
            class="reset-search-button"
            @click="resetSearch"
          >
            Reset search
          </button>

          <p
            v-if="searchStatus"
            class="search-status"
            role="status"
            aria-live="polite"
          >
            {{ searchStatus }}
          </p>
        </div>

        <p
          v-if="locationError"
          class="location-error"
          role="alert"
        >
          {{ locationError }}
        </p>
      </div>
    </section>

    <section class="location-content">
      <div class="container">
        <div class="row g-4">
          <div class="col-12 col-xl-7">
            <article class="map-card">
              <div class="map-heading">
                <div>
                  <p class="feature-label">
                    Interactive map
                  </p>

                  <h2>
                    Recycling locations
                  </h2>
                </div>

                <span class="map-count">
                  {{
                    displayedLocations.length
                  }}
                  shown
                </span>
              </div>

              <div
                ref="mapElement"
                class="map-panel"
                role="application"
                aria-label="Interactive map showing recycling locations"
              ></div>

              <div
                v-if="routeInfo"
                class="route-summary"
                aria-live="polite"
              >
                <div>
                  <span>
                    Destination
                  </span>

                  <strong>
                    {{
                      routeInfo.destination
                    }}
                  </strong>
                </div>

                <div>
                  <span>
                    Driving distance
                  </span>

                  <strong>
                    {{
                      routeInfo.distanceKm
                    }}
                    km
                  </strong>
                </div>

                <div>
                  <span>
                    Estimated duration
                  </span>

                  <strong>
                    {{
                      routeInfo.durationMinutes
                    }}
                    min
                  </strong>
                </div>

                <button
                  type="button"
                  class="clear-route-button"
                  @click="clearRoute"
                >
                  Clear route
                </button>
              </div>

              <p
                v-if="routeError"
                class="route-error"
                role="alert"
              >
                {{ routeError }}
              </p>

              <p class="map-note">
                Map data © OpenStreetMap
                contributors. Route estimates
                are provided for demonstration
                purposes.
              </p>
            </article>
          </div>

          <div class="col-12 col-xl-5">
            <div class="results-heading">
              <div>
                <p class="feature-label">
                  POI search
                </p>

                <h2>
                  Nearby Locations
                </h2>
              </div>
            </div>

            <div
              v-if="
                displayedLocations.length >
                0
              "
              class="location-list"
            >
              <article
                v-for="
                  location in
                    displayedLocations
                "
                :key="location.id"
                class="location-card"
              >
                <div class="location-title-row">
                  <div class="location-icon">
                    {{ location.icon }}
                  </div>

                  <div>
                    <h3>
                      {{ location.name }}
                    </h3>

                    <p class="address">
                      📍
                      {{ location.address }}
                    </p>
                  </div>
                </div>

                <p
                  v-if="
                    location.distanceKm !==
                    null
                  "
                  class="distance"
                >
                  Approximately
                  {{ location.distanceKm }}
                  km from your current
                  location
                </p>

                <div class="accepted-items">
                  <span
                    v-for="
                      item in
                        location.accepts
                    "
                    :key="item"
                  >
                    {{ item }}
                  </span>
                </div>

                <div class="location-actions">
                  <button
                    type="button"
                    class="map-action-button"
                    @click="
                      focusLocation(
                        location,
                      )
                    "
                  >
                    Show on Map
                  </button>

                  <button
                    type="button"
                    class="route-button"
                    :disabled="
                      isRouting
                    "
                    @click="
                      planRoute(
                        location,
                      )
                    "
                  >
                    {{
                      routingLocationId ===
                      location.id
                        ? 'Planning…'
                        : 'Plan Route'
                    }}
                  </button>

                  <RouterLink
                    class="details-link"
                    :to="{
                      name:
                        'location-details',

                      params: {
                        id: location.id,
                      },
                    }"
                  >
                    Details
                  </RouterLink>
                </div>
              </article>
            </div>

            <div
              v-else
              class="no-results"
              role="status"
            >
              <div class="no-results-icon">
                🔍
              </div>

              <h3>
                No locations found
              </h3>

              <p>
                Try another suburb,
                postcode or waste type.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.location-hero {
  padding: 54px 0 46px;

  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99)
        0%,
      rgba(250, 252, 247, 0.95)
        58%,
      rgba(250, 252, 247, 0.45)
        100%
    ),
    url('/images/melbourne-eco-hero.png');

  background-position: center 47%;
  background-size: cover;
}

.eyebrow,
.feature-label {
  margin-bottom: 7px;
  color: #438c2b;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.location-hero h1 {
  margin-bottom: 10px;
  color: #15191e;

  font-size:
    clamp(
      2.4rem,
      5vw,
      3.4rem
    );

  font-weight: 750;
}

.hero-description {
  max-width: 760px;
  margin-bottom: 28px;
  color: #475569;
  font-size: 19px;
}

.location-search-form {
  max-width: 1160px;
}

.search-control {
  min-height: 60px;
  padding: 0 16px;

  display: flex;
  align-items: center;
  gap: 11px;

  border: 1px solid #b9c4b6;
  border-radius: 10px;

  background-color: #ffffff;
}

.search-control:focus-within {
  border-color: #438c2b;

  box-shadow:
    0 0 0 3px
    rgba(67, 140, 43, 0.15);
}

.search-control span {
  font-size: 21px;
}

.search-control input,
.search-control select {
  width: 100%;

  border: none;
  outline: none;

  background-color: transparent;
  color: #334155;
  font: inherit;
}

.search-button,
.location-button {
  width: 100%;
  min-height: 60px;

  border-radius: 10px;

  font-weight: 700;
}

.search-button {
  background-color: #438c2b;
  color: #ffffff;
}

.search-button:hover {
  background-color: #347521;
  color: #ffffff;
}

.location-button {
  border: 1px solid #438c2b;
  background-color: #ffffff;
  color: #347521;
}

.location-button:hover:not(
    :disabled
  ) {
  background-color: #edf7e9;
}

.search-button:focus-visible,
.location-button:focus-visible,
.reset-search-button:focus-visible,
.map-action-button:focus-visible,
.route-button:focus-visible,
.details-link:focus-visible,
.clear-route-button:focus-visible {
  outline:
    3px solid
    rgba(67, 140, 43, 0.32);

  outline-offset: 2px;
}

.search-actions {
  min-height: 31px;
  margin-top: 13px;

  display: flex;
  align-items: center;
  gap: 18px;
}

.reset-search-button {
  padding: 0;

  border: none;

  background: transparent;
  color: #347521;

  cursor: pointer;
  font-weight: 650;

  text-decoration: underline;
  text-underline-offset: 3px;
}

.search-status {
  margin: 0;
  color: #475569;
  font-size: 14px;
}

.location-error,
.route-error {
  margin: 12px 0 0;
  padding: 11px 13px;

  border-radius: 8px;

  background-color: #fff0ee;
  color: #b42318;

  font-weight: 600;
}

.location-content {
  padding: 38px 0 60px;
  background-color: #f8faf7;
}

.map-card,
.location-card,
.no-results {
  border: 1px solid #dfe7dc;
  border-radius: 16px;

  background-color: #ffffff;

  box-shadow:
    0 8px 24px
    rgba(31, 58, 30, 0.07);
}

.map-card {
  padding: 20px;
}

.map-heading,
.results-heading {
  margin-bottom: 16px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 16px;
}

.map-heading h2,
.results-heading h2 {
  margin: 0;

  color: #17202a;
  font-size: 25px;
  font-weight: 720;
}

.map-count {
  padding: 6px 10px;

  border-radius: 999px;

  background-color: #edf7e9;
  color: #347521;

  font-size: 13px;
  font-weight: 700;
}

.map-panel {
  width: 100%;
  height: 560px;

  overflow: hidden;

  border-radius: 12px;

  background-color: #e7eee4;
}

/*
 * Custom Leaflet recycling marker.
 */
:deep(.custom-recycling-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 3px solid #ffffff;

  border-radius:
    50%
    50%
    50%
    0;

  background-color: #438c2b;

  box-shadow:
    0 4px 10px
    rgba(0, 0, 0, 0.28);

  transform:
    rotate(-45deg);
}

:deep(.marker-pin span) {
  display: block;

  color: #ffffff;

  font-size: 19px;
  line-height: 1;

  transform:
    rotate(45deg);
}

:deep(.leaflet-popup-content) {
  line-height: 1.55;
}

.route-summary {
  margin-top: 16px;
  padding: 16px;

  display: grid;

  grid-template-columns:
    1.4fr
    1fr
    1fr
    auto;

  gap: 15px;

  align-items: center;

  border: 1px solid #b9dab0;
  border-radius: 10px;

  background-color: #edf7e9;
}

.route-summary div {
  display: grid;
  gap: 3px;
}

.route-summary span {
  color: #64748b;
  font-size: 12px;
}

.route-summary strong {
  color: #24451c;
}

.clear-route-button {
  min-height: 40px;
  padding: 8px 12px;

  border: 1px solid #438c2b;
  border-radius: 7px;

  background-color: #ffffff;
  color: #347521;

  cursor: pointer;
  font-weight: 650;
}

.map-note {
  margin: 14px 2px 0;

  color: #64748b;

  font-size: 12px;
}

.location-list {
  display: grid;
  gap: 16px;
}

.location-card {
  padding: 20px;
}

.location-title-row {
  display: grid;

  grid-template-columns:
    54px
    1fr;

  gap: 14px;

  align-items: center;
}

.location-icon {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background-color: #edf7e9;

  font-size: 25px;
}

.location-card h3 {
  margin: 0 0 4px;

  color: #17202a;

  font-size: 18px;
  font-weight: 720;
}

.address {
  margin: 0;

  color: #64748b;

  font-size: 13px;
  line-height: 1.5;
}

.distance {
  margin: 13px 0 0;

  color: #347521;

  font-size: 13px;
  font-weight: 650;
}

.accepted-items {
  margin-top: 14px;

  display: flex;
  flex-wrap: wrap;

  gap: 7px;
}

.accepted-items span {
  padding: 5px 9px;

  border-radius: 999px;

  background-color: #f1f5ef;
  color: #475569;

  font-size: 12px;
}

.location-actions {
  margin-top: 17px;

  display: grid;

  grid-template-columns:
    1fr
    1fr
    auto;

  gap: 8px;
}

.map-action-button,
.route-button,
.details-link {
  min-height: 41px;
  padding: 8px 11px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 7px;

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;
}

.map-action-button {
  border: 1px solid #c2d2bd;

  background-color: #ffffff;
  color: #334155;
}

.map-action-button:hover {
  background-color: #f5f8f4;
}

.route-button {
  border: 1px solid #438c2b;

  background-color: #438c2b;
  color: #ffffff;
}

.route-button:hover:not(
    :disabled
  ) {
  background-color: #347521;
}

.route-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.details-link {
  border: 1px solid #438c2b;

  color: #347521;
}

.details-link:hover {
  background-color: #edf7e9;
}

.no-results {
  padding: 45px 20px;

  text-align: center;
}

.no-results-icon {
  margin-bottom: 10px;

  font-size: 36px;
}

.no-results h3 {
  color: #17202a;
}

.no-results p {
  margin: 0;
  color: #64748b;
}

@media (max-width: 991px) {
  .map-panel {
    height: 480px;
  }

  .route-summary {
    grid-template-columns:
      repeat(
        2,
        1fr
      );
  }
}

@media (max-width: 576px) {
  .location-hero {
    padding: 42px 0 36px;
  }

  .map-card {
    padding: 12px;
  }

  .map-panel {
    height: 390px;
  }

  .route-summary,
  .location-actions {
    grid-template-columns:
      1fr;
  }

  .search-actions {
    align-items: flex-start;
    flex-direction: column;

    gap: 7px;
  }
}
</style>