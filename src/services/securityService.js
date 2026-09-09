const UNSAFE_TEXT_PATTERN = /[<>\p{Cc}]/u

const ACCOUNT_ID_PATTERN =
  /^[A-Za-z0-9-]{1,100}$/u

export function normalisePlainText(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\s+/gu, ' ')
}

export function validateDisplayName(value) {
  const originalValue =
    typeof value === 'string' ? value : ''

  const safeValue =
    normalisePlainText(originalValue)

  if (!safeValue) {
    return {
      success: false,
      value: '',
      message: 'Name is required.',
    }
  }

  if (
    safeValue.length < 2 ||
    safeValue.length > 60
  ) {
    return {
      success: false,
      value: safeValue,
      message:
        'Name must contain between 2 and 60 characters.',
    }
  }

  if (UNSAFE_TEXT_PATTERN.test(originalValue)) {
    return {
      success: false,
      value: safeValue,
      message:
        'Name cannot contain HTML or control characters.',
    }
  }

  return {
    success: true,
    value: safeValue,
    message: '',
  }
}

export function isSafeAccountId(value) {
  return (
    typeof value === 'string' &&
    ACCOUNT_ID_PATTERN.test(value)
  )
}

export function createSafeGoogleMapsUrl(address) {
  const originalAddress =
    typeof address === 'string' ? address : ''

  const safeAddress =
    normalisePlainText(originalAddress)

  if (
    !safeAddress ||
    safeAddress.length > 200 ||
    UNSAFE_TEXT_PATTERN.test(originalAddress)
  ) {
    return 'https://www.google.com/maps'
  }

  const mapsUrl = new URL(
    'https://www.google.com/maps/search/',
  )

  mapsUrl.searchParams.set('api', '1')
  mapsUrl.searchParams.set('query', safeAddress)

  return mapsUrl.toString()
}