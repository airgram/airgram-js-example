require('reflect-metadata')

const inversify = require('inversify')
const {Airgram, AuthDialog, TYPES} = require('airgram')
const {prompt, getCalleeName} = require('airgram/helpers')
const {DebugLogger} = require('airgram-debug')
const {createCollection} = require('./pouchdb')
const PouchDBStore = require('./PouchDBStore')

const airgram = new Airgram({id: process.env.APP_ID, hash: process.env.APP_HASH})

// Logger
airgram.bind(TYPES.Logger).to(DebugLogger).onActivation((context, logger) => {
  logger.namespace = [getCalleeName(context)]
  logger.level = 'verbose'
  return logger
})

// Mount PouchDB store
const collection = createCollection('airgram')

function mountCollection (context, store) {
  store.collection = collection
  return store
}

inversify.decorate(inversify.injectable(), PouchDBStore)
airgram.bind(TYPES.AuthStore).to(PouchDBStore).onActivation(mountCollection)
airgram.bind(TYPES.MtpStateStore).to(PouchDBStore).onActivation(mountCollection)

// Authorization
airgram.use(airgram.auth)

airgram.auth.use(new AuthDialog({
  samePhoneNumber: () => false,
  phoneNumber: () => process.env.PHONE_NUMBER || prompt(`Please enter your phone number:\n`),
  code: () => prompt(`Please enter the secret code:\n`)
}))

// Updates
airgram.use(airgram.updates)

airgram.updates.use(({update}, next) => {
  console.log(`"${update._}" ${JSON.stringify(update)}`)
  return next()
})

airgram.auth.login().then(async () => {
  // Start long polling
  await airgram.updates.startPolling()

  // Get dialogs list
  const dialogs = await airgram.client.messages.getDialogs({
    limit: 30,
    offset_date: 0,
    offset_id: 0,
    offset_peer: {_: 'inputPeerEmpty'}
  })

  console.log(dialogs)
})
