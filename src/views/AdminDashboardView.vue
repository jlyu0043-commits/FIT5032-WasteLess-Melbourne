<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue'

const ROWS_PER_PAGE = 10

/*
 * D.3 Test Data - Waste Items
 * 15 rows are included so pagination can be demonstrated.
 */
const wasteItems = [
  {
    id: 1,
    name: 'Household Batteries',
    category: 'Batteries',
    disposal: 'Battery collection point',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Car Batteries',
    category: 'Automotive',
    disposal: 'Specialist recycler',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Laptop Computers',
    category: 'E-waste',
    disposal: 'E-waste collection point',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Glass Bottles',
    category: 'Glass',
    disposal: 'Kerbside recycling bin',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Plastic Bottles',
    category: 'Plastic',
    disposal: 'Kerbside recycling bin',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Cardboard Boxes',
    category: 'Paper',
    disposal: 'Kerbside recycling bin',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Aluminium Cans',
    category: 'Metal',
    disposal: 'Kerbside recycling bin',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Food Scraps',
    category: 'Organic',
    disposal: 'FOGO or compost bin',
    status: 'Active',
  },
  {
    id: 9,
    name: 'Mobile Phones',
    category: 'E-waste',
    disposal: 'Phone recycling point',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Fluorescent Tubes',
    category: 'Hazardous',
    disposal: 'Special waste drop-off',
    status: 'Active',
  },
  {
    id: 11,
    name: 'Printer Cartridges',
    category: 'E-waste',
    disposal: 'Cartridge recycling point',
    status: 'Active',
  },
  {
    id: 12,
    name: 'Soft Plastics',
    category: 'Plastic',
    disposal: 'Special collection service',
    status: 'Review',
  },
  {
    id: 13,
    name: 'Paint Tins',
    category: 'Hazardous',
    disposal: 'Household chemical drop-off',
    status: 'Active',
  },
  {
    id: 14,
    name: 'Clothing',
    category: 'Textiles',
    disposal: 'Donation or textile recycling',
    status: 'Active',
  },
  {
    id: 15,
    name: 'Polystyrene Packaging',
    category: 'Plastic',
    disposal: 'Special recycling facility',
    status: 'Review',
  },
]

/*
 * D.3 Test Data - Recycling Locations
 * 15 rows are included so pagination can be demonstrated.
 */
const recyclingLocations = [
  {
    id: 1,
    name: 'Clayton Recycling Centre',
    suburb: 'Clayton',
    postcode: '3168',
    accepts: 'Batteries, E-waste',
    status: 'Open',
  },
  {
    id: 2,
    name: 'Oakleigh Collection Point',
    suburb: 'Oakleigh',
    postcode: '3166',
    accepts: 'Batteries',
    status: 'Open',
  },
  {
    id: 3,
    name: 'Monash Recycling Hub',
    suburb: 'Clayton',
    postcode: '3168',
    accepts: 'E-waste, Cartridges',
    status: 'Open',
  },
  {
    id: 4,
    name: 'Glen Waverley Drop-off',
    suburb: 'Glen Waverley',
    postcode: '3150',
    accepts: 'Batteries, E-waste',
    status: 'Open',
  },
  {
    id: 5,
    name: 'Mulgrave Resource Centre',
    suburb: 'Mulgrave',
    postcode: '3170',
    accepts: 'Cardboard, Metal',
    status: 'Open',
  },
  {
    id: 6,
    name: 'Springvale Recycling Station',
    suburb: 'Springvale',
    postcode: '3171',
    accepts: 'Glass, Metal',
    status: 'Open',
  },
  {
    id: 7,
    name: 'Dandenong Recovery Centre',
    suburb: 'Dandenong',
    postcode: '3175',
    accepts: 'E-waste, Paint',
    status: 'Open',
  },
  {
    id: 8,
    name: 'Chadstone Collection Hub',
    suburb: 'Chadstone',
    postcode: '3148',
    accepts: 'Batteries, Phones',
    status: 'Open',
  },
  {
    id: 9,
    name: 'Camberwell Recycling Facility',
    suburb: 'Camberwell',
    postcode: '3124',
    accepts: 'Paper, Glass',
    status: 'Open',
  },
  {
    id: 10,
    name: 'Box Hill Waste Hub',
    suburb: 'Box Hill',
    postcode: '3128',
    accepts: 'E-waste, Batteries',
    status: 'Open',
  },
  {
    id: 11,
    name: 'Richmond Recycling Point',
    suburb: 'Richmond',
    postcode: '3121',
    accepts: 'Textiles, Batteries',
    status: 'Open',
  },
  {
    id: 12,
    name: 'Brunswick Resource Centre',
    suburb: 'Brunswick',
    postcode: '3056',
    accepts: 'E-waste, Cardboard',
    status: 'Open',
  },
  {
    id: 13,
    name: 'Footscray Recovery Station',
    suburb: 'Footscray',
    postcode: '3011',
    accepts: 'Paint, Metal',
    status: 'Open',
  },
  {
    id: 14,
    name: 'Carlton Community Drop-off',
    suburb: 'Carlton',
    postcode: '3053',
    accepts: 'Batteries, Phones',
    status: 'Open',
  },
  {
    id: 15,
    name: 'Melbourne CBD Recycling Hub',
    suburb: 'Melbourne',
    postcode: '3000',
    accepts: 'E-waste, Cartridges',
    status: 'Temporarily Closed',
  },
]

const wasteGlobalSearch = ref('')
const wasteCurrentPage = ref(1)
const wasteSortKey = ref('id')
const wasteSortDirection = ref('asc')

const wasteFilters = ref({
  id: '',
  name: '',
  category: '',
  disposal: '',
  status: '',
})

const locationGlobalSearch = ref('')
const locationCurrentPage = ref(1)
const locationSortKey = ref('id')
const locationSortDirection = ref('asc')

const locationFilters = ref({
  id: '',
  name: '',
  suburb: '',
  postcode: '',
  accepts: '',
  status: '',
})

const summaryCards = computed(() => [
  {
    id: 1,
    label: 'Waste Items',
    value: wasteItems.length,
    icon: '♻️',
  },
  {
    id: 2,
    label: 'Locations',
    value: recyclingLocations.length,
    icon: '📍',
  },
  {
    id: 3,
    label: 'Rows Per Page',
    value: ROWS_PER_PAGE,
    icon: '📋',
  },
])

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
}

function matchesGlobalSearch(row, searchValue) {
  const search = normalize(searchValue)

  if (!search) {
    return true
  }

  return Object.values(row).some((value) =>
    normalize(value).includes(search),
  )
}

function matchesColumnFilters(row, filters) {
  return Object.entries(filters).every(
    ([key, filterValue]) => {
      const search = normalize(filterValue)

      if (!search) {
        return true
      }

      return normalize(row[key]).includes(search)
    },
  )
}

function sortRows(rows, key, direction) {
  return [...rows].sort((a, b) => {
    const first = a[key]
    const second = b[key]

    if (
      typeof first === 'number' &&
      typeof second === 'number'
    ) {
      return direction === 'asc'
        ? first - second
        : second - first
    }

    const result = String(first).localeCompare(
      String(second),
      undefined,
      {
        numeric: true,
        sensitivity: 'base',
      },
    )

    return direction === 'asc'
      ? result
      : -result
  })
}

const filteredWasteItems = computed(() => {
  return wasteItems.filter((item) => {
    return (
      matchesGlobalSearch(
        item,
        wasteGlobalSearch.value,
      ) &&
      matchesColumnFilters(
        item,
        wasteFilters.value,
      )
    )
  })
})

const sortedWasteItems = computed(() => {
  return sortRows(
    filteredWasteItems.value,
    wasteSortKey.value,
    wasteSortDirection.value,
  )
})

const wasteTotalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      sortedWasteItems.value.length /
        ROWS_PER_PAGE,
    ),
  )
})

const paginatedWasteItems = computed(() => {
  const start =
    (wasteCurrentPage.value - 1) *
    ROWS_PER_PAGE

  return sortedWasteItems.value.slice(
    start,
    start + ROWS_PER_PAGE,
  )
})

const wasteStartRow = computed(() => {
  if (sortedWasteItems.value.length === 0) {
    return 0
  }

  return (
    (wasteCurrentPage.value - 1) *
      ROWS_PER_PAGE +
    1
  )
})

const wasteEndRow = computed(() => {
  return Math.min(
    wasteCurrentPage.value *
      ROWS_PER_PAGE,
    sortedWasteItems.value.length,
  )
})

const filteredLocations = computed(() => {
  return recyclingLocations.filter(
    (location) => {
      return (
        matchesGlobalSearch(
          location,
          locationGlobalSearch.value,
        ) &&
        matchesColumnFilters(
          location,
          locationFilters.value,
        )
      )
    },
  )
})

const sortedLocations = computed(() => {
  return sortRows(
    filteredLocations.value,
    locationSortKey.value,
    locationSortDirection.value,
  )
})

const locationTotalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(
      sortedLocations.value.length /
        ROWS_PER_PAGE,
    ),
  )
})

const paginatedLocations = computed(() => {
  const start =
    (locationCurrentPage.value - 1) *
    ROWS_PER_PAGE

  return sortedLocations.value.slice(
    start,
    start + ROWS_PER_PAGE,
  )
})

const locationStartRow = computed(() => {
  if (sortedLocations.value.length === 0) {
    return 0
  }

  return (
    (locationCurrentPage.value - 1) *
      ROWS_PER_PAGE +
    1
  )
})

const locationEndRow = computed(() => {
  return Math.min(
    locationCurrentPage.value *
      ROWS_PER_PAGE,
    sortedLocations.value.length,
  )
})

function sortWasteTable(key) {
  if (wasteSortKey.value === key) {
    wasteSortDirection.value =
      wasteSortDirection.value === 'asc'
        ? 'desc'
        : 'asc'
  } else {
    wasteSortKey.value = key
    wasteSortDirection.value = 'asc'
  }

  wasteCurrentPage.value = 1
}

function sortLocationTable(key) {
  if (locationSortKey.value === key) {
    locationSortDirection.value =
      locationSortDirection.value === 'asc'
        ? 'desc'
        : 'asc'
  } else {
    locationSortKey.value = key
    locationSortDirection.value = 'asc'
  }

  locationCurrentPage.value = 1
}

function getWasteSortIndicator(key) {
  if (wasteSortKey.value !== key) {
    return '↕'
  }

  return wasteSortDirection.value === 'asc'
    ? '↑'
    : '↓'
}

function getLocationSortIndicator(key) {
  if (locationSortKey.value !== key) {
    return '↕'
  }

  return locationSortDirection.value ===
    'asc'
    ? '↑'
    : '↓'
}

function resetWasteFilters() {
  wasteGlobalSearch.value = ''

  wasteFilters.value = {
    id: '',
    name: '',
    category: '',
    disposal: '',
    status: '',
  }

  wasteSortKey.value = 'id'
  wasteSortDirection.value = 'asc'
  wasteCurrentPage.value = 1
}

function resetLocationFilters() {
  locationGlobalSearch.value = ''

  locationFilters.value = {
    id: '',
    name: '',
    suburb: '',
    postcode: '',
    accepts: '',
    status: '',
  }

  locationSortKey.value = 'id'
  locationSortDirection.value = 'asc'
  locationCurrentPage.value = 1
}

function goToWastePage(page) {
  if (
    page >= 1 &&
    page <= wasteTotalPages.value
  ) {
    wasteCurrentPage.value = page
  }
}

function goToLocationPage(page) {
  if (
    page >= 1 &&
    page <= locationTotalPages.value
  ) {
    locationCurrentPage.value = page
  }
}

watch(
  [
    wasteGlobalSearch,
    wasteFilters,
  ],
  () => {
    wasteCurrentPage.value = 1
  },
  {
    deep: true,
  },
)

watch(
  [
    locationGlobalSearch,
    locationFilters,
  ],
  () => {
    locationCurrentPage.value = 1
  },
  {
    deep: true,
  },
)

watch(
  wasteTotalPages,
  (totalPages) => {
    if (
      wasteCurrentPage.value >
      totalPages
    ) {
      wasteCurrentPage.value =
        totalPages
    }
  },
)

watch(
  locationTotalPages,
  (totalPages) => {
    if (
      locationCurrentPage.value >
      totalPages
    ) {
      locationCurrentPage.value =
        totalPages
    }
  },
)
</script>

<template>
  <main>
    <section class="dashboard-hero">
      <div class="container">
        <p class="eyebrow">
          Administration
        </p>

        <h1>Admin Dashboard</h1>

        <p class="hero-description">
          Search, sort and review WasteLess Melbourne
          application data.
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
              <div
                class="summary-icon"
                aria-hidden="true"
              >
                {{ card.icon }}
              </div>

              <div>
                <p>{{ card.label }}</p>
                <strong>{{ card.value }}</strong>
              </div>
            </article>
          </div>
        </div>

        <!-- TABLE 1 -->
        <section
          class="table-panel"
          aria-labelledby="waste-table-heading"
        >
          <div class="table-heading-row">
            <div>
              <p class="table-number">
                Interactive Table 1
              </p>

              <h2 id="waste-table-heading">
                Waste Items
              </h2>

              <p>
                Search, filter and sort waste
                information.
              </p>
            </div>

            <button
              type="button"
              class="reset-button"
              @click="resetWasteFilters"
            >
              Reset filters
            </button>
          </div>

          <div class="global-search">
            <label for="waste-global-search">
              Search all waste item columns
            </label>

            <input
              id="waste-global-search"
              v-model="wasteGlobalSearch"
              type="search"
              placeholder="Search all columns..."
            />
          </div>

          <div class="table-responsive">
            <table class="interactive-table">
              <caption class="visually-hidden">
                Interactive table of waste items
              </caption>

              <thead>
                <tr>
                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="sortWasteTable('id')"
                    >
                      ID
                      <span aria-hidden="true">
                        {{
                          getWasteSortIndicator(
                            'id',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortWasteTable('name')
                      "
                    >
                      Item Name
                      <span aria-hidden="true">
                        {{
                          getWasteSortIndicator(
                            'name',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortWasteTable(
                          'category',
                        )
                      "
                    >
                      Category
                      <span aria-hidden="true">
                        {{
                          getWasteSortIndicator(
                            'category',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortWasteTable(
                          'disposal',
                        )
                      "
                    >
                      Disposal Method
                      <span aria-hidden="true">
                        {{
                          getWasteSortIndicator(
                            'disposal',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortWasteTable(
                          'status',
                        )
                      "
                    >
                      Status
                      <span aria-hidden="true">
                        {{
                          getWasteSortIndicator(
                            'status',
                          )
                        }}
                      </span>
                    </button>
                  </th>
                </tr>

                <tr class="filter-row">
                  <th>
                    <label
                      class="visually-hidden"
                      for="waste-id-filter"
                    >
                      Search ID
                    </label>

                    <input
                      id="waste-id-filter"
                      v-model="
                        wasteFilters.id
                      "
                      type="search"
                      placeholder="Search ID"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="waste-name-filter"
                    >
                      Search item name
                    </label>

                    <input
                      id="waste-name-filter"
                      v-model="
                        wasteFilters.name
                      "
                      type="search"
                      placeholder="Search name"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="waste-category-filter"
                    >
                      Search category
                    </label>

                    <input
                      id="waste-category-filter"
                      v-model="
                        wasteFilters.category
                      "
                      type="search"
                      placeholder="Search category"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="waste-disposal-filter"
                    >
                      Search disposal method
                    </label>

                    <input
                      id="waste-disposal-filter"
                      v-model="
                        wasteFilters.disposal
                      "
                      type="search"
                      placeholder="Search disposal"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="waste-status-filter"
                    >
                      Search status
                    </label>

                    <input
                      id="waste-status-filter"
                      v-model="
                        wasteFilters.status
                      "
                      type="search"
                      placeholder="Search status"
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in paginatedWasteItems"
                  :key="item.id"
                >
                  <td>{{ item.id }}</td>

                  <td>
                    <strong>
                      {{ item.name }}
                    </strong>
                  </td>

                  <td>{{ item.category }}</td>

                  <td>{{ item.disposal }}</td>

                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        'status-review':
                          item.status ===
                          'Review',
                      }"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                </tr>

                <tr
                  v-if="
                    paginatedWasteItems.length ===
                    0
                  "
                >
                  <td
                    colspan="5"
                    class="empty-message"
                  >
                    No waste items match the
                    current search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <p>
              Showing
              {{ wasteStartRow }}–{{ wasteEndRow }}
              of
              {{ sortedWasteItems.length }}
              results
            </p>

            <nav
              class="pagination-controls"
              aria-label="Waste items pagination"
            >
              <button
                type="button"
                :disabled="
                  wasteCurrentPage === 1
                "
                @click="
                  goToWastePage(
                    wasteCurrentPage - 1,
                  )
                "
              >
                Previous
              </button>

              <button
                v-for="page in wasteTotalPages"
                :key="page"
                type="button"
                class="page-button"
                :class="{
                  active:
                    page ===
                    wasteCurrentPage,
                }"
                :aria-current="
                  page === wasteCurrentPage
                    ? 'page'
                    : undefined
                "
                @click="goToWastePage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="
                  wasteCurrentPage ===
                  wasteTotalPages
                "
                @click="
                  goToWastePage(
                    wasteCurrentPage + 1,
                  )
                "
              >
                Next
              </button>
            </nav>
          </div>
        </section>

        <!-- TABLE 2 -->
        <section
          class="table-panel"
          aria-labelledby="location-table-heading"
        >
          <div class="table-heading-row">
            <div>
              <p class="table-number">
                Interactive Table 2
              </p>

              <h2 id="location-table-heading">
                Recycling Locations
              </h2>

              <p>
                Search, filter and sort recycling
                location data.
              </p>
            </div>

            <button
              type="button"
              class="reset-button"
              @click="resetLocationFilters"
            >
              Reset filters
            </button>
          </div>

          <div class="global-search">
            <label
              for="location-global-search"
            >
              Search all recycling location
              columns
            </label>

            <input
              id="location-global-search"
              v-model="locationGlobalSearch"
              type="search"
              placeholder="Search all columns..."
            />
          </div>

          <div class="table-responsive">
            <table class="interactive-table">
              <caption class="visually-hidden">
                Interactive table of recycling
                locations
              </caption>

              <thead>
                <tr>
                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable('id')
                      "
                    >
                      ID
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'id',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable(
                          'name',
                        )
                      "
                    >
                      Location Name
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'name',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable(
                          'suburb',
                        )
                      "
                    >
                      Suburb
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'suburb',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable(
                          'postcode',
                        )
                      "
                    >
                      Postcode
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'postcode',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable(
                          'accepts',
                        )
                      "
                    >
                      Accepted Items
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'accepts',
                          )
                        }}
                      </span>
                    </button>
                  </th>

                  <th scope="col">
                    <button
                      type="button"
                      class="sort-button"
                      @click="
                        sortLocationTable(
                          'status',
                        )
                      "
                    >
                      Status
                      <span aria-hidden="true">
                        {{
                          getLocationSortIndicator(
                            'status',
                          )
                        }}
                      </span>
                    </button>
                  </th>
                </tr>

                <tr class="filter-row">
                  <th>
                    <label
                      class="visually-hidden"
                      for="location-id-filter"
                    >
                      Search location ID
                    </label>

                    <input
                      id="location-id-filter"
                      v-model="
                        locationFilters.id
                      "
                      type="search"
                      placeholder="Search ID"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="location-name-filter"
                    >
                      Search location name
                    </label>

                    <input
                      id="location-name-filter"
                      v-model="
                        locationFilters.name
                      "
                      type="search"
                      placeholder="Search name"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="location-suburb-filter"
                    >
                      Search suburb
                    </label>

                    <input
                      id="location-suburb-filter"
                      v-model="
                        locationFilters.suburb
                      "
                      type="search"
                      placeholder="Search suburb"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="location-postcode-filter"
                    >
                      Search postcode
                    </label>

                    <input
                      id="location-postcode-filter"
                      v-model="
                        locationFilters.postcode
                      "
                      type="search"
                      placeholder="Search postcode"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="location-accepts-filter"
                    >
                      Search accepted items
                    </label>

                    <input
                      id="location-accepts-filter"
                      v-model="
                        locationFilters.accepts
                      "
                      type="search"
                      placeholder="Search items"
                    />
                  </th>

                  <th>
                    <label
                      class="visually-hidden"
                      for="location-status-filter"
                    >
                      Search status
                    </label>

                    <input
                      id="location-status-filter"
                      v-model="
                        locationFilters.status
                      "
                      type="search"
                      placeholder="Search status"
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="
                    location in paginatedLocations
                  "
                  :key="location.id"
                >
                  <td>{{ location.id }}</td>

                  <td>
                    <strong>
                      {{ location.name }}
                    </strong>
                  </td>

                  <td>{{ location.suburb }}</td>

                  <td>{{ location.postcode }}</td>

                  <td>{{ location.accepts }}</td>

                  <td>
                    <span
                      class="status-badge"
                      :class="{
                        'status-closed':
                          location.status !==
                          'Open',
                      }"
                    >
                      {{ location.status }}
                    </span>
                  </td>
                </tr>

                <tr
                  v-if="
                    paginatedLocations.length ===
                    0
                  "
                >
                  <td
                    colspan="6"
                    class="empty-message"
                  >
                    No recycling locations match
                    the current search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <p>
              Showing
              {{ locationStartRow }}–{{
                locationEndRow
              }}
              of
              {{ sortedLocations.length }}
              results
            </p>

            <nav
              class="pagination-controls"
              aria-label="Recycling locations pagination"
            >
              <button
                type="button"
                :disabled="
                  locationCurrentPage === 1
                "
                @click="
                  goToLocationPage(
                    locationCurrentPage - 1,
                  )
                "
              >
                Previous
              </button>

              <button
                v-for="
                  page in locationTotalPages
                "
                :key="page"
                type="button"
                class="page-button"
                :class="{
                  active:
                    page ===
                    locationCurrentPage,
                }"
                :aria-current="
                  page ===
                  locationCurrentPage
                    ? 'page'
                    : undefined
                "
                @click="
                  goToLocationPage(page)
                "
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="
                  locationCurrentPage ===
                  locationTotalPages
                "
                @click="
                  goToLocationPage(
                    locationCurrentPage + 1,
                  )
                "
              >
                Next
              </button>
            </nav>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard-hero {
  padding: 58px 0 115px;
  background:
    linear-gradient(
      135deg,
      #eff7ea 0%,
      #f8fbf6 55%,
      #eef6ea 100%
    );
}

.eyebrow {
  margin-bottom: 8px;
  color: #438c2b;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-hero h1 {
  margin-bottom: 12px;
  color: #17202a;
  font-size: clamp(2.3rem, 5vw, 3.5rem);
  font-weight: 750;
}

.hero-description {
  margin: 0;
  color: #52606d;
  font-size: 19px;
}

.dashboard-section {
  margin-top: -65px;
  padding-bottom: 70px;
  background-color: #f8faf7;
}

.summary-row {
  margin-bottom: 28px;
}

.summary-card,
.table-panel {
  background-color: #ffffff;
  border: 1px solid #dfe7dc;
  border-radius: 16px;
  box-shadow:
    0 10px 30px
    rgba(31, 58, 30, 0.08);
}

.summary-card {
  min-height: 135px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-icon {
  width: 66px;
  height: 66px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: #edf6e8;
  border-radius: 50%;
  font-size: 32px;
}

.summary-card p {
  margin: 0 0 3px;
  color: #64748b;
}

.summary-card strong {
  color: #17202a;
  font-size: 32px;
}

.table-panel {
  margin-bottom: 30px;
  padding: 28px;
}

.table-heading-row {
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.table-number {
  margin-bottom: 5px;
  color: #438c2b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.table-heading-row h2 {
  margin-bottom: 5px;
  color: #17202a;
  font-size: 27px;
  font-weight: 700;
}

.table-heading-row p:last-child {
  margin: 0;
  color: #64748b;
}

.reset-button {
  min-height: 42px;
  padding: 9px 15px;
  flex-shrink: 0;
  border: 1px solid #438c2b;
  border-radius: 8px;
  background-color: #ffffff;
  color: #347521;
  cursor: pointer;
  font-weight: 650;
}

.reset-button:hover {
  background-color: #edf7e9;
}

.global-search {
  max-width: 520px;
  margin-bottom: 20px;
  display: grid;
  gap: 7px;
}

.global-search label {
  color: #334155;
  font-size: 14px;
  font-weight: 650;
}

.global-search input,
.filter-row input {
  width: 100%;
  border: 1px solid #c7d2c4;
  border-radius: 7px;
  background-color: #ffffff;
  color: #263238;
  font: inherit;
}

.global-search input {
  min-height: 46px;
  padding: 10px 13px;
}

.filter-row input {
  min-width: 110px;
  padding: 8px 9px;
  font-size: 13px;
}

.global-search input:focus-visible,
.filter-row input:focus-visible,
.sort-button:focus-visible,
.reset-button:focus-visible,
.pagination-controls button:focus-visible {
  outline: 3px solid rgba(67, 140, 43, 0.3);
  outline-offset: 2px;
}

.table-responsive {
  overflow-x: auto;
}

.interactive-table {
  width: 100%;
  min-width: 930px;
  border-collapse: collapse;
}

.interactive-table th,
.interactive-table td {
  padding: 13px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: middle;
}

.interactive-table thead tr:first-child {
  background-color: #edf6e8;
}

.interactive-table tbody tr:hover {
  background-color: #f8fbf7;
}

.sort-button {
  width: 100%;
  padding: 3px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: none;
  background: transparent;
  color: #24451c;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.filter-row {
  background-color: #f8faf7;
}

.status-badge {
  display: inline-block;
  padding: 5px 9px;
  border-radius: 999px;
  background-color: #e8f5e3;
  color: #2f6f1f;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.status-review {
  background-color: #fff4d6;
  color: #8a5a00;
}

.status-closed {
  background-color: #fff0ee;
  color: #b42318;
}

.empty-message {
  padding: 32px !important;
  color: #64748b;
  text-align: center !important;
}

.table-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.table-footer p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 7px;
}

.pagination-controls button {
  min-height: 38px;
  padding: 7px 12px;
  border: 1px solid #c7d2c4;
  border-radius: 7px;
  background-color: #ffffff;
  color: #334155;
  cursor: pointer;
}

.pagination-controls button:hover:not(
    :disabled
  ) {
  border-color: #438c2b;
  background-color: #edf7e9;
}

.pagination-controls button.active {
  border-color: #438c2b;
  background-color: #438c2b;
  color: #ffffff;
  font-weight: 700;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

@media (max-width: 767px) {
  .dashboard-hero {
    padding: 42px 0 90px;
  }

  .dashboard-section {
    margin-top: -48px;
  }

  .table-panel {
    padding: 20px 16px;
  }

  .table-heading-row,
  .table-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .reset-button {
    width: 100%;
  }

  .pagination-controls {
    flex-wrap: wrap;
  }
}

@media (max-width: 576px) {
  .summary-card {
    min-height: 110px;
  }

  .global-search {
    max-width: none;
  }
}
</style>