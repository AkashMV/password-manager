import { time } from 'console'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

//initalize the database
const dbPath = path.resolve(__dirname, 'localPasswords.db')
const db = new sqlite3.Database(
  'C:/Users/nadua/OneDrive/Desktop/temp/electron-app/src/backend/local/localPasswords.db',
  sqlite3.OPEN_READWRITE + sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error('error connecting to the database', err.message)
    } else {
      console.log('Database connection established')
      initializeDatabase()
    }
  }
)

//create the tables
function initializeDatabase() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        master_key TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`
    )

    db.run(
      `CREATE TABLE IF NOT EXISTS passwords(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service TEXT NOT NULL,
        user_name TEXT NOT NULL,
        password TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    )
  })
}

//add a user to the database

async function addUser(userName, firstName = null, lastName = null, masterKey) {
  const hashedMasterKey = masterKey
  let timestamp = new Date()
  timestamp = timestamp.toISOString()
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, master_key, first_name, last_name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    db.run(
      query,
      [userName, hashedMasterKey, firstName, lastName, timestamp, timestamp],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      }
    )
  })
}

export { addUser }
