const { Airgram, Auth, prompt, toObject } = require('airgram')

const airgram = new Airgram({
  apiId: process.env.APP_ID,
  apiHash: process.env.APP_HASH,
  command: process.env.TDLIB_COMMAND,
  logVerbosityLevel: 1
})

airgram.use(new Auth({
  code: () => prompt('Please enter the secret code:\n'),
  phoneNumber: () => prompt('Please enter your phone number:\n')
}))

void (async function () {
  const me = toObject(await airgram.api.getMe())
  console.log('[Me] ', me)

  const { response: chats } = await airgram.api.getChats({
    limit: 10,
    offsetChatId: 0,
    offsetOrder: '9223372036854775807'
  })
  console.log('[My chats] ', chats)
})()

// Getting all updates
airgram.use((ctx, next) => {
  if ('update' in ctx) {
    // console.log(`[all updates][${ctx._}]`, JSON.stringify(ctx.update))
  }
  return next()
})

// Getting new messages
airgram.on('updateNewMessage', async ({ update }) => {
  const { message } = update
  console.log('[new message]', message)
})
