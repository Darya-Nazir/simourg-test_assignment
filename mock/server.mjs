import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { App } from '@tinyhttp/app'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { createApp } from 'json-server/lib/app.js'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 5

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const toSearchWhere = (search) => ({
  or: [{ name: { contains: search } }, { email: { contains: search } }],
})

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.json')

const db = new Low(new JSONFile(dbPath), {})
await db.read()
db.data ||= { health: { status: 'ok' }, users: [] }

const jsonServerApp = createApp(db, { logger: false })
const app = new App()

app.use((req, _res, next) => {
  if (req.method !== 'GET') {
    next?.()
    return
  }

  const url = new URL(req.url, 'http://localhost')

  if (url.pathname !== '/users') {
    next?.()
    return
  }

  const page = parsePositiveInt(url.searchParams.get('page'), DEFAULT_PAGE)
  const limit = parsePositiveInt(url.searchParams.get('limit'), DEFAULT_LIMIT)
  const search = (url.searchParams.get('search') ?? '').trim()

  url.searchParams.delete('page')
  url.searchParams.delete('limit')
  url.searchParams.delete('search')

  url.searchParams.set('_page', String(page))
  url.searchParams.set('_per_page', String(limit))

  if (search) {
    url.searchParams.set('_where', JSON.stringify(toSearchWhere(search)))
  }

  req.url = `${url.pathname}?${url.searchParams.toString()}`
  next?.()
})

app.use(jsonServerApp)

const host = process.env.HOST ?? '127.0.0.1'
const port = Number.parseInt(process.env.PORT ?? '3001', 10)

app.listen(port, host, () => {
  console.log(`Mock API running at http://${host}:${port}`)
})
