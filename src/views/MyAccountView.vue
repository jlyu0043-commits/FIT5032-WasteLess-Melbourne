<script setup>
import { RouterLink } from 'vue-router'

const profileDetails = [
  {
    label: 'Name',
    value: 'Eric Liu',
    icon: '👤',
  },
  {
    label: 'Email',
    value: 'eric@example.com',
    icon: '✉️',
  },
]

const savedItems = [
  {
    id: 1,
    name: 'Household Batteries',
    icon: '🔋',
    path: '/items/1',
  },
  {
    id: 2,
    name: 'E-waste',
    icon: '🖥️',
    path: '/guide/e-waste',
  },
]

const savedLocations = [
  {
    id: 1,
    name: 'Clayton Recycling Centre',
    icon: '📍',
    path: '/locations/1',
  },
  {
    id: 2,
    name: 'Oakleigh Collection Point',
    icon: '📍',
    path: '/locations/2',
  },
]
</script>

<template>
  <main>
    <section class="account-hero">
      <div class="container">
        <h1>My Account</h1>

        <p>
          View account and saved recycling information.
        </p>
      </div>
    </section>

    <section class="account-section">
      <div class="container">
        <div class="row g-4">
          <div class="col-12 col-lg-4">
            <article class="account-panel profile-panel">
              <div class="panel-heading">
                <div class="heading-icon">👤</div>
                <h2>Profile</h2>
              </div>

              <div class="profile-details">
                <div
                  v-for="detail in profileDetails"
                  :key="detail.label"
                  class="profile-row"
                >
                  <div class="profile-icon">
                    {{ detail.icon }}
                  </div>

                  <div>
                    <span>{{ detail.label }}:</span>
                    <p>{{ detail.value }}</p>
                  </div>
                </div>
              </div>

              <RouterLink
                class="btn return-button"
                to="/login"
              >
                ← Return to Login
              </RouterLink>
            </article>
          </div>

          <div class="col-12 col-lg-8">
            <article class="account-panel saved-panel">
              <div class="panel-heading">
                <div class="heading-icon">🔖</div>
                <h2>Saved Content</h2>
              </div>

              <section class="saved-section">
                <h3>Saved Items</h3>

                <div class="saved-list">
                  <div
                    v-for="savedItem in savedItems"
                    :key="savedItem.id"
                    class="saved-row"
                  >
                    <div class="saved-icon">
                      {{ savedItem.icon }}
                    </div>

                    <p>{{ savedItem.name }}</p>

                    <RouterLink
                      class="btn view-button"
                      :to="savedItem.path"
                    >
                      👁 View
                    </RouterLink>
                  </div>
                </div>
              </section>

              <section class="saved-section">
                <h3>Saved Locations</h3>

                <div class="saved-list">
                  <div
                    v-for="savedLocation in savedLocations"
                    :key="savedLocation.id"
                    class="saved-row"
                  >
                    <div class="saved-icon">
                      {{ savedLocation.icon }}
                    </div>

                    <p>{{ savedLocation.name }}</p>

                    <RouterLink
                      class="btn view-button"
                      :to="savedLocation.path"
                    >
                      👁 View
                    </RouterLink>
                  </div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.account-hero {
  min-height: 320px;
  padding: 55px 0 110px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99) 0%,
      rgba(250, 252, 247, 0.93) 48%,
      rgba(250, 252, 247, 0.12) 78%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.account-hero h1 {
  margin-bottom: 10px;
  color: #17202a;
  font-size: 54px;
  font-weight: 750;
}

.account-hero p {
  color: #475569;
  font-size: 20px;
}

.account-section {
  margin-top: -75px;
  padding-bottom: 50px;
  position: relative;
  background-color: #fbfcfb;
}

.account-panel {
  height: 100%;
  padding: 28px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(28, 55, 27, 0.1);
}

.panel-heading {
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.heading-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #438c2b;
  border-radius: 50%;
  color: white;
  font-size: 24px;
}

.panel-heading h2 {
  margin: 0;
  color: #17202a;
  font-size: 27px;
  font-weight: 700;
}

.profile-details {
  padding: 22px 16px;
  border: 1px solid #e1e7df;
  border-radius: 13px;
}

.profile-row {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 17px;
}

.profile-row:last-child {
  margin-bottom: 0;
}

.profile-icon,
.saved-icon {
  width: 50px;
  height: 50px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 25px;
}

.profile-row span {
  color: #64748b;
  font-size: 14px;
}

.profile-row p {
  margin: 2px 0 0;
  color: #17202a;
  font-size: 17px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.return-button,
.view-button {
  background-color: white;
  border: 1px solid #438c2b;
  border-radius: 8px;
  color: #347521;
  font-weight: 600;
}

.return-button {
  width: 100%;
  margin-top: 20px;
  padding: 12px 16px;
}

.return-button:hover,
.view-button:hover {
  background-color: #edf6e8;
  color: #347521;
}

.saved-section {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #e1e7df;
  border-radius: 13px;
}

.saved-section:last-child {
  margin-bottom: 0;
}

.saved-section h3 {
  margin-bottom: 14px;
  color: #17202a;
  font-size: 20px;
  font-weight: 700;
}

.saved-list {
  border: 1px solid #e1e7df;
  border-radius: 11px;
  overflow: hidden;
}

.saved-row {
  min-height: 78px;
  padding: 13px 16px;
  display: grid;
  grid-template-columns: 55px 1fr auto;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #e1e7df;
}

.saved-row:last-child {
  border-bottom: none;
}

.saved-row p {
  margin: 0;
  color: #17202a;
  font-weight: 700;
}

.view-button {
  min-width: 105px;
  padding: 9px 13px;
}

@media (max-width: 991px) {
  .account-section {
    margin-top: -60px;
  }
}

@media (max-width: 767px) {
  .account-hero {
    min-height: 360px;
    padding: 42px 0 95px;
    background-position: 65% center;
  }

  .account-hero h1 {
    font-size: 42px;
  }

  .account-hero p {
    font-size: 18px;
  }

  .account-section {
    margin-top: -55px;
  }

  .account-panel {
    padding: 23px 16px;
  }

  .saved-section {
    padding: 14px;
  }

  .saved-row {
    padding: 19px 14px;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 12px;
    text-align: center;
  }

  .view-button {
    width: 100%;
  }
}
</style>
