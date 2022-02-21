const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const adminAuth = require("firebase-admin/auth");
const app = express();
const port = process.env.PORT || 8080;

// CS5356 TODO #2
// Uncomment this next line after you've created
// serviceAccountKey.json
const serviceAccount = require("./config/serviceAccountKey.json");
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
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.get("/sign-in", function (req, res) {
  res.render("pages/sign-in");
});

app.get("/sign-up", function (req, res) {
  // console.log('here 1')
  res.render("pages/sign-up");
  // console.log('here 2')
});

app.get("/dashboard", authMiddleware, async function (req, res) {
  const feed = await userFeed.get();
  res.render("pages/dashboard", { user: req.user, feed });
});

app.post("/sessionLogin", async (req, res) => {

  // need to tell it how to parse it
  // body parser is a method used
  // app.use(express.text()); this tells it to read it as a string

  // CS5356 4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  // Get the ID token passed and the CSRF token.

  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  adminAuth.getAuth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // debugger
        // console.log("here")
        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
        res.cookie('session', sessionCookie, options);
        res.end(JSON.stringify({ status: 'success' }));
      },
      (error) => {
        // debugger
        console.log(error)
        res.status(401).send('UNAUTHORIZED REQUEST!');
      }
    );
});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // CS5356 5
  // Get the message that was submitted from the request body
  // const userFeed = await userFeed.get();
  const reqMessage = req.body.message;

  // Get the user object from the request body
  const userObject = req.body;

  // Add the message to the userFeed so its associated with the user
  // userObject
  userFeed.add(userObject, reqMessage)
  .then(()=>{
    userFeed.get()
      .then((feed)=>{
      // console.log(userObject)
      res.render("pages/dashboard", {user: userObject, feed});
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    console.log(errorCode);
    res.redirect('/dashboard');
  });
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
