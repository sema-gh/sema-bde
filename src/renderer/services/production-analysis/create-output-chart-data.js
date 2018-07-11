import moment from 'moment'
import { chunk } from 'lodash'

const BATCH_SIZE = 500

function immediate (fn) {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      fn()
      resolve()
    })
  })
}

export default async function (docs, { dateRange, group }) {
  const dataProvider = []
  const dataItemIndices = {}

  const timestamps = moment.twix(...dateRange)
    .toArray(group)
    .map(e => e.startOf(group).toISOString())

  timestamps.forEach((e, index) => {
    dataProvider.push({ timestamp: e })
    dataItemIndices[e] = index
  })

  const batches = chunk(docs, BATCH_SIZE)

  let batch, doc, dataItemIndex, dataItem
  const graphIndex = 0

  for (batch of batches) {
    await immediate(() => {
      for (doc of batch) {
        dataItemIndex = dataItemIndices[moment(doc.timestamp).startOf(group).toISOString()]
        dataItem = dataProvider[dataItemIndex]

        if (dataItem.hasOwnProperty(graphIndex)) {
          dataItem[graphIndex] += doc.value
        } else {
          dataItem[graphIndex] = doc.value
        }
      }
    })
  }

  return dataProvider
}
