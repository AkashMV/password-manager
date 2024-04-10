import { encrypt, decrypt, } from '../../utils/encryption'
import { Password } from '../model/Password';

async function storePassword(userId, password) {
    try {
      const encryptedPassword = encrypt(password); // Implement password encryption
      const newPassword = new Password({
        userId,
        ...encryptedPassword,
      });
      await newPassword.save();
      console.log('Password stored in the cloud database');
    } catch (error) {
      console.error('Error storing password in the cloud database:', error);
      throw error;
    }
  }
  
  async function getPasswords(userId) {
    try {
      const passwords = await Password.find({ userId });
      const decryptedPasswords = passwords.map((password) => decrypt(password)); // Implement password decryption
      return decryptedPasswords;
    } catch (error) {
      console.error('Error retrieving passwords from the cloud database:', error);
      throw error;
    }
  }

export {getPasswords, storePassword}