<script setup>
import { onMounted, ref } from 'vue'

const FORM_ENDPOINT =
  'https://formsubmit.co/3bcfa15e1ebac3e723eb1148c25ac0a8'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
]

const formRef = ref(null)
const fileInput = ref(null)

const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const attachment = ref(null)

const nameError = ref('')
const emailError = ref('')
const subjectError = ref('')
const messageError = ref('')
const attachmentError = ref('')

const submitSuccess = ref('')
const isSubmitting = ref(false)

const successRedirect =
  `${window.location.origin}/contact?sent=1`

onMounted(() => {
  const params =
    new URLSearchParams(window.location.search)

  if (params.get('sent') === '1') {
    submitSuccess.value =
      'Your email and attachment were sent successfully.'

    window.history.replaceState(
      {},
      '',
      '/contact',
    )
  }
})

function clearErrors() {
  nameError.value = ''
  emailError.value = ''
  subjectError.value = ''
  messageError.value = ''
  attachmentError.value = ''
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(
    value.trim(),
  )
}

function handleFileChange(event) {
  attachmentError.value = ''

  const file =
    event.target.files?.[0] || null

  attachment.value = file

  if (!file) {
    return
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    attachmentError.value =
      'Please upload a PDF, PNG, JPG or JPEG file.'

    attachment.value = null
    event.target.value = ''
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    attachmentError.value =
      'The attachment must be 10 MB or smaller.'

    attachment.value = null
    event.target.value = ''
  }
}

function validateForm() {
  clearErrors()

  let isValid = true

  const safeName = name.value.trim()
  const safeEmail = email.value.trim()
  const safeSubject = subject.value.trim()
  const safeMessage = message.value.trim()

  if (
    safeName.length < 2 ||
    safeName.length > 60
  ) {
    nameError.value =
      'Please enter a name between 2 and 60 characters.'
    isValid = false
  }

  if (!isValidEmail(safeEmail)) {
    emailError.value =
      'Please enter a valid email address.'
    isValid = false
  }

  if (
    safeSubject.length < 3 ||
    safeSubject.length > 100
  ) {
    subjectError.value =
      'Please enter a subject between 3 and 100 characters.'
    isValid = false
  }

  if (
    safeMessage.length < 10 ||
    safeMessage.length > 2000
  ) {
    messageError.value =
      'Please enter a message between 10 and 2000 characters.'
    isValid = false
  }

  if (!attachment.value) {
    attachmentError.value =
      'Please attach a PDF, PNG, JPG or JPEG file.'
    isValid = false
  }

  return isValid
}

function handleSubmit(event) {
  submitSuccess.value = ''

  if (!validateForm()) {
    event.preventDefault()
    return
  }

  isSubmitting.value = true

  /*
   * Do not prevent the default form submission here.
   *
   * The browser must submit this form normally using
   * multipart/form-data so FormSubmit receives the
   * real file attachment.
   */
}
</script>

<template>
  <main class="contact-page">
    <section class="contact-hero">
      <div class="container">
        <div class="hero-content">
          <p class="eyebrow">
            Get in touch
          </p>

          <h1>
            Contact WasteLess Melbourne
          </h1>

          <p class="hero-description">
            Send us a recycling enquiry, feedback or supporting
            document. Your message and attachment will be sent
            directly to the WasteLess Melbourne team.
          </p>
        </div>
      </div>
    </section>

    <section class="contact-section">
      <div class="container">
        <div class="contact-layout">
          <article class="contact-card">
            <h2>
              Send us a message
            </h2>

            <p class="form-introduction">
              All fields are required. Attachments must be PDF,
              PNG, JPG or JPEG files up to 10 MB.
            </p>

            <form
              ref="formRef"
              class="contact-form"
              :action="FORM_ENDPOINT"
              method="POST"
              enctype="multipart/form-data"
              novalidate
              @submit="handleSubmit"
            >
              <!-- FormSubmit settings -->
              <input
                type="hidden"
                name="_template"
                value="table"
              />

              <input
                type="hidden"
                name="_next"
                :value="successRedirect"
              />

              <input
                type="hidden"
                name="_subject"
                :value="
                  subject.trim()
                    ? `WasteLess Melbourne: ${subject.trim()}`
                    : 'WasteLess Melbourne enquiry'
                "
              />

              <input
                type="hidden"
                name="_replyto"
                :value="email.trim()"
              />

              <!-- Honeypot -->
              <input
                class="honeypot"
                type="text"
                name="_honey"
                tabindex="-1"
                autocomplete="off"
              />

              <div class="form-group">
                <label for="contact-name">
                  Name
                </label>

                <input
                  id="contact-name"
                  v-model="name"
                  name="name"
                  type="text"
                  maxlength="60"
                  autocomplete="name"
                  :aria-invalid="Boolean(nameError)"
                  :aria-describedby="
                    nameError
                      ? 'contact-name-error'
                      : undefined
                  "
                  required
                />

                <p
                  v-if="nameError"
                  id="contact-name-error"
                  class="field-error"
                  role="alert"
                >
                  {{ nameError }}
                </p>
              </div>

              <div class="form-group">
                <label for="contact-email">
                  Email
                </label>

                <input
                  id="contact-email"
                  v-model="email"
                  name="email"
                  type="email"
                  maxlength="120"
                  autocomplete="email"
                  :aria-invalid="Boolean(emailError)"
                  :aria-describedby="
                    emailError
                      ? 'contact-email-error'
                      : undefined
                  "
                  required
                />

                <p
                  v-if="emailError"
                  id="contact-email-error"
                  class="field-error"
                  role="alert"
                >
                  {{ emailError }}
                </p>
              </div>

              <div class="form-group">
                <label for="contact-subject">
                  Subject
                </label>

                <input
                  id="contact-subject"
                  v-model="subject"
                  name="subject"
                  type="text"
                  maxlength="100"
                  :aria-invalid="Boolean(subjectError)"
                  :aria-describedby="
                    subjectError
                      ? 'contact-subject-error'
                      : undefined
                  "
                  required
                />

                <p
                  v-if="subjectError"
                  id="contact-subject-error"
                  class="field-error"
                  role="alert"
                >
                  {{ subjectError }}
                </p>
              </div>

              <div class="form-group">
                <label for="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  v-model="message"
                  name="message"
                  rows="7"
                  maxlength="2000"
                  :aria-invalid="Boolean(messageError)"
                  :aria-describedby="
                    messageError
                      ? 'contact-message-error'
                      : 'contact-message-help'
                  "
                  required
                ></textarea>

                <div class="field-meta">
                  <span id="contact-message-help">
                    10–2000 characters
                  </span>

                  <span>
                    {{ message.length }}/2000
                  </span>
                </div>

                <p
                  v-if="messageError"
                  id="contact-message-error"
                  class="field-error"
                  role="alert"
                >
                  {{ messageError }}
                </p>
              </div>

              <div class="form-group">
                <span class="field-label">
                  Attachment
                </span>

                <div class="file-upload-control">
                  <input
                    id="contact-attachment"
                    ref="fileInput"
                    class="native-file-input"
                    name="attachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    :aria-invalid="Boolean(attachmentError)"
                    :aria-describedby="
                      attachmentError
                        ? 'contact-attachment-error'
                        : 'contact-attachment-help'
                    "
                    required
                    @change="handleFileChange"
                  />

                  <label
                    for="contact-attachment"
                    class="choose-file-button"
                  >
                    Choose file
                  </label>

                  <span class="file-name">
                    {{
                      attachment
                        ? attachment.name
                        : 'No file selected'
                    }}
                  </span>
                </div>

                <p
                  id="contact-attachment-help"
                  class="field-help"
                >
                  PDF, PNG, JPG or JPEG. Maximum size: 10 MB.
                </p>

                <p
                  v-if="attachmentError"
                  id="contact-attachment-error"
                  class="field-error"
                  role="alert"
                >
                  {{ attachmentError }}
                </p>
              </div>

              <button
                class="send-button"
                type="submit"
                :disabled="isSubmitting"
              >
                {{
                  isSubmitting
                    ? 'Sending…'
                    : 'Send email with attachment'
                }}
              </button>

              <p
                v-if="submitSuccess"
                class="form-message success-message"
                role="status"
                aria-live="polite"
              >
                {{ submitSuccess }}
              </p>
            </form>
          </article>

          <aside class="contact-info">
            <div class="info-card">
              <h2>
                What can you contact us about?
              </h2>

              <ul>
                <li>
                  Recycling and waste questions
                </li>

                <li>
                  Community program enquiries
                </li>

                <li>
                  Feedback about WasteLess Melbourne
                </li>

                <li>
                  Supporting documents or images
                </li>
              </ul>
            </div>

            <div class="info-card">
              <h2>
                Attachment guidance
              </h2>

              <p>
                Please avoid sending passwords, payment details or
                other sensitive personal information.
              </p>

              <p>
                Only attach files that are relevant to your
                enquiry.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.contact-page {
  min-height: 100vh;
  background-color: #f8faf7;
}

.contact-hero {
  padding: 64px 0 110px;
  background:
    linear-gradient(
      135deg,
      #eff7ea 0%,
      #f8fbf6 60%,
      #eef6ea 100%
    );
}

.hero-content {
  max-width: 760px;
}

.eyebrow {
  margin-bottom: 10px;
  color: #438c2b;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.contact-hero h1 {
  margin-bottom: 18px;
  color: #17202a;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 750;
  line-height: 1.1;
}

.hero-description {
  margin: 0;
  color: #52606d;
  font-size: 18px;
  line-height: 1.7;
}

.contact-section {
  margin-top: -64px;
  padding-bottom: 64px;
}

.contact-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1.65fr)
    minmax(260px, 0.75fr);
  gap: 28px;
  align-items: start;
}

.contact-card,
.info-card {
  background-color: white;
  border: 1px solid #dfe7dc;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(31, 58, 30, 0.08);
}

.contact-card {
  padding: 34px;
}

.contact-card h2,
.info-card h2 {
  margin-bottom: 10px;
  color: #17202a;
  font-weight: 700;
}

.contact-card h2 {
  font-size: 28px;
}

.form-introduction {
  margin-bottom: 26px;
  color: #64748b;
}

.contact-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: grid;
  gap: 8px;
}

.form-group label,
.field-label {
  color: #17202a;
  font-weight: 650;
}

.form-group input:not(.native-file-input),
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #c7d2c4;
  border-radius: 9px;
  background-color: #ffffff;
  color: #263238;
  font: inherit;
}

.form-group input:focus-visible,
.form-group textarea:focus-visible,
.send-button:focus-visible,
.choose-file-button:focus-visible {
  outline: 3px solid rgba(67, 140, 43, 0.3);
  outline-offset: 2px;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #438c2b;
}

.form-group textarea {
  resize: vertical;
}

.field-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #64748b;
  font-size: 13px;
}

.field-help {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.field-error {
  margin: 0;
  color: #b42318;
  font-size: 14px;
  font-weight: 600;
}

.file-upload-control {
  min-height: 58px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #c7d2c4;
  border-radius: 9px;
  background-color: #ffffff;
}

.native-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.choose-file-button {
  margin: 0;
  padding: 9px 14px;
  flex-shrink: 0;
  border: 1px solid #438c2b;
  border-radius: 7px;
  background-color: #ffffff;
  color: #347521;
  cursor: pointer;
  font-weight: 650;
}

.choose-file-button:hover {
  background-color: #edf7e9;
}

.file-name {
  min-width: 0;
  overflow: hidden;
  color: #64748b;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.honeypot {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.send-button {
  min-height: 50px;
  padding: 12px 20px;
  border: none;
  border-radius: 9px;
  background-color: #438c2b;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
}

.send-button:hover:not(:disabled) {
  background-color: #347521;
}

.send-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.form-message {
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  font-weight: 600;
}

.success-message {
  background-color: #edf7e9;
  color: #2f6f1f;
}

.contact-info {
  display: grid;
  gap: 20px;
}

.info-card {
  padding: 24px;
}

.info-card h2 {
  font-size: 20px;
}

.info-card p,
.info-card li {
  color: #5e6b75;
  line-height: 1.65;
}

.info-card ul {
  margin: 0;
  padding-left: 20px;
}

.info-card li + li {
  margin-top: 8px;
}

@media (max-width: 991px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .contact-info {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .contact-hero {
    padding: 46px 0 90px;
  }

  .contact-section {
    margin-top: -48px;
  }

  .contact-card {
    padding: 24px 18px;
  }

  .contact-info {
    grid-template-columns: 1fr;
  }

  .field-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .file-upload-control {
    align-items: flex-start;
    flex-direction: column;
  }

  .file-name {
    width: 100%;
  }
}
</style>