import mm from 'micromatch'
import { chunk } from 'lodash'
import parse from './parse'
import models from '@/models'

const BATCH_SIZE = 500

function partitionByModel (rows, contents) {
  const partitionedRows = contents.reduce((obj, e) => {
    obj[e.model] = []
    return obj
  }, {})

  let row, content

  for (row of rows) {
    content = contents.find(e => mm.isMatch(row[e.test.key], e.test.pattern))

    if (content) {
      partitionedRows[content.model].push(row)
    }
  }

  return partitionedRows
}

export default async function ({ path, config }) {
  const rows = await parse(path, config)
  const partitionedRows = partitionByModel(rows, config.contents)

  const compoundResponse = []
  let key, content, batches, batch, response

  for (key of Object.keys(partitionedRows)) {
    content = config.contents.find(e => e.model === key)
    batches = chunk(partitionedRows[key], BATCH_SIZE)

    for (batch of batches) {
      response = await models[key].batchCreate(batch, content)
      compoundResponse.push(...response)
    }
  }

  return compoundResponse
}
