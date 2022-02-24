const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080; //he erased in class everything before the number 8080
const adminAuth = require("firebase-admin/auth");

// CS5356 TODO #2
// Import the functions you need from the SDKs you need
/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNpUurMvCXH8NLorFcD_mbvKfsoNw4Uck",
  authDomain: "matchdog-f1cab.firebaseapp.com",
  projectId: "matchdog-f1cab",
  storageBucket: "matchdog-f1cab.appspot.com",
  messagingSenderId: "1035454255329",
  appId: "1:1035454255329:web:222061707083248ad9e7a0",
  measurementId: "G-S20Z5VERXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/
/*
import { initializeApp } from 'firebase/app';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDNpUurMvCXH8NLorFcD_mbvKfsoNw4Uck",
    authDomain: "matchdog-f1cab.firebaseapp.com",
    projectId: "matchdog-f1cab",
    storageBucket: "matchdog-f1cab.appspot.com",
    messagingSenderId: "1035454255329",
    appId: "1:1035454255329:web:222061707083248ad9e7a0",
    measurementId: "G-S20Z5VERXV"
  })
*/
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
app.set("views", path.join(__dirname, "views"));  // this is defined when we set up our EJS server - they are commonly called request paths / enpoints/ routes

app.use("/static", express.static("static/"));

// use res.render to load up an ejs view file
// index page
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/sign-in", function (req, res) {
  res.render("pages/sign-in");
});

app.get("/sign-up", function (req, res) {
  res.render("pages/sign-up");
});

app.get("/dashboard", authMiddleware, async function (req, res) {
  const feed = await userFeed.get();
  res.render("pages/dashboard", { user: req.user, feed });
});

app.post("/sessionLogin", async (req, res) => {
  // CS5356 TODO #4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  //res.status(501).send();
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const options = { maxAge: expiresIn, httpOnly: true, secure: true }

  adminAuth.getAuth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {
        res.status(401).send('Unauthorized request!');
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
  const message = req.body.message;
  const user = req.user;
  await userFeed.add(user, message);
  return res.redirect("/dashboard");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
