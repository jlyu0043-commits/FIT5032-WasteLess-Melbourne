<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="category-card">
    <div class="category-icon">
      {{ category.icon }}
    </div>

    <h3>{{ category.name }}</h3>

    <span class="card-arrow">→</span>
  </div>
</template>

<style scoped>
.category-card {
  height: 100%;
  min-height: 210px;
  padding: 25px 15px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.1);
  text-align: center;
  transition: 0.2s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(28, 55, 27, 0.15);
}

.category-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 46px;
}

.category-card h3 {
  margin: 0;
  color: #17202a;
  font-size: 19px;
  font-weight: 700;
}

.card-arrow {
  display: block;
  margin-top: 7px;
  color: #438c2b;
  font-size: 28px;
}
</style>