<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import RecyclingCategoryCard
  from '../components/RecyclingCategoryCard.vue'

import {
  wasteCategories,
} from '../data/wasteCategories.js'

const CACHE_KEY =
  'wasteless-offline-recycling-guide'

const isOnline =
  ref(navigator.onLine)

const cachedGuide =
  ref(null)

const cacheMessage =
  ref('')

const cacheError =
  ref('')

const cachedAt =
  computed(() => {
    if (
      !cachedGuide.value?.savedAt
    ) {
      return ''
    }

    return new Date(
      cachedGuide.value.savedAt,
    ).toLocaleString(
      'en-AU',
    )
  })

const displayedCategories =
  computed(() => {
    /*
     * While online, always display
     * the current application data.
     */
    if (isOnline.value) {
      return wasteCategories
    }

    /*
     * While offline, use the
     * persistent local copy.
     */
    if (
      cachedGuide.value?.categories
        ?.length
    ) {
      return cachedGuide.value
        .categories
    }

    return []
  })

function updateConnectionStatus() {
  isOnline.value =
    navigator.onLine

  if (!isOnline.value) {
    if (
      cachedGuide.value?.categories
        ?.length
    ) {
      cacheMessage.value =
        'Offline mode is active. You are viewing your saved recycling guide.'
    } else {
      cacheMessage.value =
        ''
    }
  } else {
    cacheMessage.value =
      'You are back online.'
  }
}

function loadOfflineGuide() {
  cacheError.value = ''

  try {
    const storedValue =
      localStorage.getItem(
        CACHE_KEY,
      )

    if (!storedValue) {
      cachedGuide.value =
        null

      return
    }

    const parsedValue =
      JSON.parse(
        storedValue,
      )

    if (
      !Array.isArray(
        parsedValue.categories,
      )
    ) {
      throw new Error(
        'Invalid offline cache format.',
      )
    }

    cachedGuide.value =
      parsedValue
  } catch (error) {
    console.error(
      'Failed to load offline guide:',
      error,
    )

    cachedGuide.value =
      null

    cacheError.value =
      'The saved offline guide could not be read. You can save a new copy while online.'
  }
}

function saveForOffline() {
  cacheError.value = ''

  if (!isOnline.value) {
    cacheError.value =
      'Connect to the internet before updating the offline copy.'

    return
  }

  try {
    const offlineCopy = {
      version: 1,

      savedAt:
        new Date().toISOString(),

      categories:
        wasteCategories,
    }

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(
        offlineCopy,
      ),
    )

    cachedGuide.value =
      offlineCopy

    cacheMessage.value =
      'Recycling Guide saved successfully for offline access.'
  } catch (error) {
    console.error(
      'Failed to save offline guide:',
      error,
    )

    cacheError.value =
      'The offline copy could not be saved in this browser.'
  }
}

function removeOfflineCopy() {
  localStorage.removeItem(
    CACHE_KEY,
  )

  cachedGuide.value =
    null

  cacheMessage.value =
    'Saved offline guide removed.'

  cacheError.value =
    ''
}

onMounted(() => {
  loadOfflineGuide()

  window.addEventListener(
    'online',
    updateConnectionStatus,
  )

  window.addEventListener(
    'offline',
    updateConnectionStatus,
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'online',
    updateConnectionStatus,
  )

  window.removeEventListener(
    'offline',
    updateConnectionStatus,
  )
})
</script>

<template>
  <main>
    <section class="guide-hero">
      <div
        class="container guide-hero-container"
      >
        <div class="guide-heading">
          <p class="eyebrow">
            Recycling information
          </p>

          <h1>
            Recycling Guide
          </h1>

          <p>
            Browse common waste categories
            and save the guide for use when
            your connection is unavailable.
          </p>
        </div>
      </div>
    </section>

    <section class="offline-tools">
      <div class="container">
        <div class="offline-card">
          <div class="offline-card-heading">
            <div>
              <p class="offline-label">
                Offline experience
              </p>

              <h2>
                Save Recycling Guide
              </h2>

              <p>
                Store a persistent copy of
                this recycling guide in your
                browser for later use.
              </p>
            </div>

            <span
              class="connection-badge"
              :class="{
                online: isOnline,
                offline: !isOnline,
              }"
            >
              {{
                isOnline
                  ? '● Online'
                  : '● Offline'
              }}
            </span>
          </div>

          <div class="offline-actions">
            <button
              type="button"
              class="save-button"
              :disabled="!isOnline"
              @click="saveForOffline"
            >
              {{
                cachedGuide
                  ? 'Update Offline Copy'
                  : 'Save for Offline'
              }}
            </button>

            <button
              v-if="cachedGuide"
              type="button"
              class="remove-button"
              @click="removeOfflineCopy"
            >
              Remove Offline Copy
            </button>
          </div>

          <div
            v-if="cachedGuide"
            class="cache-details"
          >
            <strong>
              Offline copy available
            </strong>

            <span>
              Saved:
              {{ cachedAt }}
            </span>

            <span>
              {{
                cachedGuide
                  .categories
                  .length
              }}
              categories stored
            </span>
          </div>

          <p
            v-if="cacheMessage"
            class="cache-message"
            role="status"
            aria-live="polite"
          >
            {{ cacheMessage }}
          </p>

          <p
            v-if="cacheError"
            class="cache-error"
            role="alert"
          >
            {{ cacheError }}
          </p>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <div
          v-if="
            displayedCategories.length >
            0
          "
          class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
        >
          <div
            v-for="
              category in
                displayedCategories
            "
            :key="category.id"
            class="col"
          >
            <RecyclingCategoryCard
              :category="category"
            />
          </div>
        </div>

        <div
          v-else
          class="no-offline-data"
          role="status"
        >
          <div
            class="no-data-icon"
            aria-hidden="true"
          >
            📡
          </div>

          <h2>
            No offline guide saved
          </h2>

          <p>
            Reconnect to the internet,
            return to this page and select
            “Save for Offline”.
          </p>
        </div>

        <div class="guide-message">
          <span
            class="message-icon"
            aria-hidden="true"
          >
            🌱
          </span>

          <p>
            {{
              isOnline
                ? 'Select a category to view recycling details and common items.'
                : 'Offline mode: recycling information is being loaded from your saved browser copy.'
            }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.guide-hero {
  min-height: 310px;

  background-image:
    linear-gradient(
      90deg,
      rgba(
        250,
        252,
        247,
        0.98
      )
        0%,
      rgba(
        250,
        252,
        247,
        0.9
      )
        43%,
      rgba(
        250,
        252,
        247,
        0.1
      )
        76%
    ),
    url('/images/melbourne-eco-hero.png');

  background-position: center;
  background-size: cover;
}

.guide-hero-container {
  min-height: 310px;

  display: flex;
  align-items: center;
}

.guide-heading {
  width: 62%;
}

.eyebrow,
.offline-label {
  margin-bottom: 7px;

  color: #438c2b;

  font-size: 13px;
  font-weight: 750;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.guide-heading h1 {
  margin-bottom: 12px;

  color: #15191e;

  font-size: 54px;
  font-weight: 750;
}

.guide-heading > p:last-child {
  margin: 0;

  color: #475569;

  font-size: 20px;
  line-height: 1.6;
}

.offline-tools {
  padding: 28px 0 10px;

  background-color: #fbfcfb;
}

.offline-card {
  padding: 24px;

  border: 1px solid #d9e6d5;
  border-radius: 15px;

  background-color: #ffffff;

  box-shadow:
    0 7px 22px
    rgba(
      31,
      58,
      30,
      0.06
    );
}

.offline-card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;
}

.offline-card-heading h2 {
  margin: 0 0 7px;

  color: #17202a;

  font-size: 25px;
}

.offline-card-heading p:last-child {
  margin: 0;

  color: #64748b;

  line-height: 1.55;
}

.connection-badge {
  padding: 7px 11px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;

  white-space: nowrap;
}

.connection-badge.online {
  background-color: #edf7e9;
  color: #347521;
}

.connection-badge.offline {
  background-color: #fff4d6;
  color: #805700;
}

.offline-actions {
  margin-top: 20px;

  display: flex;
  flex-wrap: wrap;

  gap: 10px;
}

.save-button,
.remove-button {
  min-height: 43px;

  padding: 9px 15px;

  border-radius: 8px;

  font: inherit;
  font-weight: 700;

  cursor: pointer;
}

.save-button {
  border: 1px solid #438c2b;

  background-color: #438c2b;
  color: #ffffff;
}

.save-button:hover:not(
    :disabled
  ) {
  background-color: #347521;
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.remove-button {
  border: 1px solid #b8c6b4;

  background-color: #ffffff;
  color: #475569;
}

.remove-button:hover {
  background-color: #f4f7f3;
}

.save-button:focus-visible,
.remove-button:focus-visible {
  outline:
    3px solid
    rgba(
      67,
      140,
      43,
      0.3
    );

  outline-offset: 2px;
}

.cache-details {
  margin-top: 17px;
  padding: 13px 15px;

  display: flex;
  flex-wrap: wrap;

  gap: 10px 22px;

  border-radius: 9px;

  background-color: #f3f7f1;

  color: #64748b;

  font-size: 13px;
}

.cache-details strong {
  color: #347521;
}

.cache-message,
.cache-error {
  margin: 14px 0 0;

  padding: 11px 13px;

  border-radius: 8px;

  font-size: 14px;
  font-weight: 650;
}

.cache-message {
  background-color: #edf7e9;
  color: #2f6f1f;
}

.cache-error {
  background-color: #fff0ee;
  color: #b42318;
}

.categories-section {
  padding: 18px 0 35px;

  background-color: #fbfcfb;
}

.no-offline-data {
  padding: 48px 20px;

  border: 1px solid #e2e8e0;
  border-radius: 14px;

  background-color: #ffffff;

  text-align: center;
}

.no-data-icon {
  margin-bottom: 10px;

  font-size: 38px;
}

.no-offline-data h2 {
  color: #17202a;
}

.no-offline-data p {
  margin: 0;

  color: #64748b;
}

.guide-message {
  max-width: 760px;
  min-height: 64px;

  margin: 25px auto 0;
  padding: 12px 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 16px;

  background:
    linear-gradient(
      100deg,
      #edf6e8,
      #fafcf6
    );

  border-radius: 12px;
}

.message-icon {
  font-size: 30px;
}

.guide-message p {
  margin: 0;

  color: #475569;

  font-size: 16px;
}

@media (
  max-width: 767px
) {
  .guide-hero,
  .guide-hero-container {
    min-height: 370px;
  }

  .guide-hero {
    background-position:
      65% center;
  }

  .guide-heading {
    width: 100%;
  }

  .guide-heading h1 {
    font-size: 40px;
  }

  .offline-card-heading {
    flex-direction: column;
  }

  .guide-message {
    padding: 16px;

    align-items: flex-start;
  }
}

@media (
  max-width: 576px
) {
  .offline-actions {
    display: grid;
  }

  .save-button,
  .remove-button {
    width: 100%;
  }

  .cache-details {
    flex-direction: column;
  }
}
</style>