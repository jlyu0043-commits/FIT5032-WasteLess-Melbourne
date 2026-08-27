<script setup>
import { ref } from 'vue'
import LocationCard from '../components/LocationCard.vue'
import { recyclingLocations } from '../data/recyclingLocations.js'

const suburbSearch = ref('')
const wasteType = ref('')
const displayedLocations = ref(recyclingLocations)

function searchLocations() {
  const searchValue = suburbSearch.value.trim().toLowerCase()
  const selectedWasteType = wasteType.value

  displayedLocations.value = recyclingLocations.filter((location) => {
    const locationText = `
      ${location.name}
      ${location.suburb}
      ${location.postcode}
    `.toLowerCase()

    const matchesLocation =
      searchValue === '' ||
      locationText.includes(searchValue)

    const matchesWasteType =
      selectedWasteType === '' ||
      location.accepts.includes(selectedWasteType)

    return matchesLocation && matchesWasteType
  })
}
</script>

<template>
  <main>
    <section class="location-hero">
      <div class="container">
        <h1>Find a Recycling Location</h1>

        <p>
          Search by suburb or waste type to find nearby locations.
        </p>

        <form
          class="row g-3 location-search-form"
          @submit.prevent="searchLocations"
        >
          <div class="col-12 col-lg-5">
            <div class="search-control">
              <span>📍</span>

              <input
                v-model="suburbSearch"
                type="text"
                placeholder="Enter suburb or postcode"
                aria-label="Enter suburb or postcode"
              />
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="search-control">
              <span>♻</span>

              <select
                v-model="wasteType"
                aria-label="Select waste type"
              >
                <option value="">Select waste type</option>
                <option value="Batteries">Batteries</option>
                <option value="E-waste">E-waste</option>
                <option value="Small electronics">
                  Small electronics
                </option>
              </select>
            </div>
          </div>

          <div class="col-12 col-lg-3">
            <button class="btn search-button" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>

    <section class="location-content">
      <div class="container">
        <div class="row g-4">
          <div class="col-12 col-lg-6">
            <div class="map-panel">
              <iframe
                title="Recycling locations near Clayton and Oakleigh"
                src="https://www.openstreetmap.org/export/embed.html?bbox=145.0500%2C-37.9600%2C145.1600%2C-37.8600&layer=mapnik"
                loading="lazy"
              ></iframe>

              <div class="map-marker first-marker">
                ♻
              </div>

              <div class="map-marker second-marker">
                ♻
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <h2 class="results-heading">
              Nearby Locations
            </h2>

            <div
              v-if="displayedLocations.length > 0"
              class="location-list"
            >
              <LocationCard
                v-for="location in displayedLocations"
                :key="location.id"
                :location="location"
              />
            </div>

            <div v-else class="no-results">
              <div class="no-results-icon">🔍</div>

              <h3>No locations found</h3>

              <p>
                Try another suburb, postcode or waste type.
              </p>
            </div>

            <div class="results-note">
              <span>ⓘ</span>

              <p>
                Select a location to view more details and route
                options.
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
  padding: 50px 0 42px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99) 0%,
      rgba(250, 252, 247, 0.94) 55%,
      rgba(250, 252, 247, 0.3) 100%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center 47%;
  background-size: cover;
}

.location-hero h1 {
  margin-bottom: 8px;
  color: #15191e;
  font-size: 50px;
  font-weight: 750;
}

.location-hero > .container > p {
  margin-bottom: 28px;
  color: #475569;
  font-size: 20px;
}

.location-search-form {
  max-width: 1000px;
}

.search-control {
  min-height: 62px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  border: 1px solid #b9c4b6;
  border-radius: 11px;
}

.search-control:focus-within {
  border-color: #438c2b;
  box-shadow: 0 0 0 3px rgba(67, 140, 43, 0.12);
}

.search-control span {
  color: #438c2b;
  font-size: 24px;
}

.search-control input,
.search-control select {
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  color: #334155;
  font-size: 17px;
}

.search-button {
  width: 100%;
  min-height: 62px;
  background-color: #4c962f;
  border-radius: 11px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

.search-button:hover {
  background-color: #347521;
  color: white;
}

.location-content {
  padding: 38px 0 50px;
  background-color: #fbfcfb;
}

.map-panel {
  height: 520px;
  position: relative;
  overflow: hidden;
  background-color: #edf2e9;
  border: 1px solid #dce4da;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(28, 55, 27, 0.08);
}

.map-panel iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.map-marker {
  width: 55px;
  height: 55px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #438c2b;
  border: 4px solid white;
  border-radius: 50% 50% 50% 0;
  box-shadow: 0 4px 12px rgba(31, 70, 28, 0.3);
  color: white;
  font-size: 27px;
  transform: rotate(-45deg);
  pointer-events: none;
}

.map-marker::after {
  content: '';
}

.map-marker {
  line-height: 1;
}

.first-marker {
  top: 31%;
  left: 43%;
}

.second-marker {
  top: 61%;
  left: 63%;
}

.results-heading {
  margin: 10px 0 20px;
  color: #17202a;
  font-size: 29px;
  font-weight: 700;
}

.location-list {
  display: grid;
  gap: 20px;
}

.no-results {
  min-height: 340px;
  padding: 45px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  text-align: center;
}

.no-results-icon {
  font-size: 55px;
}

.no-results h3 {
  color: #17202a;
  font-weight: 700;
}

.no-results p {
  color: #64748b;
}

.results-note {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.results-note span {
  color: #438c2b;
  font-size: 24px;
  font-weight: 700;
}

.results-note p {
  margin: 0;
}

@media (max-width: 991px) {
  .map-panel {
    height: 420px;
  }

  .results-heading {
    margin-top: 15px;
  }
}

@media (max-width: 767px) {
  .location-hero {
    padding: 38px 0 32px;
    background-position: 65% center;
  }

  .location-hero h1 {
    font-size: 39px;
    line-height: 1.15;
  }

  .location-hero > .container > p {
    font-size: 18px;
  }

  .map-panel {
    height: 340px;
  }

  .map-marker {
    width: 46px;
    height: 46px;
    font-size: 22px;
  }

  .results-heading {
    font-size: 27px;
  }
}
</style>