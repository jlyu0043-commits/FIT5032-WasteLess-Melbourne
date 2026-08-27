<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  location: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="location-card">
    <div class="location-icon">
      {{ location.icon }}
    </div>

    <div class="location-information">
      <h3>{{ location.name }}</h3>

      <p class="distance">
        📍 {{ location.distance }}
      </p>

      <p class="accepted-items">
        <strong>Accepts:</strong>
        {{ location.accepts.join(', ') }}
      </p>
    </div>

    <RouterLink
      class="btn details-button"
      :to="{
        name: 'location-details',
        params: {
          id: location.id,
        },
      }"
    >
      View Details
      <span>→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.location-card {
  min-height: 160px;
  padding: 24px;
  display: grid;
  grid-template-columns: 95px 1fr auto;
  align-items: center;
  gap: 24px;
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 15px;
  box-shadow: 0 6px 16px rgba(28, 55, 27, 0.08);
}

.location-icon {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 45px;
}

.location-information h3 {
  margin-bottom: 10px;
  color: #17202a;
  font-size: 22px;
  font-weight: 700;
}

.location-information p {
  margin-bottom: 7px;
  color: #475569;
}

.distance {
  font-size: 15px;
}

.accepted-items strong {
  color: #438c2b;
}

.details-button {
  min-width: 145px;
  padding: 13px 18px;
  background-color: #4c962f;
  border-radius: 10px;
  color: white;
  font-weight: 700;
}

.details-button span {
  margin-left: 10px;
  font-size: 20px;
}

.details-button:hover {
  background-color: #347521;
  color: white;
}

@media (max-width: 767px) {
  .location-card {
    padding: 24px 18px;
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 15px;
    text-align: center;
  }

  .location-information h3 {
    font-size: 21px;
  }

  .details-button {
    width: 100%;
  }
}
</style>