import { SensorType } from '@365-widgets/core'
import { readLines } from './io'
import { validateSensors } from './validators'
import type { ReferenceResult, QualityLogResult, SensorRead } from './types'

export async function evaluateLogFile(
  logContentsStr: string
): Promise<QualityLogResult> {
  let currReference: ReferenceResult | undefined = undefined
  let currSensorKey: string | undefined = undefined
  let currSensorType: SensorType | undefined = undefined
  const sensors = new Map<string, SensorRead>()
  for await (const [line] of readLines(logContentsStr)) {
    if (line == null) {
      continue
    }

    if (line.payload instanceof Error) {
      throw line.payload
    }

    if (line.type === 'reference') {
      // we scope the reference
      currReference = line.payload
    } else if (line.type === 'sensor') {
      // we scope the sensor
      currSensorKey = line.payload.name
      currSensorType = line.payload.type
    } else if (line.type === 'entry') {
      // we don't include entries if they are not scoped to a sensor
      if (
        currSensorKey == null ||
        currSensorType == null ||
        currReference == null
      ) {
        continue
      }

      const sensor = sensors.get(currSensorKey)
      const sensorType = sensor?.sensorType ?? currSensorType
      const sumValue = (sensor?.sumValue ?? 0) + line.payload
      const totalCount = (sensor?.totalCount ?? 0) + 1
      const min =
        sensor?.min != null ? Math.min(sensor.min, line.payload) : line.payload
      const max =
        sensor?.max != null ? Math.max(sensor.max, line.payload) : line.payload

      sensors.set(currSensorKey, {
        ...sensor,
        sensorType,
        min,
        max,
        sumValue,
        totalCount,
      })
    }
  }

  if (currReference == null) return {}
  return validateSensors(currReference, sensors)
}
