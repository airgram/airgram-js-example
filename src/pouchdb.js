const PouchDB = require('pouchdb')
const UpsertPlugin = require('pouchdb-upsert')
const path = require('path')

PouchDB.plugin(UpsertPlugin)

module.exports = PouchDB
module.exports.createCollection = (name) => new PouchDB(path.join(__dirname, `../data/${name}`))
