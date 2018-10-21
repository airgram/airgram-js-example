class PouchDBStore {
  constructor () {
    this.collection = null
  }

  async delete (id) {
    try {
      await this.collection.remove(id)
    } catch (e) {
      throw e
    }
  }

  async get (key, field) {
    try {
      const value = await this.collection.get(key)
      return field ? value[field] : value
    } catch (e) {
      return null
    }
  }

  async set (id, doc) {
    let nextDoc
    return this.collection.upsert(id, (currentDoc) => {
      nextDoc = Object.assign({}, currentDoc, doc)
      return nextDoc
    }).then(() => nextDoc)
  }
}

module.exports = PouchDBStore
