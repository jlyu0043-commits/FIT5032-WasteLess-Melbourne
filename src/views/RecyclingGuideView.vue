<script setup>
import RecyclingCategoryCard from '../components/RecyclingCategoryCard.vue'
import { wasteCategories } from '../data/wasteCategories.js'
</script>

<template>
  <main>
    <section class="guide-hero">
      <div class="container guide-hero-container">
        <div class="guide-heading">
          <h1>Recycling Guide</h1>

          <p>
            Browse common waste categories to find recycling information.
          </p>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <div class="container">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div
            v-for="category in wasteCategories"
            :key="category.id"
            class="col"
          >
            <RecyclingCategoryCard :category="category" />
          </div>
        </div>

        <div class="guide-message">
          <span class="message-icon">🌱</span>

          <p>
            Select a category to view recycling details and common items.
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
      rgba(250, 252, 247, 0.98) 0%,
      rgba(250, 252, 247, 0.9) 43%,
      rgba(250, 252, 247, 0.1) 76%
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
  width: 58%;
}

.guide-heading h1 {
  margin-bottom: 12px;
  color: #15191e;
  font-size: 54px;
  font-weight: 750;
}

.guide-heading p {
  margin: 0;
  color: #475569;
  font-size: 20px;
}

.categories-section {
  padding: 10px 0 35px;
  background-color: #fbfcfb;
}

.guide-message {
  max-width: 680px;
  min-height: 64px;
  margin: 25px auto 0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: linear-gradient(100deg, #edf6e8, #fafcf6);
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

@media (max-width: 767px) {
  .guide-hero,
  .guide-hero-container {
    min-height: 370px;
  }

  .guide-hero {
    background-position: 65% center;
  }

  .guide-heading {
    width: 100%;
  }

  .guide-heading h1 {
    font-size: 40px;
  }

  .guide-message {
    padding: 16px;
    align-items: flex-start;
  }
}
</style>