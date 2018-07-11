import Ajv from 'ajv'
import database from '@/database'

const TYPE = 'ready.time'
const BATCH_SIZE = 2500

const SCHEMA = {
  properties: {
    name: {
      type: 'string'
    },
    value: {
      type: 'integer',
      minimum: 0
    },
    timestamp: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$'
    }
  },
  required: ['name', 'value', 'timestamp']
}

const isValid = new Ajv().compile(SCHEMA)
const createID = doc => `${doc.type}/${doc.timestamp}/${doc.name}`

export default {
  async create (obj, { template, options = { isUpsert: false } } = {}) {
    let doc

    if (template) {
      doc = {}
      Object.entries(template).forEach(([to, from]) => { doc[to] = obj[from] })
    } else {
      doc = obj
    }

    if (isValid(doc)) {
      doc.type = TYPE
      doc.createdAt = new Date().toISOString()

      doc._id = createID(doc)

      let response

      try {
        response = await database.put(doc)
      } catch (err) {
        if (options.isUpsert && err.name === 'conflict') {
          doc._rev = (await database.get(doc._id))._rev
          response = await database.put(doc)
        } else {
          response = err
        }
      }

      return response
    }
  },

  async batchCreate (objs, { template, options = { isUpsert: false } } = {}) {
    const docs = []

    for (let obj of objs) {
      let doc

      if (template) {
        doc = {}
        Object.entries(template).forEach(([to, from]) => { doc[to] = obj[from] })
      } else {
        doc = obj
      }

      if (isValid(doc)) {
        doc.type = TYPE
        doc.createdAt = new Date().toISOString()

        doc._id = createID(doc)

        if (options.isUpsert) {
          try {
            doc._rev = (await database.get(doc._id))._rev
          } catch (err) {}
        }

        docs.push(doc)
      }
    }

    return database.bulkDocs(docs)
  },

  async getByTimestampRange (start, end) {
    const options = {
      include_docs: true,
      startkey: TYPE + '/' + start,
      endkey: TYPE + '/' + end + '\ufff0',
      limit: BATCH_SIZE + 1
    }

    const docs = []

    let response

    do {
      response = await database.allDocs(options)

      docs.push(
        ...response.rows.slice(0, BATCH_SIZE).map(e => e.doc)
      )

      if (response.rows.length) {
        options.startkey = response.rows.slice(-1)[0].id
      }
    } while (response.rows.length === options.limit)

    return docs
  }
}
