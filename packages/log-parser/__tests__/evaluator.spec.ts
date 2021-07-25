import path from 'path'
import fs from 'fs'
import { evaluateLogFile, BadLineFormatError } from '../src'

describe('log-parser', () => {
  describe('evaluator', () => {
    it('evaluates the log file', async () => {
      const filePath = path.join(__dirname, './', 'sample.log')
      const logContentsStr = fs.readFileSync(filePath, 'utf8')
      const result = await evaluateLogFile(logContentsStr)
      expect(result).toMatchSnapshot()
      expect(result['temp-1']).toBe('precise')
      expect(result['temp-2']).toBe('ultra precise')
      expect(result['hum-1']).toBe('keep')
      expect(result['hum-2']).toBe('discard')
      expect(result['mon-1']).toBe('keep')
      expect(result['mon-2']).toBe('discard')
    })

    it('throws if the log file is missing a reference line', async () => {
      const filePath = path.join(__dirname, './', 'bad_sample.log')
      const logContentsStr = fs.readFileSync(filePath, 'utf8')

      await expect(evaluateLogFile(logContentsStr)).rejects.toThrowError(
        BadLineFormatError
      )
    })
  })
})
