<script setup>
const summaryCards = [
  {
    id: 1,
    label: 'Waste Items',
    value: 64,
    icon: '📄',
  },
  {
    id: 2,
    label: 'Locations',
    value: 18,
    icon: '📍',
  },
  {
    id: 3,
    label: 'Categories',
    value: 6,
    icon: '♻️',
  },
]

const categoryCounts = [
  {
    name: 'Plastic',
    count: 26,
    width: '87%',
  },
  {
    name: 'Glass',
    count: 18,
    width: '60%',
  },
  {
    name: 'E-waste',
    count: 9,
    width: '30%',
  },
  {
    name: 'Batteries',
    count: 6,
    width: '20%',
  },
  {
    name: 'Food Waste',
    count: 5,
    width: '17%',
  },
]

const dashboardSections = [
  {
    id: 1,
    name: 'Waste Items',
    icon: '📋',
  },
  {
    id: 2,
    name: 'Locations',
    icon: '📍',
  },
  {
    id: 3,
    name: 'Categories',
    icon: '♻️',
  },
]
</script>

<template>
  <main>
    <section class="dashboard-hero">
      <div class="container">
        <h1>Admin Dashboard</h1>

        <p>
          View an overview of WasteLess Melbourne content.
        </p>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="container">
        <div class="row g-4 summary-row">
          <div
            v-for="card in summaryCards"
            :key="card.id"
            class="col-12 col-md-4"
          >
            <article class="summary-card">
              <div class="summary-icon">
                {{ card.icon }}
              </div>

              <div>
                <p>{{ card.label }}</p>
                <strong>{{ card.value }}</strong>
              </div>
            </article>
          </div>
        </div>

        <div class="row g-4 dashboard-content">
          <div class="col-12 col-lg-8">
            <article class="dashboard-panel">
              <h2>Waste Items by Category</h2>

              <div class="chart-list">
                <div
                  v-for="category in categoryCounts"
                  :key="category.name"
                  class="chart-row"
                >
                  <span>{{ category.name }}</span>

                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      :style="{ width: category.width }"
                    ></div>
                  </div>

                  <strong>{{ category.count }}</strong>
                </div>
              </div>
            </article>
          </div>

          <div class="col-12 col-lg-4">
            <article class="dashboard-panel">
              <h2>Dashboard Sections</h2>

              <div class="section-list">
                <div
                  v-for="section in dashboardSections"
                  :key="section.id"
                  class="section-row"
                >
                  <span>{{ section.icon }}</span>
                  <p>{{ section.name }}</p>
                </div>
              </div>

            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-hero {
  min-height: 330px;
  padding: 58px 0 120px;
  background-image:
    linear-gradient(
      90deg,
      rgba(250, 252, 247, 0.99) 0%,
      rgba(250, 252, 247, 0.92) 45%,
      rgba(250, 252, 247, 0.08) 78%
    ),
    url('/images/melbourne-eco-hero.png');
  background-position: center;
  background-size: cover;
}

.dashboard-hero h1 {
  margin-bottom: 10px;
  color: #17202a;
  font-size: 54px;
  font-weight: 750;
}

.dashboard-hero p {
  color: #475569;
  font-size: 20px;
}

.dashboard-section {
  margin-top: -85px;
  padding-bottom: 55px;
  position: relative;
  background-color: #fbfcfb;
}

.summary-card,
.dashboard-panel {
  background-color: white;
  border: 1px solid #e1e7df;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(28, 55, 27, 0.1);
}

.summary-card {
  min-height: 150px;
  padding: 26px;
  display: flex;
  align-items: center;
  gap: 22px;
}

.summary-icon {
  width: 78px;
  height: 78px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 39px;
}

.summary-card p {
  margin: 0;
  color: #475569;
  font-size: 18px;
}

.summary-card strong {
  color: #17202a;
  font-size: 38px;
}

.dashboard-content {
  margin-top: 6px;
}

.dashboard-panel {
  height: 100%;
  padding: 28px;
}

.dashboard-panel h2 {
  margin-bottom: 25px;
  color: #17202a;
  font-size: 25px;
  font-weight: 700;
}

.chart-list {
  display: grid;
  gap: 21px;
}

.chart-row {
  display: grid;
  grid-template-columns: 100px 1fr 35px;
  align-items: center;
  gap: 14px;
}

.chart-row span {
  color: #334155;
  font-weight: 600;
}

.bar-track {
  height: 22px;
  overflow: hidden;
  background-color: #edf1eb;
  border-radius: 5px;
}

.bar-fill {
  height: 100%;
  background-color: #438c2b;
  border-radius: 5px;
}

.chart-row strong {
  color: #17202a;
}

.section-list {
  display: grid;
  gap: 13px;
}

.section-row {
  min-height: 68px;
  padding: 14px 17px;
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: #f3f8ef;
  border: 1px solid #c8d8c1;
  border-radius: 10px;
}

.section-row span {
  font-size: 27px;
}

.section-row p {
  margin: 0;
  color: #347521;
  font-weight: 700;
}

@media (max-width: 767px) {
  .dashboard-hero {
    min-height: 370px;
    padding: 42px 0 110px;
    background-position: 65% center;
  }

  .dashboard-hero h1 {
    font-size: 41px;
    line-height: 1.12;
  }

  .dashboard-hero p {
    font-size: 18px;
  }

  .dashboard-section {
    margin-top: -70px;
  }

  .summary-card {
    min-height: 125px;
  }

  .dashboard-panel {
    padding: 22px 17px;
  }

  .chart-row {
    grid-template-columns: 88px 1fr 28px;
    gap: 8px;
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .summary-card {
    padding: 21px;
  }

  .summary-icon {
    width: 66px;
    height: 66px;
    font-size: 32px;
  }

  .chart-row {
    grid-template-columns: 1fr 32px;
  }

  .bar-track {
    grid-column: 1 / -1;
  }
}
</style>
