import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const dbPath = process.env.DB_SQLITE_PATH || path.join(process.cwd(), 'english-learning.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const initSQL = fs.readFileSync(path.join(__dirname, '../db/init.sqlite.sql'), 'utf-8')
db.exec(initSQL)

console.log(`Connected to SQLite: ${dbPath}`)

// Convert PostgreSQL $1,$2 placeholders to SQLite ?
function convertSQL(sql) {
  return sql.replace(/\$\d+/g, '?')
}

function query(sql, params = []) {
  const converted = convertSQL(sql)
  const returningMatch = converted.match(/\s+RETURNING\s+(\w+)\s*$/i)

  if (returningMatch) {
    const col = returningMatch[1]
    const cleanSQL = converted.replace(/\s+RETURNING\s+\w+\s*$/i, '')
    const result = db.prepare(cleanSQL).run(...params)
    return Promise.resolve({ rows: [{ [col]: result.lastInsertRowid }] })
  }

  if (/^\s*SELECT/i.test(sql)) {
    const rows = db.prepare(converted).all(...params)
    return Promise.resolve({ rows })
  }

  db.prepare(converted).run(...params)
  return Promise.resolve({ rows: [] })
}

function connect() {
  return Promise.resolve({
    query(sql, params = []) {
      const upper = sql.trim().toUpperCase()
      if (upper === 'BEGIN') { db.exec('BEGIN'); return Promise.resolve({ rows: [] }) }
      if (upper === 'COMMIT') { db.exec('COMMIT'); return Promise.resolve({ rows: [] }) }
      if (upper === 'ROLLBACK') { db.exec('ROLLBACK'); return Promise.resolve({ rows: [] }) }
      return query(sql, params)
    },
    release() {},
  })
}

export default { query, connect }
