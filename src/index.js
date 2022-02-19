// Import the functions you need from the SDKs you need
// import firebase from 'firebase/compat/app';
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC-PTJnNJneTbtgJSo8A2gFt5XIx1J6BdA",
//   authDomain: "ruffhouse-f536e.firebaseapp.com",
//   projectId: "ruffhouse-f536e",
//   storageBucket: "ruffhouse-f536e.appspot.com",
//   messagingSenderId: "448119311869",
//   appId: "1:448119311869:web:faceb106f6a09239fadd94",
//   measurementId: "G-FYRL4N2MGQ"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;

// CS5356 TODO #2
// Uncomment this next line after you've created
// serviceAccountKey.json
const serviceAccount = require("./../config/serviceAccountKey.json");
const userFeed = require("./app/user-feed");
const authMiddleware = require("./app/auth-middleware");

// CS5356 TODO #2
// Uncomment this next block after you've created serviceAccountKey.json
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// use cookies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static("static/"));

// use res.render to load up an ejs view file
// index page
app.get("/", function(req, res) {
  res.render("pages/index");
});

app.get("/sign-in", function(req, res) {
  res.render("pages/sign-in");
});

app.get("/sign-up", function(req, res) {
  res.render("pages/sign-up");
});

app.get("/dashboard", authMiddleware, async function(req, res) {
  const feed = await userFeed.get();
  res.render("pages/dashboard", {
    user: req.user,
    feed
  });
});

app.post("/sessionLogin", async (req, res) => {
  // CS5356 TODO #4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  console.log("body", req.body)
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin.auth().createSessionCookie(idToken, {
      expiresIn
    })
    .then(
      (sessionCookie) => {
        // Set cookie policy for sescssion cookie.
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true
        };
        res.cookie('session', sessionCookie, options);
        res.status(200).send(JSON.stringify({
          status: 'success'
        }));
      },
      (error) => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );

});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // CS5356 TODO #5
  // Get the message that was submitted from the request body
  // Get the user object from the request body
  // Add the message to the userFeed so its associated with the user
  // console.log("dog messages!!!")
  const message = req.body.message
  const user = req.user
  await userFeed.add(user, message)
  const feed = await userFeed.get();
  res.render("pages/dashboard", {
    user: req.user,
    feed
  });
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
