<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { wasteItems } from '../data/wasteItems.js'

const route = useRoute()

const item = wasteItems.find((wasteItem) => {
  return wasteItem.id === Number(route.params.id)
})

const isSaved = ref(false)

function saveItem() {
  isSaved.value = !isSaved.value
}
</script>

<template>
  <main>
    <div v-if="item">
      <section class="item-hero">
        <div class="container">
          <nav class="breadcrumb-navigation">
            <RouterLink to="/">Home</RouterLink>
            <span>›</span>
            <span class="category-breadcrumb">
              {{ item.category }}
            </span>
            <span>›</span>
            <span>{{ item.name }}</span>
          </nav>

          <div class="item-summary">
            <div class="item-icon">
              {{ item.icon }}
            </div>

            <div>
              <h1>{{ item.name }}</h1>

              <p>
                Category:
                <strong>{{ item.category }}</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="details-section">
        <div class="container">
          <article class="information-card">
            <div class="information-icon">
              ℹ
            </div>

            <div>
              <h2>How should I dispose of this item?</h2>

              <p>{{ item.disposalText }}</p>

              <p>{{ item.disposalInstruction }}</p>
            </div>
          </article>

          <article class="information-card action-card">
            <div class="information-icon check-icon">
              ✓
            </div>

            <div>
              <h2>Recommended Action</h2>

              <p>{{ item.recommendedAction }}</p>
            </div>
          </article>

          <article class="location-card">
            <div class="location-heading">
              <div class="information-icon location-icon">
                📍
              </div>

              <div>
                <h2>Need somewhere to take it?</h2>

                <p>
                  Find a nearby location where you can recycle this item.
                </p>
              </div>
            </div>

            <div class="location-buttons">
              <RouterLink class="btn location-button" to="/locations">
                📍 Find a Recycling Location
              </RouterLink>

              <button
                class="btn save-button"
                type="button"
                @click="saveItem"
              >
                {{ isSaved ? '✓ Item Saved' : '🔖 Save Item' }}
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>

    <section v-else class="not-found-section">
      <div class="container">
        <div class="not-found-card">
          <div class="not-found-icon">🔍</div>

          <h1>Item not found</h1>

          <p>The requested recycling item could not be found.</p>

          <RouterLink class="btn home-button" to="/">
            Return to Home
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.item-hero {
  min-height: 310px;
  padding: 28px 0 35px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.98) 0%,
      rgba(250, 252, 247, 0.9) 45%,
      rgba(250, 252, 247, 0.1) 78%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.breadcrumb-navigation {
  margin-bottom: 35px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #475569;
}

.breadcrumb-navigation a {
  color: #438c2b;
  text-decoration: none;
}

.category-breadcrumb {
  color: #438c2b;
}

.item-summary {
  display: flex;
  align-items: center;
  gap: 55px;
}

.item-icon {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 90px;
}

.item-summary h1 {
  margin-bottom: 12px;
  color: #15191e;
  font-size: 52px;
  font-weight: 750;
}

.item-summary p {
  margin: 0;
  color: #475569;
  font-size: 20px;
}

.item-summary strong {
  color: #438c2b;
}

.details-section {
  padding: 10px 0 50px;
  background-color: white;
}

.information-card {
  margin-top: 20px;
  padding: 34px 42px;
  min-height: 175px;
  display: flex;
  align-items: center;
  gap: 35px;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.09);
}

.information-icon {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  color: #347521;
  font-size: 52px;
  font-weight: 700;
}

.information-card h2,
.location-card h2 {
  margin-bottom: 10px;
  color: #17202a;
  font-size: 27px;
  font-weight: 700;
}

.information-card p,
.location-card p {
  margin-bottom: 10px;
  color: #475569;
  font-size: 17px;
}

.information-card p:last-child,
.location-card p {
  margin-bottom: 0;
}

.action-card {
  min-height: 135px;
}

.check-icon {
  font-size: 50px;
}

.location-card {
  margin-top: 20px;
  padding: 30px 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 35px;
  background: linear-gradient(100deg, #edf6e8, #fafcf6);
  border-radius: 16px;
}

.location-heading {
  display: flex;
  align-items: center;
  gap: 28px;
}

.location-icon {
  font-size: 42px;
}

.location-buttons {
  display: flex;
  gap: 18px;
}

.location-button,
.save-button,
.home-button {
  min-height: 58px;
  padding: 15px 22px;
  border-radius: 12px;
  font-weight: 700;
}

.location-button,
.home-button {
  background-color: #4c962f;
  color: white;
}

.location-button:hover,
.home-button:hover {
  background-color: #347521;
  color: white;
}

.save-button {
  min-width: 175px;
  background-color: white;
  border: 2px solid #438c2b;
  color: #438c2b;
}

.save-button:hover {
  background-color: #edf6e8;
  border-color: #347521;
  color: #347521;
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
  .location-card {
    flex-direction: column;
    align-items: stretch;
  }

  .location-buttons {
    margin-left: 118px;
  }
}

@media (max-width: 767px) {
  .item-hero {
    min-height: 400px;
    background-position: 65% center;
  }

  .breadcrumb-navigation {
    flex-wrap: wrap;
    font-size: 14px;
  }

  .item-summary {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .item-icon {
    width: 125px;
    height: 125px;
    font-size: 65px;
  }

  .item-summary h1 {
    font-size: 37px;
  }

  .information-card {
    padding: 28px 20px;
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  .information-card h2,
  .location-card h2 {
    font-size: 24px;
  }

  .location-heading {
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  .location-buttons {
    margin-left: 0;
    flex-direction: column;
  }

  .location-button,
  .save-button {
    width: 100%;
  }
}
</style>