import fs from 'fs'
import papa from 'papaparse'
import coercions from './coercions'

const PARSE_OPTIONS = {
  skipEmptyLines: true
}

function coerce (row, columns) {
  let column, coerceFn

  for (column of columns) {
    coerceFn = coercions[column.type]
    row[column.key] = coerceFn(row[column.key], column)
  }
}

export default function (path, { delimiter, hasHeader, columns = [] }) {
  return new Promise((resolve, reject) => {
    let rows

    const input = fs.createReadStream(path)
    const options = Object.assign({ delimiter, header: hasHeader }, PARSE_OPTIONS)

    if (columns.length) {
      rows = []

      options.step = ({ data }) => {
        data.forEach(e => coerce(e, columns))
        rows.push(...data)
      }
    }

    options.complete = ({ data }) => {
      if (!rows) {
        rows = data
      }

      resolve(rows)
    }

    options.error = reject

    papa.parse(input, options)
  })
}
