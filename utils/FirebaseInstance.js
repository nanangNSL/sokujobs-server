const admin = require("firebase-admin");
const credentials = require("./Credentials.json");

const firebaseInstance = admin.initializeApp({
  credential: admin.credential.cert(credentials),
  storageBucket: "bytecode-project.appspot.com",
});

module.exports = firebaseInstance;
