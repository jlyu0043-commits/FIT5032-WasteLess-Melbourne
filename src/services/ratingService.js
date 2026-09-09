import {
  readonly,
  ref,
} from 'vue'
import {
  isSafeAccountId,
} from './securityService.js'

const RATINGS_STORAGE_KEY =
  'wasteless-location-ratings'

const seedRatings = [
  {
    locationId: 1,
    userId: 'seed-admin',
    score: 4,
    createdAt:
      '2026-09-01T09:00:00.000Z',
    updatedAt:
      '2026-09-01T09:00:00.000Z',
  },
  {
    locationId: 1,
    userId: 'seed-user',
    score: 5,
    createdAt:
      '2026-09-01T09:10:00.000Z',
    updatedAt:
      '2026-09-01T09:10:00.000Z',
  },
  {
    locationId: 2,
    userId: 'seed-admin',
    score: 3,
    createdAt:
      '2026-09-01T09:20:00.000Z',
    updatedAt:
      '2026-09-01T09:20:00.000Z',
  },
  {
    locationId: 2,
    userId: 'seed-user',
    score: 4,
    createdAt:
      '2026-09-01T09:30:00.000Z',
    updatedAt:
      '2026-09-01T09:30:00.000Z',
  },
]

function copySeedRatings() {
  return seedRatings.map((rating) => ({
    ...rating,
  }))
}

function normaliseRating(rating) {
  const locationId =
    Number(rating?.locationId)
  const score = Number(rating?.score)

  const userId =
    typeof rating?.userId === 'string'
      ? rating.userId.trim()
      : ''

  if (
    !Number.isInteger(locationId) ||
    locationId < 1 ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5 ||
    !isSafeAccountId(userId)
  ) {
    return null
  }

  return {
    locationId,
    userId,
    score,
    createdAt:
      typeof rating.createdAt === 'string'
        ? rating.createdAt
        : new Date().toISOString(),
    updatedAt:
      typeof rating.updatedAt === 'string'
        ? rating.updatedAt
        : new Date().toISOString(),
  }
}

function writeRatings(ratings) {
  try {
    localStorage.setItem(
      RATINGS_STORAGE_KEY,
      JSON.stringify(ratings),
    )

    return true
  } catch {
    return false
  }
}

function readRatings() {
  try {
    const storedRatings =
      localStorage.getItem(
        RATINGS_STORAGE_KEY,
      )

    if (storedRatings === null) {
      const initialRatings =
        copySeedRatings()

      writeRatings(initialRatings)
      return initialRatings
    }

    const parsedRatings =
      JSON.parse(storedRatings)

    if (!Array.isArray(parsedRatings)) {
      return []
    }

    const uniqueRatings = new Map()

    for (
      const storedRating of parsedRatings
    ) {
      const validRating =
        normaliseRating(storedRating)

      if (!validRating) {
        continue
      }

      const ratingKey =
        `${validRating.locationId}:` +
        validRating.userId

      uniqueRatings.set(
        ratingKey,
        validRating,
      )
    }

    return [...uniqueRatings.values()]
  } catch {
    return []
  }
}

const ratingsState = ref(readRatings())

function saveRating({
  locationId,
  userId,
  score,
}) {
  const validRating = normaliseRating({
    locationId,
    userId,
    score,
  })

  if (!validRating) {
    return {
      success: false,
      message:
        'Please select a rating from 1 to 5.',
    }
  }

  const existingRatingIndex =
    ratingsState.value.findIndex(
      (rating) => {
        return (
          rating.locationId ===
            validRating.locationId &&
          rating.userId ===
            validRating.userId
        )
      },
    )

  const now = new Date().toISOString()
  const updatedRatings = [
    ...ratingsState.value,
  ]

  if (existingRatingIndex >= 0) {
    updatedRatings[
      existingRatingIndex
    ] = {
      ...updatedRatings[
        existingRatingIndex
      ],
      score: validRating.score,
      updatedAt: now,
    }
  } else {
    updatedRatings.push({
      ...validRating,
      createdAt: now,
      updatedAt: now,
    })
  }

  if (!writeRatings(updatedRatings)) {
    return {
      success: false,
      message:
        'Your rating could not be saved. Please try again.',
    }
  }

  ratingsState.value = updatedRatings

  return {
    success: true,
    updated:
      existingRatingIndex >= 0,
  }
}

export function useRatings() {
  return {
    ratings: readonly(ratingsState),
    saveRating,
  }
}