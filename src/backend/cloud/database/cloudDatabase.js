import mongoose from "mongoose";

const URI = 'mongodb+srv://sahasrasva01:qbbbv7KuVcDbjZCk@cluster0.9esfqmk.mongodb.net/password-manager?retryWrites=true&w=majority';

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