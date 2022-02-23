const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;

// CS5356 TODO #2

const firebaseConfig = {
  apiKey: "AIzaSyD69u8jHOoTE0-FEH8j_oExo1QnhcjVAmY",
  authDomain: "milestone-1-360bd.firebaseapp.com",
  projectId: "milestone-1-360bd",
  storageBucket: "milestone-1-360bd.appspot.com",
  messagingSenderId: "230171200710",
  appId: "1:230171200710:web:80b98a0a2dd41171bd1bc7",
  measurementId: "G-XW9D8X19H5"
};

// Uncomment this next line after you've created
// serviceAccountKey.json
const serviceAccount = require("./serviceAccountKey.json");
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
app.use(express.json())
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
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  const idToken = req.body.idToken;
  const expiresIn = 60 * 60 * 1000;
  admin.auth().createSessionCookie(idToken, { expiresIn })
  .then(
    (sessionCookie) => {
      const options = { maxAge: expiresIn, httpOnly: true, secure: true };
      res.cookie('session', sessionCookie, options);
      // res.redirect('/dashboard')
      res.status(200).send(JSON.stringify({ status: 'success '}));
    },
    (error) => {
      debugger
      res.status(400).send(error.toString());
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
try {
  const dogMessage = req.body;

  await userFeed.add(req.user, dogMessage.message);
  res.redirect('/dashboard');
} catch (err) {
  res.status(500).send({ message: err });
}
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
