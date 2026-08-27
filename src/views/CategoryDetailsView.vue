<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { wasteCategories } from '../data/wasteCategories.js'

const route = useRoute()

const category = wasteCategories.find((wasteCategory) => {
  return wasteCategory.slug === route.params.slug
})
</script>

<template>
  <main>
    <div v-if="category">
      <section class="category-hero">
        <div class="container">
          <nav class="breadcrumb-navigation">
            <RouterLink to="/">Home</RouterLink>
            <span>›</span>
            <RouterLink to="/guide">Categories</RouterLink>
            <span>›</span>
            <span>{{ category.name }}</span>
          </nav>

          <div class="category-heading">
            <div class="heading-icon">
              {{ category.icon }}
            </div>

            <div>
              <h1>{{ category.name }}</h1>

              <p class="category-description">
                {{ category.description }}
              </p>

              <p class="category-overview">
                {{ category.overview }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="category-content">
        <div class="container">
          <h2 class="section-heading">Common Items</h2>

          <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            <div
              v-for="commonItem in category.commonItems"
              :key="commonItem.name"
              class="col"
            >
              <article class="common-item-card">
                <div class="common-item-icon">
                  {{ commonItem.icon }}
                </div>

                <h3>{{ commonItem.name }}</h3>
              </article>
            </div>
          </div>

          <article class="recycling-information">
            <div class="large-recycling-icon">
              ♻
            </div>

            <div class="recycling-text">
              <h2>How to recycle {{ category.name.toLowerCase() }}</h2>

              <div class="recycling-tip">
                <span>✕</span>
                <p>{{ category.firstTip }}</p>
              </div>

              <div class="recycling-tip">
                <span>📍</span>
                <p>{{ category.secondTip }}</p>
              </div>
            </div>

            <RouterLink class="btn location-button" to="/locations">
              📍 Find a Recycling Location
            </RouterLink>
          </article>
        </div>
      </section>
    </div>

    <section v-else class="not-found-section">
      <div class="container">
        <div class="not-found-card">
          <div class="not-found-icon">🔍</div>

          <h1>Category not found</h1>

          <p>The requested recycling category could not be found.</p>

          <RouterLink class="btn guide-button" to="/guide">
            Return to Recycling Guide
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.category-hero {
  min-height: 340px;
  padding: 28px 0 38px;
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
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #475569;
}

.breadcrumb-navigation a {
  color: #438c2b;
  text-decoration: none;
}

.category-heading {
  max-width: 680px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.heading-icon {
  width: 130px;
  height: 130px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 65px;
}

.category-heading h1 {
  margin-bottom: 5px;
  color: #15191e;
  font-size: 54px;
  font-weight: 750;
}

.category-description {
  margin-bottom: 18px;
  color: #475569;
  font-size: 21px;
}

.category-overview {
  margin: 0;
  color: #475569;
  font-size: 17px;
  line-height: 1.7;
}

.category-content {
  padding: 28px 0 48px;
  background-color: #fbfcfb;
}

.section-heading {
  margin-bottom: 20px;
  color: #17202a;
  font-size: 29px;
  font-weight: 700;
}

.common-item-card {
  min-height: 175px;
  height: 100%;
  padding: 20px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.08);
  text-align: center;
}

.common-item-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 46px;
}

.common-item-card h3 {
  margin: 0;
  color: #17202a;
  font-size: 20px;
  font-weight: 700;
}

.recycling-information {
  margin-top: 28px;
  padding: 28px 38px;
  min-height: 190px;
  display: flex;
  align-items: center;
  gap: 35px;
  background: linear-gradient(100deg, #edf6e8, #fafcf6);
  border-radius: 16px;
}

.large-recycling-icon {
  width: 145px;
  height: 145px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  color: #438c2b;
  font-size: 80px;
}

.recycling-text {
  flex-grow: 1;
}

.recycling-text h2 {
  margin-bottom: 17px;
  color: #17202a;
  font-size: 28px;
  font-weight: 700;
}

.recycling-tip {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.recycling-tip span {
  color: #438c2b;
  font-size: 22px;
  font-weight: 700;
}

.recycling-tip p {
  margin-bottom: 10px;
  color: #475569;
  font-size: 16px;
}

.location-button,
.guide-button {
  min-width: 275px;
  padding: 16px 22px;
  background-color: #4c962f;
  border-radius: 12px;
  color: white;
  font-weight: 700;
}

.location-button:hover,
.guide-button:hover {
  background-color: #347521;
  color: white;
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
  .recycling-information {
    flex-wrap: wrap;
  }

  .location-button {
    margin-left: 180px;
  }
}

@media (max-width: 767px) {
  .category-hero {
    min-height: 470px;
    background-position: 65% center;
  }

  .breadcrumb-navigation {
    flex-wrap: wrap;
    font-size: 14px;
  }

  .category-heading {
    flex-direction: column;
    gap: 18px;
    text-align: center;
  }

  .heading-icon {
    width: 115px;
    height: 115px;
    font-size: 58px;
  }

  .category-heading h1 {
    font-size: 42px;
  }

  .recycling-information {
    padding: 28px 20px;
    flex-direction: column;
    text-align: center;
  }

  .large-recycling-icon {
    width: 120px;
    height: 120px;
    font-size: 65px;
  }

  .recycling-tip {
    text-align: left;
  }

  .location-button {
    width: 100%;
    min-width: 0;
    margin-left: 0;
  }
}
</style>