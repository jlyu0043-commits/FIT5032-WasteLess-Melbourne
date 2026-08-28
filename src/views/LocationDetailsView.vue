<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { recyclingLocations } from '../data/recyclingLocations.js'

const route = useRoute()

const location = recyclingLocations.find((recyclingLocation) => {
  return recyclingLocation.id === Number(route.params.id)
})

</script>

<template>
  <main>
    <div v-if="location">
      <section class="location-hero">
        <div class="container">
          <RouterLink class="back-link" to="/locations">
            ← Back to search results
          </RouterLink>

          <div class="hero-content">
            <h1>{{ location.name }}</h1>

            <p class="address">
              📍 {{ location.address }}
            </p>

            <p class="distance">
              🚗 {{ location.distance }}
            </p>
          </div>
        </div>
      </section>

      <section class="details-section">
        <div class="container">
          <article class="details-card accepted-card">
            <div class="large-icon">
              ✅
            </div>

            <div>
              <h2>Accepted Items</h2>

              <div class="accepted-items">
                <div
                  v-for="acceptedItem in location.acceptedItems"
                  :key="acceptedItem.name"
                  class="accepted-item"
                >
                  <span>{{ acceptedItem.icon }}</span>
                  <p>{{ acceptedItem.name }}</p>
                </div>
              </div>
            </div>
          </article>

          <article class="details-card directions-card">
            <div class="large-icon">
              🗺️
            </div>

            <div>
              <h2>Directions</h2>

              <p>
                Get step-by-step directions to this location
                using your preferred navigation app.
              </p>
            </div>

            <a
              class="btn directions-button"
              :href="
                'https://www.google.com/maps/search/?api=1&query=' +
                location.address
              "
              target="_blank"
              rel="noopener"
            >
              📍 Get Directions
            </a>
          </article>
        </div>
      </section>
    </div>

    <section v-else class="not-found-section">
      <div class="container">
        <div class="not-found-card">
          <div class="not-found-icon">
            🔍
          </div>

          <h1>Location not found</h1>

          <p>
            The requested recycling location could not be found.
          </p>

          <RouterLink
            class="btn return-button"
            to="/locations"
          >
            Return to Location Search
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.location-hero {
  min-height: 310px;
  padding: 32px 0 45px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99) 0%,
      rgba(250, 252, 247, 0.94) 47%,
      rgba(250, 252, 247, 0.15) 78%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.back-link {
  display: inline-block;
  margin-bottom: 30px;
  color: #438c2b;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: #2f6f1f;
}

.hero-content {
  max-width: 850px;
}

.hero-content h1 {
  margin-bottom: 13px;
  color: #15191e;
  font-size: 54px;
  font-weight: 750;
}

.hero-content p {
  color: #334155;
}

.address {
  margin-bottom: 13px;
  font-size: 22px;
}

.distance {
  margin: 0;
  font-size: 18px;
}

.details-section {
  padding: 28px 0 48px;
  background-color: #fbfcfb;
}

.details-card {
  margin-bottom: 24px;
  padding: 28px 38px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(28, 55, 27, 0.08);
}

.details-card h2 {
  margin-bottom: 18px;
  color: #17202a;
  font-size: 28px;
  font-weight: 700;
}

.large-icon {
  width: 120px;
  height: 120px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  color: #438c2b;
  font-size: 60px;
}

.accepted-card {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 30px;
}

.accepted-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.accepted-item {
  min-width: 175px;
  padding: 11px 18px;
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1px solid #d9e2d7;
  border-radius: 30px;
}

.accepted-item span {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 24px;
}

.accepted-item p {
  margin: 0;
  color: #17202a;
  font-weight: 600;
}

.directions-button,
.return-button {
  padding: 14px 24px;
  background-color: #4c962f;
  border-radius: 10px;
  color: white;
  font-weight: 700;
}

.directions-button:hover,
.return-button:hover {
  background-color: #347521;
  color: white;
}

.directions-card {
  display: grid;
  grid-template-columns: 130px 1fr auto;
  align-items: center;
  gap: 30px;
}

.directions-card h2 {
  margin-bottom: 7px;
}

.directions-card p {
  max-width: 590px;
  margin: 0;
  color: #475569;
}

.directions-button {
  min-width: 200px;
  text-align: center;
}

.not-found-section {
  min-height: 650px;
  padding: 80px 0;
  background-color: #fbfcfb;
}

.not-found-card {
  padding: 60px 20px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  text-align: center;
}

.not-found-icon {
  font-size: 60px;
}

.not-found-card h1 {
  color: #17202a;
  font-weight: 700;
}

.not-found-card p {
  color: #64748b;
}

@media (max-width: 991px) {
  .directions-card {
    grid-template-columns: 110px 1fr;
  }

  .directions-button {
    grid-column: 2;
  }
}

@media (max-width: 767px) {
  .location-hero {
    min-height: 420px;
    padding: 28px 0 38px;
    background-position: 65% center;
  }

  .back-link {
    margin-bottom: 25px;
  }

  .hero-content {
    text-align: center;
  }

  .hero-content h1 {
    font-size: 40px;
    line-height: 1.12;
  }

  .address {
    font-size: 18px;
  }

  .details-card {
    padding: 28px 20px;
  }

  .accepted-card,
  .directions-card {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 20px;
    text-align: center;
  }

  .large-icon {
    width: 105px;
    height: 105px;
    font-size: 51px;
  }

  .accepted-items {
    justify-content: center;
  }

  .accepted-item {
    width: 100%;
    justify-content: center;
  }

  .directions-button {
    width: 100%;
    min-width: 0;
    grid-column: auto;
  }
}
</style>
