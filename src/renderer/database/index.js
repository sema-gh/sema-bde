import path from 'path'
import PouchDB from 'pouchdb'
import storage from '@/storage'

PouchDB.plugin(
  require('pouchdb-adapter-memory')
)

export default new PouchDB({
  name: path.join(
    require('electron').remote.app.getPath('userData'),
    'AppDatabase'
  ),
  adapter: storage.get('isDatabasePersistent') ? 'leveldb' : 'memory',
  auto_compaction: true
})
