import { encrypt, decrypt, } from '../../utils/encryption'
import { Password } from '../model/Password';
import mongoose from "mongoose"


async function createCloudPasswordByUserId(passwordObject) {
    try {
      const userId = passwordObject.userId
      const service = passwordObject.service
      const userName = passwordObject.username
      const password = passwordObject.password
      const newPassword = new Password({
        userId:userId,
        service:service,
        username: userName,
        password: password
      });
      console.log(newPassword)
      await newPassword.save();
      console.log('Password stored in the cloud database');
    } catch (error) {
      console.error('Error storing password in the cloud database:', error);
      throw error;
    }
  }
  
  async function getCloudPasswords(cloudId) {

    try {
      const passwords = await Password.find({ userId:cloudId });
      return passwords;
    } catch (error) {
      console.error('Error retrieving passwords from the cloud database:', error);
      throw error;
    }
  }

export {getCloudPasswords, createCloudPasswordByUserId}