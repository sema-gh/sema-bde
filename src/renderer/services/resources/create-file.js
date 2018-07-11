import nodepath from 'path'
import nanoid from 'nanoid'
import createHash from './create-hash'

const EXTENSION = '.csv'

export default async function (path, ids = []) {
  const file = { path }

  do {
    file.id = nanoid()
  } while (ids.includes(file.id))

  file.name = nodepath.basename(path, EXTENSION)

  try {
    file.hash = await createHash(path)
  } catch (error) {}

  file.consume = {
    hash: null,
    status: null,
    response: null,
    error: null
  }

  return file
}
