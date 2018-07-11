import fs from 'fs'
import crypto from 'crypto'

const ALGORITHM = 'sha256'
const ENCODING = 'hex'

export default function (path) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(path)
    const hash = crypto.createHash(ALGORITHM)

    input.on('data', chunk => hash.update(chunk))

    input.on('end', () => {
      resolve(
        hash.digest(ENCODING)
      )
    })

    input.on('error', reject)
  })
}
