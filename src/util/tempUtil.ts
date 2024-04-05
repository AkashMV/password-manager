import crypto from 'crypto';

function generatePassword(): string {
  const bytes = crypto.randomBytes(5);
  const password = bytes.toString('base64').slice(0, 5);
  console.log(password)
  return password
}

export default generatePassword