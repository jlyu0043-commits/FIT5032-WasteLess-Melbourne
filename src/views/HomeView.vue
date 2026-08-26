<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CategoryCard from '../components/CategoryCard.vue'

const router = useRouter()

const searchText = ref('')
const searchMessage = ref('')

const categories = [
  {
    id: 1,
    slug: 'plastic',
    name: 'Plastic',
    icon: '♳',
  },
  {
    id: 2,
    slug: 'glass',
    name: 'Glass',
    icon: '🍾',
  },
  {
    id: 3,
    slug: 'paper',
    name: 'Paper',
    icon: '📄',
  },
  {
    id: 4,
    slug: 'e-waste',
    name: 'E-waste',
    icon: '🖥️',
  },
  {
    id: 5,
    slug: 'batteries',
    name: 'Batteries',
    icon: '🔋',
  },
  {
    id: 6,
    slug: 'food-waste',
    name: 'Food Waste',
    icon: '🍎',
  },
]

function searchItem() {
  const searchValue = searchText.value.trim()

  if (searchValue === '') {
    searchMessage.value = 'Please enter an item to search.'
    return
  }

  router.push({
    name: 'search-results',
    query: {
      q: searchValue,
    },
  })
}
</script>

<template>
  <main>
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <h1>Not sure where it goes?</h1>

          <p class="hero-description">
            Search an item to find recycling information.
          </p>

          <form class="search-form" @submit.prevent="searchItem">
            <input
              v-model="searchText"
              type="text"
              class="form-control"
              placeholder="Search an item..."
              aria-label="Search an item"
            />

            <button class="btn search-button" type="submit">
              Search
            </button>
          </form>

          <p class="search-example">
            e.g. batteries, laptop, glass bottle
          </p>

          <p v-if="searchMessage" class="search-message">
            {{ searchMessage }}
          </p>
        </div>
      </div>
    </section>

    <section id="categories" class="category-section">
      <div class="container">
        <h2>Browse by Waste Category</h2>

        <div
          class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-6 g-4"
        >
          <div
            v-for="category in categories"
            :key="category.id"
            class="col"
          >
            <CategoryCard :category="category" />
          </div>
        </div>
      </div>
    </section>

    <section id="location" class="location-section">
      <div class="container">
        <div class="location-banner">
          <div class="location-icon">
            📍
          </div>

          <div class="location-text">
            <h2>Find a recycling location near you</h2>

            <p>
              Locate recycling drop-off points, transfer stations,
              and collection services in your area.
            </p>
          </div>

          <a href="#" class="btn location-button">
            📍 Find a Location
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero-section {
  min-height: 380px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.98) 0%,
      rgba(250, 252, 247, 0.9) 42%,
      rgba(250, 252, 247, 0.1) 75%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.hero-container {
  min-height: 380px;
  display: flex;
  align-items: center;
}

.hero-content {
  width: 58%;
}

.hero-content h1 {
  margin-bottom: 15px;
  color: #15191e;
  font-size: 54px;
  font-weight: 750;
}

.hero-description {
  margin-bottom: 24px;
  color: #374151;
  font-size: 20px;
}

.search-form {
  max-width: 680px;
  display: flex;
}

.search-form input {
  min-height: 60px;
  padding: 15px 20px;
  border: 2px solid #438c2b;
  border-right: none;
  border-radius: 13px 0 0 13px;
  font-size: 17px;
}

.search-form input:focus {
  border-color: #438c2b;
  box-shadow: none;
}

.search-button {
  min-width: 130px;
  background-color: #4c962f;
  border-radius: 0 13px 13px 0;
  color: white;
  font-size: 17px;
  font-weight: 700;
}

.search-button:hover {
  background-color: #347521;
  color: white;
}

.search-example {
  margin: 12px 0 0;
  color: #596168;
}

.search-message {
  margin-top: 8px;
  color: #347521;
  font-weight: 600;
}

.category-section {
  padding: 38px 0;
  background-color: white;
}

.category-section h2 {
  margin-bottom: 25px;
  color: #17202a;
  font-size: 34px;
  font-weight: 700;
  text-align: center;
}

.location-section {
  padding: 0 0 48px;
}

.location-banner {
  min-height: 150px;
  padding: 28px 45px;
  display: flex;
  align-items: center;
  gap: 35px;
  background: linear-gradient(100deg, #edf6e8, #fafcf6);
  border-radius: 20px;
}

.location-icon {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  font-size: 38px;
}

.location-text {
  flex-grow: 1;
}

.location-text h2 {
  margin-bottom: 7px;
  color: #17202a;
  font-size: 29px;
  font-weight: 700;
}

.location-text p {
  max-width: 590px;
  margin: 0;
  color: #475569;
  font-size: 17px;
}

.location-button {
  min-width: 220px;
  padding: 15px 22px;
  background-color: #4c962f;
  border-radius: 12px;
  color: white;
  font-weight: 700;
}

.location-button:hover {
  background-color: #347521;
  color: white;
}

@media (max-width: 991px) {
  .hero-content {
    width: 75%;
  }

  .hero-content h1 {
    font-size: 44px;
  }

  .location-banner {
    flex-wrap: wrap;
  }

  .location-button {
    margin-left: 110px;
  }
}

@media (max-width: 767px) {
  .hero-section,
  .hero-container {
    min-height: 450px;
  }

  .hero-section {
    background-position: 65% center;
  }

  .hero-content {
    width: 100%;
  }

  .hero-content h1 {
    font-size: 39px;
  }

  .search-form {
    flex-direction: column;
    gap: 10px;
  }

  .search-form input {
    border: 2px solid #438c2b;
    border-radius: 12px;
  }

  .search-button {
    min-height: 54px;
    border-radius: 12px;
  }

  .location-banner {
    padding: 30px 20px;
    flex-direction: column;
    text-align: center;
  }

  .location-button {
    margin-left: 0;
  }
}
</style>