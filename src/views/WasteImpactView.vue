<script setup>
import { computed, ref } from 'vue'

const LOCAL_ENDPOINT =
  'http://127.0.0.1:5001/wasteless-melbourne/australia-southeast2/calculateWasteImpact'

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

const API_ENDPOINT =
  import.meta.env.VITE_WASTE_IMPACT_API_URL ||
  (isLocalhost ? LOCAL_ENDPOINT : '')

const materialOptions = [
  {
    value: 'plastic',
    label: 'Plastic',
  },
  {
    value: 'aluminium',
    label: 'Aluminium',
  },
  {
    value: 'glass',
    label: 'Glass',
  },
  {
    value: 'paper',
    label: 'Paper & Cardboard',
  },
  {
    value: 'ewaste',
    label: 'E-waste',
  },
]

const material = ref('')
const weightKg = ref('')
const result = ref(null)

const materialError = ref('')
const weightError = ref('')
const submitError = ref('')
const isLoading = ref(false)

const formattedTimestamp = computed(() => {
  if (!result.value?.serverTimestamp) {
    return ''
  }

  return new Date(
    result.value.serverTimestamp,
  ).toLocaleString()
})

const isProductionDemo = computed(
  () => !API_ENDPOINT,
)

function clearErrors() {
  materialError.value = ''
  weightError.value = ''
  submitError.value = ''
}

function validateForm() {
  clearErrors()

  let isValid = true

  if (!material.value) {
    materialError.value =
      'Please select a material.'
    isValid = false
  }

  const weight = Number(weightKg.value)

  if (
    weightKg.value === '' ||
    !Number.isFinite(weight) ||
    weight <= 0 ||
    weight > 10000
  ) {
    weightError.value =
      'Enter a weight greater than 0 and no more than 10,000 kg.'
    isValid = false
  }

  return isValid
}

async function calculateImpact() {
  result.value = null

  if (!validateForm()) {
    return
  }

  if (!API_ENDPOINT) {
    submitError.value =
      'This serverless feature is demonstrated locally with the Firebase Functions Emulator because production Cloud Functions deployment requires the Firebase Blaze plan.'
    return
  }

  isLoading.value = true
  submitError.value = ''

  try {
    const response = await fetch(
      API_ENDPOINT,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          material: material.value,
          weightKg:
            Number(weightKg.value),
        }),
      },
    )

    let data = null

    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          'The server could not calculate the waste impact.',
      )
    }

    if (!data?.success || !data?.result) {
      throw new Error(
        'The server returned an unexpected response.',
      )
    }

    result.value = data.result
  } catch (error) {
    console.error(
      'Waste impact calculation failed:',
      error,
    )

    submitError.value =
      error?.message ||
      'Unable to connect to the Firebase Cloud Function.'
  } finally {
    isLoading.value = false
  }
}

function resetCalculator() {
  material.value = ''
  weightKg.value = ''
  result.value = null
  clearErrors()
}
</script>

<template>
  <main class="impact-page">
    <section class="impact-hero">
      <div class="container">
        <p class="eyebrow">
          Serverless sustainability tool
        </p>

        <h1>
          Waste Impact Calculator
        </h1>

        <p class="hero-description">
          Estimate the environmental impact of
          diverting recyclable material from
          landfill. Calculations are processed
          by a Firebase Cloud Function.
        </p>
      </div>
    </section>

    <section class="calculator-section">
      <div class="container">
        <div
          v-if="isProductionDemo"
          class="deployment-notice"
          role="status"
        >
          <strong>
            Firebase Emulator demonstration
          </strong>

          <p>
            The Firebase Cloud Function has been
            implemented and tested successfully
            using the Firebase Functions Emulator.
            Production deployment requires the
            Firebase Blaze pay-as-you-go plan, so
            this public version does not send a
            live Cloud Function request.
          </p>
        </div>

        <div class="calculator-layout">
          <article class="calculator-card">
            <div class="card-heading">
              <p class="feature-label">
                Firebase Cloud Functions
              </p>

              <h2>
                Calculate recycling impact
              </h2>

              <p>
                Select a material and enter its
                approximate weight.
              </p>
            </div>

            <form
              class="calculator-form"
              novalidate
              @submit.prevent="
                calculateImpact
              "
            >
              <div class="form-group">
                <label for="impact-material">
                  Material
                </label>

                <select
                  id="impact-material"
                  v-model="material"
                  :aria-invalid="
                    Boolean(materialError)
                  "
                  :aria-describedby="
                    materialError
                      ? 'material-error'
                      : undefined
                  "
                  required
                >
                  <option value="">
                    Select a material
                  </option>

                  <option
                    v-for="
                      option in materialOptions
                    "
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>

                <p
                  v-if="materialError"
                  id="material-error"
                  class="field-error"
                  role="alert"
                >
                  {{ materialError }}
                </p>
              </div>

              <div class="form-group">
                <label for="impact-weight">
                  Weight (kg)
                </label>

                <input
                  id="impact-weight"
                  v-model="weightKg"
                  type="number"
                  min="0.01"
                  max="10000"
                  step="0.01"
                  inputmode="decimal"
                  placeholder="e.g. 5"
                  :aria-invalid="
                    Boolean(weightError)
                  "
                  :aria-describedby="
                    weightError
                      ? 'weight-error'
                      : 'weight-help'
                  "
                  required
                />

                <p
                  id="weight-help"
                  class="field-help"
                >
                  Enter a value between 0.01 kg
                  and 10,000 kg.
                </p>

                <p
                  v-if="weightError"
                  id="weight-error"
                  class="field-error"
                  role="alert"
                >
                  {{ weightError }}
                </p>
              </div>

              <div class="button-row">
                <button
                  class="calculate-button"
                  type="submit"
                  :disabled="isLoading"
                >
                  {{
                    isLoading
                      ? 'Calculating…'
                      : 'Calculate impact'
                  }}
                </button>

                <button
                  class="reset-button"
                  type="button"
                  :disabled="isLoading"
                  @click="resetCalculator"
                >
                  Reset
                </button>
              </div>

              <p
                v-if="submitError"
                class="submit-error"
                role="alert"
              >
                {{ submitError }}
              </p>
            </form>
          </article>

          <aside class="info-panel">
            <div class="info-card">
              <span
                class="info-icon"
                aria-hidden="true"
              >
                ☁️
              </span>

              <h2>
                Server-side processing
              </h2>

              <p>
                The browser sends the selected
                material and weight to a Firebase
                Cloud Function for calculation.
              </p>
            </div>

            <div class="info-card">
              <span
                class="info-icon"
                aria-hidden="true"
              >
                ✓
              </span>

              <h2>
                Server validation
              </h2>

              <p>
                The Cloud Function independently
                validates material and weight
                before returning a result.
              </p>
            </div>
          </aside>
        </div>

        <section
          v-if="result"
          class="result-section"
          aria-live="polite"
          aria-labelledby="impact-result-heading"
        >
          <div class="result-heading">
            <p class="feature-label">
              Calculation complete
            </p>

            <h2 id="impact-result-heading">
              Your estimated impact
            </h2>

            <p>
              Results returned from the Firebase
              Cloud Function.
            </p>
          </div>

          <div class="result-grid">
            <article class="result-card">
              <span class="result-label">
                Material
              </span>

              <strong>
                {{ result.material }}
              </strong>
            </article>

            <article class="result-card">
              <span class="result-label">
                Material weight
              </span>

              <strong>
                {{ result.weightKg }} kg
              </strong>
            </article>

            <article class="result-card">
              <span class="result-label">
                Landfill diverted
              </span>

              <strong>
                {{
                  result.landfillDivertedKg
                }}
                kg
              </strong>
            </article>

            <article
              class="result-card highlight-card"
            >
              <span class="result-label">
                Estimated CO₂ saved
              </span>

              <strong>
                {{
                  result.estimatedCo2SavedKg
                }}
                kg
              </strong>
            </article>
          </div>

          <div class="server-proof">
            <div>
              <span class="proof-label">
                Processed by
              </span>

              <strong>
                {{ result.processedBy }}
              </strong>
            </div>

            <div>
              <span class="proof-label">
                Server timestamp
              </span>

              <strong>
                {{ formattedTimestamp }}
              </strong>
            </div>
          </div>

          <p class="educational-note">
            {{ result.note }}
          </p>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.impact-page {
  min-height: 100vh;
  background-color: #f8faf7;
}

.impact-hero {
  padding: 64px 0 115px;
  background:
    linear-gradient(
      135deg,
      #edf7e9 0%,
      #f8fbf6 55%,
      #eef6ea 100%
    );
}

.eyebrow,
.feature-label {
  margin-bottom: 8px;
  color: #438c2b;
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.impact-hero h1 {
  max-width: 760px;
  margin-bottom: 18px;
  color: #17202a;
  font-size:
    clamp(2.3rem, 5vw, 3.7rem);
  font-weight: 760;
  line-height: 1.1;
}

.hero-description {
  max-width: 760px;
  margin: 0;
  color: #52606d;
  font-size: 18px;
  line-height: 1.7;
}

.calculator-section {
  margin-top: -64px;
  padding-bottom: 70px;
}

.deployment-notice {
  margin-bottom: 24px;
  padding: 18px 20px;
  border: 1px solid #e8c66a;
  border-radius: 12px;
  background-color: #fff8df;
  color: #674d00;
}

.deployment-notice strong {
  display: block;
  margin-bottom: 6px;
  color: #5b4300;
  font-size: 16px;
}

.deployment-notice p {
  margin: 0;
  line-height: 1.6;
}

.calculator-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1.5fr)
    minmax(280px, 0.7fr);
  gap: 26px;
  align-items: start;
}

.calculator-card,
.info-card,
.result-section {
  border: 1px solid #dfe7dc;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow:
    0 10px 30px
    rgba(31, 58, 30, 0.08);
}

.calculator-card {
  padding: 34px;
}

.card-heading {
  margin-bottom: 26px;
}

.card-heading h2,
.result-heading h2,
.info-card h2 {
  color: #17202a;
  font-weight: 720;
}

.card-heading h2 {
  margin-bottom: 8px;
  font-size: 28px;
}

.card-heading p:last-child,
.result-heading p:last-child,
.info-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.65;
}

.calculator-form {
  display: grid;
  gap: 22px;
}

.form-group {
  display: grid;
  gap: 8px;
}

.form-group label {
  color: #17202a;
  font-weight: 650;
}

.form-group select,
.form-group input {
  width: 100%;
  min-height: 48px;
  padding: 11px 13px;
  border: 1px solid #c7d2c4;
  border-radius: 9px;
  background-color: #ffffff;
  color: #263238;
  font: inherit;
}

.form-group select:focus-visible,
.form-group input:focus-visible,
.calculate-button:focus-visible,
.reset-button:focus-visible {
  outline: 3px solid
    rgba(67, 140, 43, 0.3);
  outline-offset: 2px;
}

.form-group select:focus,
.form-group input:focus {
  border-color: #438c2b;
}

.field-help {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.field-error,
.submit-error {
  margin: 0;
  color: #b42318;
  font-weight: 600;
}

.field-error {
  font-size: 14px;
}

.submit-error {
  padding: 12px 14px;
  border-radius: 8px;
  background-color: #fff0ee;
}

.button-row {
  display: flex;
  gap: 12px;
}

.calculate-button,
.reset-button {
  min-height: 48px;
  padding: 11px 20px;
  border-radius: 9px;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.calculate-button {
  flex: 1;
  border: 1px solid #438c2b;
  background-color: #438c2b;
  color: #ffffff;
}

.calculate-button:hover:not(:disabled) {
  background-color: #347521;
}

.reset-button {
  border: 1px solid #438c2b;
  background-color: #ffffff;
  color: #347521;
}

.reset-button:hover:not(:disabled) {
  background-color: #edf7e9;
}

.calculate-button:disabled,
.reset-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.info-panel {
  display: grid;
  gap: 20px;
}

.info-card {
  padding: 24px;
}

.info-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #edf7e9;
  font-size: 22px;
}

.info-card h2 {
  margin-bottom: 8px;
  font-size: 19px;
}

.result-section {
  margin-top: 28px;
  padding: 30px;
}

.result-heading {
  margin-bottom: 22px;
}

.result-heading h2 {
  margin-bottom: 6px;
  font-size: 27px;
}

.result-grid {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.result-card {
  min-height: 130px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #dfe7dc;
  border-radius: 12px;
  background-color: #f8faf7;
}

.highlight-card {
  border-color: #aad49b;
  background-color: #edf7e9;
}

.result-label,
.proof-label {
  color: #64748b;
  font-size: 13px;
}

.result-card strong {
  margin-top: 5px;
  color: #17202a;
  font-size: 24px;
}

.server-proof {
  margin-top: 20px;
  padding: 18px 20px;
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 18px;
  border-radius: 10px;
  background-color: #f3f7f1;
}

.server-proof > div {
  display: grid;
  gap: 4px;
}

.server-proof strong {
  color: #24451c;
}

.educational-note {
  margin: 18px 0 0;
  color: #64748b;
  font-size: 14px;
}

@media (max-width: 991px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }

  .info-panel {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .result-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .impact-hero {
    padding: 46px 0 90px;
  }

  .calculator-section {
    margin-top: -48px;
  }

  .calculator-card,
  .result-section {
    padding: 22px 18px;
  }

  .info-panel,
  .result-grid,
  .server-proof {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .button-row {
    flex-direction: column;
  }

  .reset-button {
    width: 100%;
  }
}
</style>