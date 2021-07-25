import type { SensorType } from '@365-widgets/core'
import type { BadLineFormatError } from './error'

export interface GenericSensorSpec {
  readonly threshold: number
}

export interface ThermometerSpec extends GenericSensorSpec {
  readonly deviation: number
}

export type ThermometerSpecConfig = {
  readonly [SensorType.Thermometer]: ThermometerSpec
}

export type HumiditySensorSpecConfig = {
  readonly [SensorType.Humidity]: GenericSensorSpec
}

export type CarbonMonoxideSensorSpecConfig = {
  readonly [SensorType.CarbonMonoxide]: GenericSensorSpec
}

export type SpecConfig =
  | ThermometerSpecConfig
  | HumiditySensorSpecConfig
  | CarbonMonoxideSensorSpecConfig

export type QualityLogResult = Record<string, string>

export interface ReferenceResult {
  /**
   * The control room was held at this constant temperature.
   */
  readonly temperature: number
  /**
   * The control room relative humidity.
   */
  readonly humidity: number
  /**
   * The control room carbon monoxide.
   */
  readonly ppm: number
}

export interface SensorLineResultPayload {
  readonly type: SensorType
  readonly name: string
}

export interface ReferenceLineResult {
  readonly type: 'reference'
  readonly payload: ReferenceResult | BadLineFormatError
}

export interface SensorLineResult {
  readonly type: 'sensor'
  readonly payload: SensorLineResultPayload | BadLineFormatError
}

export interface EntryLineResult {
  readonly type: 'entry'
  readonly payload: number | BadLineFormatError
}

export type LineResult =
  | ReferenceLineResult
  | SensorLineResult
  | EntryLineResult

export interface SensorRead {
  readonly sensorType: SensorType
  readonly max: number
  readonly min: number
  readonly sumValue: number
  readonly totalCount: number
}
