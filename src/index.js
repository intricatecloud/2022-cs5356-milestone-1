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

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get } from "http";
import { add } from "nodemon/lib/rules";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJxXWLesj1VNh0PqTXtJGd-FTuSbeCeY8",
  authDomain: "startupsystemsmilestone1.firebaseapp.com",
  projectId: "startupsystemsmilestone1",
  storageBucket: "startupsystemsmilestone1.appspot.com",
  messagingSenderId: "580093202200",
  appId: "1:580093202200:web:8e9ff35abddedd1a16d86d"
};

const { initializeApp } = require('firebase-admin/app');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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

  firebase.initializeApp({
    apiKey: 'AIza…',
    authDomain: '<PROJECT_ID>.firebasepp.com'
  });
  
  // As httpOnly cookies are to be used, do not persist any state client side.
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  
  // When the user signs in with email and password.
  firebase.auth().signInWithEmailAndPassword('user@example.com', 'password').then(user => {
    // Get the user's ID token as it is needed to exchange for a session cookie.
    return user.getIdToken().then(idToken = > {
      // Session login endpoint is queried and the session cookie is set.
      // CSRF protection should be taken into account.
      // ...
      const csrfToken = getCookie('csrfToken')
      return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
    });
  }).then(() => {
    // A page redirect would suffice as the persistence is set to NONE.
    return firebase.auth().signOut();
  }).then(() => {
    window.location.assign('/profile');
  });
  
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session
  // And then return a 200 status code instead of a 501
  
  app.post('/sessionLogin', (req, res) => {
    // Get the ID token passed and the CSRF token.
    const idToken = req.body.idToken.toString();
    const csrfToken = req.body.csrfToken.toString();
    // Guard against CSRF attacks.
    if (csrfToken !== req.cookies.csrfToken) {
      res.status(401).send('UNAUTHORIZED REQUEST!');
      return;
    }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    getAuth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true };
          res.cookie('session', sessionCookie, options);
          res.end(JSON.stringify({ status: 'success' }));
        },
        (error) => {
          res.status(401).send('UNAUTHORIZED REQUEST!');
        }
      );
  });
  
  
  res.status(501).send();
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // CS5356 TODO #5
  // Get the message that was submitted from the request body
  // Get the user object from the request body
    //get.userFeed(feed)
  // Add the message to the userFeed so its associated with the user
  add.userFeed
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
