const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;

// CS5356 TODO #2
<<<<<<< HEAD
// Uncomment this next line after you've created
// serviceAccountKey.json
// const serviceAccount = require("./../config/serviceAccountKey.json");
=======
// from firebase config page
const firebaseConfig = {
  apiKey: "AIzaSyCXO0jxl4E2ZOcOQRHMYtbG1wcnLwzdwTU",
  authDomain: "cs5356-milestone1.firebaseapp.com",
  projectId: "cs5356-milestone1",
  storageBucket: "cs5356-milestone1.appspot.com",
  messagingSenderId: "775437841855",
  appId: "1:775437841855:web:bb3561eeb28aff70695d0a"
};

// Uncomment this next line after you've created
// serviceAccountKey.json
const serviceAccount = require("./../config/serviceAccountKey.json");
>>>>>>> df08b9b (Commit milestone 1)
const userFeed = require("./app/user-feed");
const authMiddleware = require("./app/auth-middleware");

// CS5356 TODO #2
// Uncomment this next block after you've created serviceAccountKey.json
<<<<<<< HEAD
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
=======
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
>>>>>>> df08b9b (Commit milestone 1)

// use cookies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
<<<<<<< HEAD
=======

>>>>>>> df08b9b (Commit milestone 1)
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
<<<<<<< HEAD
  // CS5356 TODO #4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  res.status(501).send();
=======

  // CS5356 TODO #4
  // Get the ID token from the request body
  const idToken = req.body.idToken.toString();

  // Set session expiration to 1 day
  const expiresIn = 60 * 60 * 24 * 1000;
  
  // Create a session cookie using the Firebase Admin SDK
  admin.auth()
  .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
      const options = { maxAge: expiresIn, httpOnly: true, secure: true };

      // Set that cookie with the name 'session'
      res.cookie('session', sessionCookie, options);

     // And then return a 200 status code instead of a 501
      res.status(201).send(JSON.stringify({ status: 'success' }));

      },

      (error) => {
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );
>>>>>>> df08b9b (Commit milestone 1)
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // CS5356 TODO #5
  // Get the message that was submitted from the request body
<<<<<<< HEAD
  // Get the user object from the request body
  // Add the message to the userFeed so its associated with the user
=======
  const message = req.body.message.toString();

  // Get the user object from the request body
  const user = req.user;

  // Add the message to the userFeed so its associated with the user
  userFeed.add(user, message);

  // Reload /dashboard
  res.redirect("/dashboard");
>>>>>>> df08b9b (Commit milestone 1)
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
