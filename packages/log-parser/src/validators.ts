import {
  SensorType,
  ThermometerQuality,
  SensorQuality,
} from '@365-widgets/core'
import {
  HUMIDITY_THRESHOLD,
  MONOXIDE_PPM_THRESHOLD,
  TEMPERATURE_DEGREE_THRESHOLD,
  TEMPERATURE_ULTRA_PRECISE_THRESHOLD,
  TEMPERATURE_VERY_PRECISE_THRESHOLD,
} from './const'
import type { QualityLogResult, SensorRead, ReferenceResult } from './types'

export const validateThermometer = (
  reference: ReferenceResult,
  sensorRead: SensorRead
): ThermometerQuality => {
  const { min, max, sumValue, totalCount } = sensorRead
  const mean = sumValue / totalCount
  const deviation = Math.max(
    Math.abs(reference.temperature - max),
    Math.abs(reference.temperature - min)
  )
  const variance = Math.abs(reference.temperature - mean)

  if (
    variance <= TEMPERATURE_DEGREE_THRESHOLD &&
    deviation < TEMPERATURE_ULTRA_PRECISE_THRESHOLD
  ) {
    return ThermometerQuality.UltraPrecise
  }

  if (
    variance <= TEMPERATURE_DEGREE_THRESHOLD &&
    deviation < TEMPERATURE_VERY_PRECISE_THRESHOLD
  ) {
    return ThermometerQuality.VeryPrecise
  }

  return ThermometerQuality.Precise
}

export const validateHumiditySensor = (
  reference: ReferenceResult,
  sensorRead: SensorRead
): SensorQuality => {
  const { min, max } = sensorRead
  const deviation = Math.max(
    Math.abs(reference.humidity - min),
    Math.abs(reference.humidity - max)
  )

  if (deviation <= HUMIDITY_THRESHOLD) {
    return SensorQuality.Keep
  }

  return SensorQuality.Discard
}

export const validateCarbonMonoxideSensor = (
  reference: ReferenceResult,
  sensorRead: SensorRead
): SensorQuality => {
  const { min, max } = sensorRead
  const deviation = Math.max(
    Math.abs(reference.ppm - max),
    Math.abs(reference.ppm - min)
  )

  if (deviation <= MONOXIDE_PPM_THRESHOLD) {
    return SensorQuality.Keep
  }

  return SensorQuality.Discard
}

export const validateSensors = (
  reference: ReferenceResult,
  sensors: Map<string, SensorRead>
): QualityLogResult => {
  const result: QualityLogResult = {}
  for (const [key, sensorRead] of sensors.entries()) {
    switch (sensorRead.sensorType) {
      case SensorType.Thermometer: {
        result[key] = validateThermometer(reference, sensorRead)
        break
      }

      case SensorType.Humidity: {
        result[key] = validateHumiditySensor(reference, sensorRead)
        break
      }

      case SensorType.CarbonMonoxide: {
        result[key] = validateCarbonMonoxideSensor(reference, sensorRead)
        break
      }
    }
  }

  return result
}
