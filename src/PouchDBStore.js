class PouchDBStore {
  constructor () {
    this.collection = null
  }

  create (id, doc) {
    return this.collection.upsert(id, () => doc).then(() => doc)
  }

  async get (key) {
    try {
      return await this.collection.get(key)
    } catch (e) {
      return null
    }
  }

  async update (id, doc) {
    let nextDoc
    return this.collection.upsert(id, (currentDoc) => {
      nextDoc = Object.assign({}, currentDoc, doc)
      return nextDoc
    }).then(() => nextDoc)
  }
}

module.exports = PouchDBStore
