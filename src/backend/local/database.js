import { encrypt, decrypt, deriveKey, verifyMasterKey } from '../utils/encryption'

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

//initalize the database
const dbPath = path.resolve(__dirname, 'localPasswords.db')
const db = new sqlite3.Database(
  'C:/Users/nadua/OneDrive/Desktop/temp/password-manager/src/backend/local/localPasswords.db',
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

// Table Creation
function initializeDatabase() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        master_key TEXT NOT NULL,
        salt TEXT NOT NULL,
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




// USER RELATED OPERATIONS


//add a user to the database
async function addUser(userName, masterKey, firstName = null, lastName = null) {
  console.log('default master key: ', masterKey)
  const {hashedMasterKey, salt} = await deriveKey(masterKey)
  console.log("This is the hashed key: ", hashedMasterKey)
  let timestamp = new Date()
  timestamp = timestamp.toISOString()
  console.log([userName, hashedMasterKey, firstName, lastName, timestamp, timestamp, salt])


  return new Promise((resolve, reject) => {
    const validationQuery =  `SELECT COUNT(*) AS count FROM users WHERE username = ?`
    db.get(validationQuery, [userName], function(err, row){
      if(err){
        reject(err)
      }else{
        if(row.count > 0){
          resolve({success:false, message:"username already exists"})
        }else{
          const query = `
          INSERT INTO users (username, master_key, salt, first_name, last_name, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `
          db.run(
            query,
            [userName, hashedMasterKey, salt, firstName, lastName, timestamp, timestamp],
            function (err) {
              if (err) {
                reject(err)
              } else {
                resolve({success:true, message:"user registration success"})
                console.log(this)
              }
            }
          )
        }
      }
    })
  })
}

// delete user from the database

// update user information from the database(username, firstname, lastname)

// get all users from the database

function getAllUsers(){
  return new Promise((resolve, reject)=>{
    const query = ` SELECT * FROM users;`
    db.all(query, (err, rows)=>{
      if(err){
        reject(err)
      }else{
        resolve(rows)
      }
    })
  })
}

// verify the username with associated masterkey
function verifyUser(user, masterKey){
  const userName = user
  const userMasterKey = masterKey



  return new Promise((resolve, reject) =>{
    const validationQuery =  `SELECT * FROM users WHERE username = ?`
    db.get(validationQuery, userName, (err, row)=>{
      if(err){
        reject(err)
      }else{
        if(row){
          const storedKey = row.master_key
          const storedSalt = row.salt

          const userVerified = verifyMasterKey(userMasterKey, storedSalt, storedKey)
          if(userVerified){
            resolve({success:true, message: "user login success", user:row})
          }else{
            resolve({success:false, message: "Incorrect username or password"})
          }
        }else{
          resolve({success:false, message:"incorrect username or password"})
        }
      }
    })
  })
  

}

// PASSWORD RELATED OPERATIONS

export { addUser, getAllUsers, verifyUser }
