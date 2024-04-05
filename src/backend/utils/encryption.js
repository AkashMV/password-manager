
const crypto = require('crypto')

const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16
const KEY_LENGTH = 32
const ITERATIONS = 100000

// for converting the masterkey which can be of any size to 32bit for encryption
function deriveKey(master_key){
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedMasterKey = crypto.pbkdf2Sync(master_key, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
    return {hashedMasterKey, salt}
}

function verifyMasterKey(masterKey, salt, storedKey){
    const hashedMasterKey = crypto.pbkdf2Sync(masterKey, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex')
    const verificationResult = hashedMasterKey == storedKey
    return verificationResult
}
// function for encrypting the passwords using the masterkey as the key
function encrypt(text, masterKey){
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}


// function to decrypt the passwords using the masterkey as the key
const decrypt = (text, masterKey) => {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    console.log(iv, encryptedText)
    const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}



export {encrypt, decrypt, deriveKey, verifyMasterKey}