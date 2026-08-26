<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchResultCard from '../components/SearchResultCard.vue'
import { wasteItems } from '../data/wasteItems.js'

const route = useRoute()
const router = useRouter()

const searchText = ref(
  typeof route.query.q === 'string' ? route.query.q : '',
)

const searchedText = ref(searchText.value)
const results = ref([])

function findResults() {
  const searchTerm = searchedText.value.toLowerCase().trim()

  if (searchTerm === '') {
    results.value = []
    return
  }

  results.value = wasteItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.searchTerms.toLowerCase().includes(searchTerm)
    )
  })
}

function searchItems() {
  searchedText.value = searchText.value.trim()

  findResults()

  router.push({
    name: 'search-results',
    query: {
      q: searchedText.value,
    },
  })
}

findResults()
</script>

<template>
  <main>
    <section class="search-hero">
      <div class="container search-hero-container">
        <div class="search-content">
          <h1>Search Results</h1>

          <p>Find recycling information for your items.</p>

          <form class="search-form" @submit.prevent="searchItems">
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
        </div>
      </div>
    </section>

    <section class="results-section">
      <div class="container">
        <h2 v-if="searchedText" class="results-heading">
          Results for
          <span>“{{ searchedText }}”</span>
        </h2>

        <div v-if="results.length > 0" class="results-list">
          <SearchResultCard
            v-for="item in results"
            :key="item.id"
            :item="item"
          />
        </div>

        <div
          v-else-if="searchedText"
          class="no-results"
        >
          <div class="no-results-icon">🔍</div>

          <h2>No results found</h2>

          <p>
            Try searching for battery, laptop, glass or plastic.
          </p>
        </div>

        <div v-else class="no-results">
          <div class="no-results-icon">🔍</div>

          <h2>Search for an item</h2>

          <p>Enter an item name in the search box above.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.search-hero {
  min-height: 320px;
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

.search-hero-container {
  min-height: 320px;
  display: flex;
  align-items: center;
}

.search-content {
  width: 58%;
}

.search-content h1 {
  margin-bottom: 10px;
  color: #15191e;
  font-size: 54px;
  font-weight: 750;
}

.search-content > p {
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

.results-section {
  min-height: 450px;
  padding: 38px 0 55px;
  background-color: #fbfcfb;
}

.results-heading {
  margin-bottom: 23px;
  color: #17202a;
  font-size: 30px;
  font-weight: 700;
}

.results-heading span {
  color: #438c2b;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-results {
  padding: 60px 20px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  text-align: center;
}

.no-results-icon {
  margin-bottom: 10px;
  font-size: 52px;
}

.no-results h2 {
  color: #17202a;
  font-weight: 700;
}

.no-results p {
  margin: 0;
  color: #64748b;
}

@media (max-width: 767px) {
  .search-hero,
  .search-hero-container {
    min-height: 400px;
  }

  .search-hero {
    background-position: 65% center;
  }

  .search-content {
    width: 100%;
  }

  .search-content h1 {
    font-size: 40px;
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

  .results-heading {
    font-size: 25px;
  }
}
</style>