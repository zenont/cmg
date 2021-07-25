import path from 'path'
import fs from 'fs'
import { readLines } from '../src'

describe('log-parser', () => {
  describe('io', () => {
    it('reads the file lines', async () => {
      const filePath = path.join(__dirname, './', 'sample.log')
      const logContentsStr = fs.readFileSync(filePath, 'utf8')
      const arr = []

      for await (const line of readLines(logContentsStr)) {
        arr.push(line)
      }

      expect(arr).toMatchSnapshot()
    })
  })
})
