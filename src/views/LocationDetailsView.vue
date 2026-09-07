<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue'
import {
  RouterLink,
  useRoute,
} from 'vue-router'
import { recyclingLocations } from '../data/recyclingLocations.js'
import { useAuth } from '../services/authService'
import { useRatings } from '../services/ratingService.js'

const route = useRoute()

const {
  currentUser,
  isAuthenticated,
} = useAuth()

const {
  ratings,
  saveRating,
} = useRatings()

const selectedRating = ref(0)
const hoverRating = ref(0)
const ratingMessage = ref('')
const ratingError = ref('')

const location = computed(() => {
  return recyclingLocations.find((recyclingLocation) => {
    return (
      recyclingLocation.id ===
      Number(route.params.id)
    )
  })
})

const locationRatings = computed(() => {
  if (!location.value) {
    return []
  }

  return ratings.value.filter((rating) => {
    return rating.locationId === location.value.id
  })
})

const ratingCount = computed(() => {
  return locationRatings.value.length
})

const averageRating = computed(() => {
  if (ratingCount.value === 0) {
    return 0
  }

  const ratingTotal = locationRatings.value.reduce(
    (total, rating) => {
      return total + rating.score
    },
    0,
  )

  return ratingTotal / ratingCount.value
})

const formattedAverage = computed(() => {
  return averageRating.value.toFixed(1)
})

const roundedAverage = computed(() => {
  return Math.round(averageRating.value)
})

const ratingCountText = computed(() => {
  if (ratingCount.value === 0) {
    return 'No ratings yet'
  }

  if (ratingCount.value === 1) {
    return '1 rating'
  }

  return `${ratingCount.value} ratings`
})

const currentUserRating = computed(() => {
  if (!currentUser.value || !location.value) {
    return null
  }

  return locationRatings.value.find((rating) => {
    return rating.userId === currentUser.value.id
  }) ?? null
})

const displayedSelection = computed(() => {
  return hoverRating.value || selectedRating.value
})

watch(
  [
    () => currentUser.value?.id,
    () => location.value?.id,
  ],
  () => {
    selectedRating.value =
      currentUserRating.value?.score ?? 0

    hoverRating.value = 0
    ratingMessage.value = ''
    ratingError.value = ''
  },
  {
    immediate: true,
  },
)

function selectRating(score) {
  selectedRating.value = score
  ratingMessage.value = ''
  ratingError.value = ''
}

function submitRating() {
  ratingMessage.value = ''
  ratingError.value = ''

  if (
    !isAuthenticated.value ||
    !currentUser.value
  ) {
    ratingError.value =
      'Please sign in before submitting a rating.'
    return
  }

  if (
    !Number.isInteger(selectedRating.value) ||
    selectedRating.value < 1 ||
    selectedRating.value > 5
  ) {
    ratingError.value =
      'Please select a rating from 1 to 5.'
    return
  }

  if (!location.value) {
    ratingError.value =
      'This location is not available.'
    return
  }

  const hadExistingRating =
    Boolean(currentUserRating.value)

  const result = saveRating({
    locationId: location.value.id,
    userId: currentUser.value.id,
    score: selectedRating.value,
  })

  if (!result.success) {
    ratingError.value = result.message
    return
  }

  ratingMessage.value = hadExistingRating
    ? 'Your rating has been updated.'
    : 'Thank you for rating this location.'
}
</script>

<template>
  <main>
    <div v-if="location">
      <section class="location-hero">
        <div class="container">
          <RouterLink
            class="back-link"
            to="/locations"
          >
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
          <article
            class="details-card accepted-card"
          >
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

          <article
            class="details-card rating-card"
          >
            <div class="large-icon">
              ⭐
            </div>

            <div class="rating-summary">
              <h2>Community Rating</h2>

              <div
                class="average-score"
                :aria-label="
                  `${formattedAverage} out of 5`
                "
              >
                <strong>{{ formattedAverage }}</strong>
                <span>/ 5</span>
              </div>

              <div
                class="summary-stars"
                aria-hidden="true"
              >
                <span
                  v-for="star in 5"
                  :key="star"
                  :class="{
                    active:
                      star <= roundedAverage,
                  }"
                >
                  ★
                </span>
              </div>

              <p class="rating-count">
                {{ ratingCountText }}
              </p>
            </div>

            <div class="rating-action">
              <h3>Rate this location</h3>

              <template v-if="isAuthenticated">
                <p
                  v-if="currentUserRating"
                  class="current-rating"
                >
                  Your current rating is
                  {{ currentUserRating.score }}
                  out of 5.
                </p>

                <p
                  v-else
                  class="current-rating"
                >
                  Select the number of stars you
                  would like to give.
                </p>

                <div
                  class="rating-stars"
                  role="group"
                  aria-label="Choose a rating"
                  @mouseleave="hoverRating = 0"
                >
                  <button
                    v-for="star in 5"
                    :key="star"
                    class="star-button"
                    :class="{
                      active:
                        star <= displayedSelection,
                    }"
                    type="button"
                    :aria-label="
                      `Rate ${star} out of 5`
                    "
                    :aria-pressed="
                      selectedRating === star
                    "
                    @mouseenter="
                      hoverRating = star
                    "
                    @focus="hoverRating = star"
                    @blur="hoverRating = 0"
                    @click="selectRating(star)"
                  >
                    ★
                  </button>
                </div>

                <button
                  class="btn rating-submit-button"
                  type="button"
                  :disabled="selectedRating === 0"
                  @click="submitRating"
                >
                  Submit Rating
                </button>

                <p
                  v-if="ratingMessage"
                  class="rating-message success-message"
                  aria-live="polite"
                >
                  {{ ratingMessage }}
                </p>

                <p
                  v-if="ratingError"
                  class="rating-message error-message"
                  role="alert"
                >
                  {{ ratingError }}
                </p>
              </template>

              <template v-else>
                <p class="sign-in-message">
                  Sign in to submit your own rating.
                </p>

                <RouterLink
                  class="btn sign-in-button"
                  :to="{
                    name: 'login-register',
                    query: {
                      redirect: route.fullPath,
                    },
                  }"
                >
                  Sign in to Rate
                </RouterLink>
              </template>
            </div>
          </article>

          <article
            class="details-card directions-card"
          >
            <div class="large-icon">
              🗺️
            </div>

            <div>
              <h2>Directions</h2>

              <p>
                Get step-by-step directions to this
                location using your preferred
                navigation app.
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

    <section
      v-else
      class="not-found-section"
    >
      <div class="container">
        <div class="not-found-card">
          <div class="not-found-icon">
            🔍
          </div>

          <h1>Location not found</h1>

          <p>
            The requested recycling location could
            not be found.
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

.rating-card {
  display: grid;
  grid-template-columns:
    130px minmax(210px, 0.7fr)
    minmax(320px, 1fr);
  align-items: center;
  gap: 30px;
}

.rating-summary h2 {
  margin-bottom: 8px;
}

.average-score {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.average-score strong {
  color: #17202a;
  font-size: 42px;
  line-height: 1;
}

.average-score span {
  color: #64748b;
  font-size: 18px;
}

.summary-stars {
  margin-top: 8px;
  color: #cbd5cf;
  font-size: 24px;
  letter-spacing: 2px;
}

.summary-stars .active {
  color: #f4b400;
}

.rating-count {
  margin: 5px 0 0;
  color: #64748b;
}

.rating-action {
  padding-left: 30px;
  border-left: 1px solid #e1e7df;
}

.rating-action h3 {
  margin-bottom: 6px;
  color: #17202a;
  font-size: 21px;
  font-weight: 700;
}

.current-rating,
.sign-in-message {
  margin-bottom: 10px;
  color: #64748b;
}

.rating-stars {
  margin-bottom: 15px;
  display: flex;
  gap: 4px;
}

.star-button {
  padding: 0 3px;
  background: transparent;
  border: 0;
  color: #cbd5cf;
  font-size: 39px;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.15s ease,
    transform 0.15s ease;
}

.star-button.active {
  color: #f4b400;
}

.star-button:hover {
  transform: translateY(-2px);
}

.star-button:focus-visible {
  outline: 3px solid rgba(67, 140, 43, 0.35);
  outline-offset: 3px;
  border-radius: 4px;
}

.rating-submit-button,
.sign-in-button {
  min-width: 170px;
  padding: 11px 20px;
  border-radius: 9px;
  font-weight: 700;
}

.rating-submit-button {
  background-color: #4c962f;
  color: white;
}

.rating-submit-button:hover {
  background-color: #347521;
  color: white;
}

.rating-submit-button:disabled {
  background-color: #94a3b8;
  color: white;
  cursor: not-allowed;
}

.sign-in-button {
  background-color: white;
  border: 1px solid #438c2b;
  color: #347521;
}

.sign-in-button:hover {
  background-color: #edf6e8;
  color: #347521;
}

.rating-message {
  margin: 12px 0 0;
  padding: 9px 12px;
  border-radius: 7px;
  font-weight: 600;
}

.success-message {
  background-color: #edf7e9;
  color: #347521;
}

.error-message {
  background-color: #fff0ee;
  color: #b42318;
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
  .rating-card,
  .directions-card {
    grid-template-columns: 110px 1fr;
  }

  .rating-action {
    padding: 22px 0 0;
    grid-column: 1 / -1;
    border-top: 1px solid #e1e7df;
    border-left: 0;
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
  .rating-card,
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

  .accepted-items,
  .rating-stars {
    justify-content: center;
  }

  .accepted-item {
    width: 100%;
    justify-content: center;
  }

  .rating-action {
    width: 100%;
    grid-column: auto;
  }

  .rating-submit-button,
  .sign-in-button,
  .directions-button {
    width: 100%;
    min-width: 0;
  }

  .directions-button {
    grid-column: auto;
  }
}
</style>