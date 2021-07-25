export class BadLineFormatError extends Error {
  constructor(line: string, lineNumber: number) {
    const formattedLineNumber = Intl.NumberFormat().format(lineNumber)
    super(`Unexpected or invalid line at ${formattedLineNumber}: [${line}]`)
  }
}
