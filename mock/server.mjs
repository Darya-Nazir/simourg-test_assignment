import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'

import { App } from '@tinyhttp/app'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { createApp } from 'json-server/lib/app.js'
import { json } from 'milliparsec'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 5
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ALLOWED_STATUSES = new Set(['active', 'inactive'])

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const toSearchWhere = (search) => ({
  or: [{ name: { contains: search } }, { email: { contains: search } }],
})

const normalizeText = (value) => String(value ?? '').trim()

const normalizeEmail = (value) => normalizeText(value).toLowerCase()
const createId = () => randomBytes(2).toString('hex')

const validateUserPayload = (payload, { isPatch }) => {
  const name = normalizeText(payload.name)
  const email = normalizeText(payload.email)
  const status = normalizeText(payload.status)

  if (!isPatch || 'name' in payload) {
    if (!name) {
      return 'Full name is required.'
    }
  }

  if (!isPatch || 'email' in payload) {
    if (!email) {
      return 'Email is required.'
    }

    if (!EMAIL_REGEX.test(email)) {
      return 'Email format is invalid.'
    }
  }

  if (!isPatch || 'status' in payload) {
    if (!ALLOWED_STATUSES.has(status)) {
      return 'Status is required and must be active or inactive.'
    }
  }

  return null
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.json')

const db = new Low(new JSONFile(dbPath), {})
await db.read()
db.data ||= { health: { status: 'ok' }, users: [] }

const jsonServerApp = createApp(db, { logger: false })
const app = new App()
app.use(json())

app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    next?.()
    return
  }

  const url = new URL(req.url, 'http://localhost')
  const isUsersCollection = req.method === 'POST' && url.pathname === '/users'
  const isUserItem = req.method === 'PATCH' && /^\/users\/[^/]+$/.test(url.pathname)

  if (!isUsersCollection && !isUserItem) {
    next?.()
    return
  }

  const payload = typeof req.body === 'object' && req.body !== null ? req.body : {}
  const isPatch = req.method === 'PATCH'
  const validationError = validateUserPayload(payload, { isPatch })

  if (validationError) {
    res.status(400).json({ message: validationError })
    return
  }

  const currentUserId = isUserItem ? url.pathname.split('/').pop() : null
  const normalizedEmail = normalizeEmail(payload.email)
  const hasDuplicateEmail = db.data.users.some((user) => {
    if (currentUserId !== null && String(user.id) === String(currentUserId)) {
      return false
    }

    return normalizeEmail(user.email) === normalizedEmail
  })

  if (hasDuplicateEmail) {
    res.status(409).json({ message: 'User with this email already exists.' })
    return
  }

  const sanitizedPayload = {
    ...payload,
    ...(typeof payload.name === 'string' ? { name: normalizeText(payload.name) } : {}),
    ...(typeof payload.email === 'string' ? { email: normalizeText(payload.email) } : {}),
    ...(typeof payload.status === 'string' ? { status: normalizeText(payload.status) } : {}),
    ...(req.method === 'POST' && !payload.createdAt ? { createdAt: new Date().toISOString() } : {}),
  }

  if (isUsersCollection) {
    const createdUser = {
      id: createId(),
      ...sanitizedPayload,
    }

    db.data.users.push(createdUser)
    db.write().then(() => {
      res.status(201).json(createdUser)
    })
    return
  }

  const currentUser = db.data.users.find((user) => String(user.id) === String(currentUserId))

  if (!currentUser) {
    res.sendStatus(404)
    return
  }

  const updatedUser = {
    ...currentUser,
    ...sanitizedPayload,
    id: currentUser.id,
  }

  const index = db.data.users.indexOf(currentUser)
  db.data.users.splice(index, 1, updatedUser)
  db.write().then(() => {
    res.status(200).json(updatedUser)
  })
})

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
