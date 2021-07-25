import { SensorType } from '@365-widgets/core'
import {
  validateHumiditySensor,
  ReferenceResult,
  validateThermometer,
} from '../src'

describe('log-parser', () => {
  describe('evaluator', () => {
    it('validates the temperature sensor and is "precise"', async () => {
      const reference: ReferenceResult = {
        temperature: 70,
        humidity: 45,
        ppm: 6,
      }

      const result = validateThermometer(reference, {
        sensorType: SensorType.Thermometer,
        min: 61.4,
        max: 79.1,
        sumValue: 905.2,
        totalCount: 13,
      })

      expect(result).toMatchSnapshot()
    })

    it('validates the temperature sensor and is "very precise"', async () => {
      const reference: ReferenceResult = {
        temperature: 70,
        humidity: 45,
        ppm: 6,
      }

      const result = validateThermometer(reference, {
        sensorType: SensorType.Thermometer,
        min: 69.5,
        max: 71.5,
        sumValue: 360,
        totalCount: 5,
      })

      expect(result).toMatchSnapshot()
    })

    it('validates the temperature sensor and is "ultra precise"', async () => {
      const reference: ReferenceResult = {
        temperature: 70,
        humidity: 45,
        ppm: 6,
      }

      const result = validateThermometer(reference, {
        sensorType: SensorType.Thermometer,
        min: 69.5,
        max: 71.5,
        sumValue: 352.2,
        totalCount: 5,
      })

      expect(result).toMatchSnapshot()
    })

    it('validates the humidity sensor and is "keep"', async () => {
      const reference: ReferenceResult = {
        temperature: 70,
        humidity: 45,
        ppm: 6,
      }

      const result = validateHumiditySensor(reference, {
        sensorType: SensorType.Humidity,
        min: 45.1,
        max: 45.3,
        sumValue: 135.6,
        totalCount: 3,
      })

      expect(result).toMatchSnapshot()
    })

    it('validates the humidity sensor and is "discard"', async () => {
      const reference: ReferenceResult = {
        temperature: 70,
        humidity: 45,
        ppm: 6,
      }

      const result = validateHumiditySensor(reference, {
        sensorType: SensorType.Humidity,
        min: 42.1,
        max: 44.9,
        sumValue: 219.1,
        totalCount: 5,
      })

      expect(result).toMatchSnapshot()
    })
  })
})
