import { parseReferenceLine, parseEntryLine, parseSensorLine } from '../src'

describe('log-parser', () => {
  describe('parsers', () => {
    it('parses the reference line', () => {
      const line = 'reference 70.0 45.0 6'
      const result = parseReferenceLine(line, 1)
      expect(result).toMatchSnapshot()
    })

    it('errors when parsing the reference line', () => {
      const line = 'reference aa 45.0 6'
      const result = parseReferenceLine(line, 1)
      expect(result).toMatchSnapshot()
    })

    it('parses the sensor line', () => {
      const line = 'thermometer temp-1'
      const result = parseSensorLine(line, 1)
      expect(result).toMatchSnapshot()
    })

    it('errors when parsing the sensor line', () => {
      const line = 'thermometer'
      const result = parseSensorLine(line, 1)
      expect(result).toMatchSnapshot()
    })

    it('parses the entry line', () => {
      const line = '2007-04-05T22:00 72.4'
      const result = parseEntryLine(line, 1)
      expect(result).toMatchSnapshot()
    })

    it('errors when parsing the entry line', () => {
      const line = '2007-04-05T22:00 aab'
      const result = parseEntryLine(line, 1)
      expect(result).toMatchSnapshot()
    })
  })
})
