import { isSensorType } from '@365-widgets/core'
import { BadLineFormatError } from './error'
import type {
  ReferenceLineResult,
  SensorLineResult,
  EntryLineResult,
  LineResult,
} from './types'
import { splitLine } from './util'

export const parseReferenceLine = (
  line: string,
  lineNumber: number
): ReferenceLineResult | undefined => {
  const [lineType, ...rest] = splitLine(line)

  if (lineType !== 'reference') {
    return undefined
  }

  const parsedSpec = rest
    .map((x) => Number.parseFloat(x))
    .filter((x) => !Number.isNaN(x))

  const [temperature, humidity, ppm] = parsedSpec
  return {
    type: 'reference',
    payload:
      parsedSpec.length !== 3
        ? new BadLineFormatError(line, lineNumber)
        : {
            temperature,
            humidity,
            ppm,
          },
  }
}

export const parseSensorLine = (
  line: string,
  lineNumber: number
): SensorLineResult | undefined => {
  const [lineType, ...rest] = splitLine(line)

  if (!isSensorType(lineType)) {
    return undefined
  }

  return {
    type: 'sensor',
    payload:
      rest[0] == null || rest[0].trim() === ''
        ? new BadLineFormatError(line, lineNumber)
        : { type: lineType, name: rest[0] },
  }
}

export const parseEntryLine = (
  line: string,
  lineNumber: number
): EntryLineResult | undefined => {
  const [, strValue] = splitLine(line)
  const value = Number.parseFloat(strValue)

  return {
    type: 'entry',
    payload: Number.isNaN(value)
      ? new BadLineFormatError(line, lineNumber)
      : value,
  }
}

/**
 * Parses a line of text from the log file. Validates it in the process to handle malformed or out of spec log files.
 * @param line The log file line.
 * @param lineNumber The log file number.
 * @returns Returns a {@link LineResult} if parsed correctly, or *undefined* if a valid line could not be parsed.
 */
export const parseLine = (
  line: string,
  lineNumber: number
): LineResult | undefined => {
  if (line == null || line.trim() === '') {
    return undefined
  }

  const tuple =
    parseReferenceLine(line, lineNumber) ??
    parseSensorLine(line, lineNumber) ??
    parseEntryLine(line, lineNumber)

  return tuple
}
