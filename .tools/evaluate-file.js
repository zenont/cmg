const path = require('path')
const fs = require('fs')
const { evaluateLogFile } = require('../packages/log-parser/main')

const main = async () => {
    const filePath = path.join(__dirname, './', 'sample.log')
    const logContentsStr = fs.readFileSync(filePath, 'utf8')
    const result = await evaluateLogFile(logContentsStr)
    console.info('print result', result)
}

main().then(() => console.info('completed evaluation of log file')).catch(err => console.error(err))