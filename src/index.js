const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;

// Import the functions you need from the SDKs you need
///// COMMENTING OUT THESE IMPORTS AS INCLUDING THEM CRASHES npm run start
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

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
app.get("/", function (req, res) {

  let features = [
    {
      title: "Dog-first: Use our built in scheduler to remind you to post about your dog's schedule (and never miss a meal or a walk!)",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon_4.jpeg",
    },
    {
      title: "Be in control: Our secure network allows you to always be in control of your and your dog's information. You can always change who can see your dog posts in the Settings menu.",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon_5.jpeg",
    },
    {
      title: "Build your doggie community: Your doggo wants more friends, we know it! You can start here now!",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon_6.jpeg",
    },
  ];

  res.render("pages/index", { features:features });
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

app.post("/sessionLogin", (req, res) => {
  // CS5356 TODO #4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501
  ////res.status(501).send();

    // Get ID token from request body
    const idToken = req.body.idToken.toString();

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
    //Create a session cookie using the Firebase Admin SDK
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          // Set cookie policy for session cookie.
          const options = { maxAge: expiresIn, httpOnly: true, secure: true };
          // Set that cookie with the name 'session'
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          console.log("error", error);
          res.status(401).send("UNAUTHORIZED REQUEST!");
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

  const userMessage = req.body.message.toString();
  const user = req.user;

  await userFeed.add(user, userMessage);

  res.redirect("/dashboard");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
