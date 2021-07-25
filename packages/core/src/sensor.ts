export enum ThermometerQuality {
  UltraPrecise = 'ultra precise',
  VeryPrecise = 'very precise',
  Precise = 'precise',
}

export enum SensorQuality {
  Keep = 'keep',
  Discard = 'discard',
}

export enum SensorType {
  Thermometer = 'thermometer',
  Humidity = 'humidity',
  CarbonMonoxide = 'monoxide',
}

export const isSensorType = (value: unknown): value is SensorType =>
  value === SensorType.Thermometer ||
  value === SensorType.Humidity ||
  value === SensorType.CarbonMonoxide
