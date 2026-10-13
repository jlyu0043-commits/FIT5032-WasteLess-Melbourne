const { onRequest } =
  require('firebase-functions/v2/https')

const logger =
  require('firebase-functions/logger')

const MATERIAL_FACTORS = {
  plastic: {
    label: 'Plastic',
    co2Factor: 1.5,
  },
  aluminium: {
    label: 'Aluminium',
    co2Factor: 4.5,
  },
  glass: {
    label: 'Glass',
    co2Factor: 0.3,
  },
  paper: {
    label: 'Paper & Cardboard',
    co2Factor: 0.9,
  },
  ewaste: {
    label: 'E-waste',
    co2Factor: 2.8,
  },
}

function roundToTwo(value) {
  return Math.round(value * 100) / 100
}

exports.calculateWasteImpact = onRequest(
  {
    region: 'australia-southeast2',
    cors: true,
  },
  (request, response) => {
    if (request.method !== 'POST') {
      return response.status(405).json({
        success: false,
        error:
          'Only POST requests are supported.',
      })
    }

    const {
      material,
      weightKg,
    } = request.body || {}

    const materialKey =
      String(material || '')
        .trim()
        .toLowerCase()

    const weight =
      Number(weightKg)

    if (
      !Object.prototype.hasOwnProperty.call(
        MATERIAL_FACTORS,
        materialKey,
      )
    ) {
      return response.status(400).json({
        success: false,
        error:
          'Please select a supported material.',
      })
    }

    if (
      !Number.isFinite(weight) ||
      weight <= 0 ||
      weight > 10000
    ) {
      return response.status(400).json({
        success: false,
        error:
          'Weight must be greater than 0 and no more than 10,000 kg.',
      })
    }

    const materialInfo =
      MATERIAL_FACTORS[materialKey]

    const landfillDivertedKg =
      roundToTwo(weight)

    const estimatedCo2SavedKg =
      roundToTwo(
        weight *
          materialInfo.co2Factor,
      )

    logger.info(
      'Waste impact calculation completed',
      {
        material: materialKey,
        weightKg: weight,
      },
    )

    return response.status(200).json({
      success: true,

      result: {
        material:
          materialInfo.label,

        weightKg:
          roundToTwo(weight),

        landfillDivertedKg,

        estimatedCo2SavedKg,

        processedBy:
          'Firebase Cloud Functions',

        serverTimestamp:
          new Date().toISOString(),

        note:
          'This is an educational demonstration estimate for WasteLess Melbourne.',
      },
    })
  },
)