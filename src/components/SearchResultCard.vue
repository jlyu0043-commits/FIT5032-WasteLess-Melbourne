<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="result-card">
    <div class="result-icon">
      {{ item.icon }}
    </div>

    <div class="result-information">
      <h2>{{ item.name }}</h2>

      <p class="result-category">
        {{ item.category }}
      </p>

      <p class="result-description">
        {{ item.description }}
      </p>
    </div>

    <RouterLink
      class="btn details-button"
      :to="{
        name: 'item-details',
        params: {
          id: item.id,
        },
      }"
    >
      View Details
      <span>→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.result-card {
  padding: 28px 38px;
  display: flex;
  align-items: center;
  gap: 35px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.09);
}

.result-icon {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 55px;
}

.result-information {
  flex-grow: 1;
}

.result-information h2 {
  margin-bottom: 5px;
  color: #17202a;
  font-size: 29px;
  font-weight: 700;
}

.result-category {
  margin-bottom: 6px;
  color: #438c2b;
  font-size: 18px;
  font-weight: 700;
}

.result-description {
  margin: 0;
  color: #475569;
  font-size: 17px;
}

.details-button {
  min-width: 205px;
  padding: 15px 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background-color: #4c962f;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.details-button:hover {
  background-color: #347521;
  color: white;
}

.details-button span {
  font-size: 24px;
}

@media (max-width: 767px) {
  .result-card {
    padding: 25px 20px;
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .result-icon {
    width: 90px;
    height: 90px;
    font-size: 45px;
  }

  .result-information h2 {
    font-size: 24px;
  }

  .details-button {
    width: 100%;
  }
}
</style>