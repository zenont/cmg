import { Readable, Writable } from 'stream'
import { createInterface } from 'readline'
import type { LineResult } from './types'
import { parseLine } from './parsers'

export type YieldedLineTuple = [LineResult | undefined, number, string]

/**
 * Reads a line at a time from a file. Yields a tuple {@link YieldedLineTuple}
 * @param logContentsStr The file contents as a string.
 */
export async function* readLines(
  logContentsStr: string
): AsyncGenerator<YieldedLineTuple, void, unknown> {
  // we use streams to account for big files
  const readStream = Readable.from(logContentsStr)
  const writeStream = new Writable()
  const reader = createInterface({
    input: readStream,
    output: writeStream,
    terminal: false,
  })

  let lineNumber = 0
  for await (const line of reader) {
    lineNumber++
    const parsedLine = parseLine(line, lineNumber)
    yield [parsedLine, lineNumber, line]
  }
}
