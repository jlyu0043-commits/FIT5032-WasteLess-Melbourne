<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import {
  collection,
  onSnapshot,
} from 'firebase/firestore'

import {
  db,
} from '../services/firebase'

const users = ref([])

const isLoading = ref(true)
const loadError = ref('')
const lastUpdated = ref('')

let unsubscribeUsers = null

const totalUsers = computed(
  () => users.value.length,
)

const standardUsers = computed(
  () =>
    users.value.filter(
      (user) =>
        user.role === 'user',
    ).length,
)

const administrators = computed(
  () =>
    users.value.filter(
      (user) =>
        user.role === 'admin',
    ).length,
)

const otherRoles = computed(
  () =>
    users.value.filter(
      (user) =>
        user.role !== 'user' &&
        user.role !== 'admin',
    ).length,
)

const overviewCards = computed(
  () => [
    {
      id: 'total-users',
      label: 'Total Users',
      value: totalUsers.value,
      icon: '👥',
      description:
        'All registered user profiles',
    },

    {
      id: 'standard-users',
      label: 'Standard Users',
      value: standardUsers.value,
      icon: '👤',
      description:
        'Users with the standard user role',
    },

    {
      id: 'administrators',
      label: 'Administrators',
      value: administrators.value,
      icon: '🛡️',
      description:
        'Users with administrator access',
    },
  ],
)

function formatUpdatedTime() {
  return new Date().toLocaleTimeString(
    'en-AU',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  )
}

function startLiveOverview() {
  isLoading.value = true
  loadError.value = ''

  if (unsubscribeUsers) {
    unsubscribeUsers()
  }

  const usersReference =
    collection(
      db,
      'users',
    )

  unsubscribeUsers =
    onSnapshot(
      usersReference,

      (snapshot) => {
        users.value =
          snapshot.docs.map(
            (documentSnapshot) => {
              const data =
                documentSnapshot.data()

              return {
                id:
                  documentSnapshot.id,

                role:
                  data.role ||
                  'user',

                email:
                  data.email ||
                  '',

                name:
                  data.name ||
                  '',
              }
            },
          )

        lastUpdated.value =
          formatUpdatedTime()

        isLoading.value = false
        loadError.value = ''
      },

      (error) => {
        console.error(
          'Failed to load live admin overview:',
          error,
        )

        isLoading.value = false

        if (
          error.code ===
          'permission-denied'
        ) {
          loadError.value =
            'You do not have permission to read the live user overview.'
        } else {
          loadError.value =
            'The live Firestore overview could not be loaded. Please try again.'
        }
      },
    )
}

onMounted(() => {
  startLiveOverview()
})

onBeforeUnmount(() => {
  if (unsubscribeUsers) {
    unsubscribeUsers()
  }
})
</script>

<template>
  <section
    class="live-overview"
    aria-labelledby="live-overview-heading"
  >
    <div class="overview-heading">
      <div>
        <div class="live-label">
          <span
            class="live-dot"
            aria-hidden="true"
          ></span>

          Firestore live data
        </div>

        <h2 id="live-overview-heading">
          User & Role Overview
        </h2>

        <p>
          Real-time administrator overview
          generated from registered Firestore
          user profiles.
        </p>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="isLoading"
        @click="startLiveOverview"
      >
        {{
          isLoading
            ? 'Loading…'
            : 'Reconnect Live Data'
        }}
      </button>
    </div>

    <div
      v-if="isLoading"
      class="overview-message"
      role="status"
      aria-live="polite"
    >
      Loading live Firestore user data…
    </div>

    <div
      v-else-if="loadError"
      class="overview-error"
      role="alert"
    >
      <strong>
        Live overview unavailable
      </strong>

      <p>
        {{ loadError }}
      </p>

      <button
        type="button"
        class="retry-button"
        @click="startLiveOverview"
      >
        Try again
      </button>
    </div>

    <template v-else>
      <div class="overview-grid">
        <article
          v-for="card in overviewCards"
          :key="card.id"
          class="overview-card"
        >
          <div
            class="overview-icon"
            aria-hidden="true"
          >
            {{ card.icon }}
          </div>

          <div>
            <p class="overview-label">
              {{ card.label }}
            </p>

            <strong class="overview-value">
              {{ card.value }}
            </strong>

            <p class="overview-description">
              {{ card.description }}
            </p>
          </div>
        </article>
      </div>

      <div class="overview-footer">
        <div>
          <span
            class="status-indicator"
            aria-hidden="true"
          ></span>

          <strong>
            Live connection active
          </strong>
        </div>

        <span>
          Last updated:
          {{ lastUpdated }}
        </span>
      </div>

      <p
        v-if="otherRoles > 0"
        class="role-note"
      >
        {{ otherRoles }}
        profile{{
          otherRoles === 1
            ? ''
            : 's'
        }}
        use another role value and are included
        in Total Users.
      </p>
    </template>
  </section>
</template>

<style scoped>
.live-overview {
  margin-bottom: 30px;
  padding: 28px;

  border: 1px solid #d7e4d3;
  border-radius: 16px;

  background:
    linear-gradient(
      135deg,
      #ffffff 0%,
      #f7fbf5 100%
    );

  box-shadow:
    0 10px 30px
    rgba(
      31,
      58,
      30,
      0.08
    );
}

.overview-heading {
  margin-bottom: 22px;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 24px;
}

.live-label {
  margin-bottom: 7px;

  display: flex;
  align-items: center;

  gap: 8px;

  color: #347521;

  font-size: 13px;
  font-weight: 750;

  letter-spacing: 0.07em;

  text-transform: uppercase;
}

.live-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  background-color: #438c2b;

  box-shadow:
    0 0 0 4px
    rgba(
      67,
      140,
      43,
      0.14
    );
}

.overview-heading h2 {
  margin: 0 0 7px;

  color: #17202a;

  font-size: 27px;
  font-weight: 720;
}

.overview-heading p {
  max-width: 680px;

  margin: 0;

  color: #64748b;

  line-height: 1.6;
}

.refresh-button,
.retry-button {
  min-height: 42px;

  padding: 9px 15px;

  border: 1px solid #438c2b;
  border-radius: 8px;

  background-color: #ffffff;
  color: #347521;

  cursor: pointer;

  font: inherit;
  font-weight: 700;

  white-space: nowrap;
}

.refresh-button:hover:not(
    :disabled
  ),
.retry-button:hover {
  background-color: #edf7e9;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-button:focus-visible,
.retry-button:focus-visible {
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

.overview-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(
        0,
        1fr
      )
    );

  gap: 16px;
}

.overview-card {
  min-height: 155px;

  padding: 20px;

  display: flex;
  align-items: center;

  gap: 16px;

  border: 1px solid #dfe8dc;
  border-radius: 13px;

  background-color: #ffffff;
}

.overview-icon {
  width: 56px;
  height: 56px;

  display: flex;
  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background-color: #edf7e9;

  font-size: 26px;
}

.overview-label {
  margin: 0 0 2px;

  color: #64748b;

  font-size: 14px;
  font-weight: 650;
}

.overview-value {
  display: block;

  color: #17202a;

  font-size: 32px;
  line-height: 1.1;
}

.overview-description {
  margin: 7px 0 0;

  color: #64748b;

  font-size: 12px;
  line-height: 1.45;
}

.overview-footer {
  margin-top: 17px;
  padding-top: 15px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;

  border-top: 1px solid #e3ebe0;

  color: #64748b;

  font-size: 13px;
}

.overview-footer div {
  display: flex;
  align-items: center;

  gap: 8px;
}

.overview-footer strong {
  color: #347521;
}

.status-indicator {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background-color: #438c2b;
}

.overview-message {
  padding: 26px;

  border-radius: 10px;

  background-color: #f3f7f1;
  color: #475569;

  text-align: center;
}

.overview-error {
  padding: 18px;

  border: 1px solid #f0c7c2;
  border-radius: 10px;

  background-color: #fff3f1;
  color: #8f2720;
}

.overview-error strong {
  display: block;

  margin-bottom: 4px;
}

.overview-error p {
  margin:
    0 0 13px;
}

.role-note {
  margin: 14px 0 0;

  color: #64748b;

  font-size: 12px;
}

@media (
  max-width: 991px
) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

@media (
  max-width: 767px
) {
  .live-overview {
    padding: 21px 17px;
  }

  .overview-heading {
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }

  .overview-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>