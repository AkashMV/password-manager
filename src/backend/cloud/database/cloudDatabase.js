import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

const URI = `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect(URI)
      .then((conn) => {
        console.log("Mongo DB --host", conn.connection.host);
        resolve({ success: true, message: "Connection Established Successfully" });
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB Atlas");
        reject({ success: false, message: "Connection failed" });
      });
  });
}

export { connectToDatabase };