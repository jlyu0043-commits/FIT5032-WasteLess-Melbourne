<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  category: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    class="guide-card"
    :to="{
      name: 'category-details',
      params: {
        slug: category.slug,
      },
    }"
  >
    <div class="category-icon">
      {{ category.icon }}
    </div>

    <h2>{{ category.name }}</h2>

    <p>{{ category.description }}</p>

    <span class="card-arrow">→</span>
  </RouterLink>
</template>

<style scoped>
.guide-card {
  min-height: 210px;
  height: 100%;
  padding: 25px 20px;
  display: block;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.09);
  color: #17202a;
  text-align: center;
  text-decoration: none;
  transition: 0.2s;
}

.guide-card:hover {
  color: #17202a;
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(28, 55, 27, 0.15);
}

.category-icon {
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

.guide-card h2 {
  margin-bottom: 4px;
  color: #17202a;
  font-size: 22px;
  font-weight: 700;
}

.guide-card p {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 16px;
}

.card-arrow {
  color: #438c2b;
  font-size: 28px;
}
</style>