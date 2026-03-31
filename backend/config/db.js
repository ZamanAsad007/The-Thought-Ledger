const mongoose = require('mongoose')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const connectDB = async () => {
  const srvUri = process.env.MONGO_URI
  const directUri = process.env.MONGO_URI_DIRECT

  if (!srvUri && !directUri) {
    console.error('DB Connection Failed: missing MONGO_URI in .env')
    process.exit(1)
  }

  const attempts = Number(process.env.MONGO_CONNECT_ATTEMPTS ?? 3)
  const delayMs = Number(process.env.MONGO_CONNECT_DELAY_MS ?? 1500)

  const candidates = []
  if (srvUri) candidates.push({ uri: srvUri, label: 'MONGO_URI' })
  if (directUri) candidates.push({ uri: directUri, label: 'MONGO_URI_DIRECT' })

  let lastError

  for (const candidate of candidates) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        await mongoose.connect(candidate.uri, {
          serverSelectionTimeoutMS: 8000,
        })
        console.log(`MongoDB Connected! (${candidate.label})`)
        return
      } catch (error) {
        lastError = error
        console.error(
          `DB Connection Failed (${candidate.label}) [${attempt}/${attempts}]: ${error.message}`,
        )
        if (attempt < attempts) await sleep(delayMs)
      }
    }
  }

  console.error('Last Mongo error:', lastError)
  process.exit(1)
}

module.exports = connectDB