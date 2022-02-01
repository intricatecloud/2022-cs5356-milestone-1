const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();
const port = process.env.PORT || 8080;

// DONE ✅

// CS5356 TODO #2
// Uncomment this next line after you've created
// serviceAccountKey.json
const serviceAccount = require("./../config/serviceAccountKey.json");
const userFeed = require("./app/user-feed");
const authMiddleware = require("./app/auth-middleware");

// Helper functions to attach CSRF Token
function attachCsrfToken(url, cookie, value) {
  return function (req, res, next) {
    if (req.url == url) {
      res.cookie(cookie, value);
    }
    next();
  };
}

// Helper functions to check if user is signed In

function checkIfSignedIn(url) {
  return function (req, res, next) {
    if (req.url == url) {
      const sessionCookie = req.cookies.session || "";
      // User already logged in. Redirect to profile page.
      admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then(function (decodedClaims) {
          res.redirect("/profile");
        })
        .catch(function (error) {
          next();
        });
    } else {
      next();
    }
  };
}

// DONE ✅

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

// Attach CSRF token on each request.
app.use(
  attachCsrfToken(
    "/",
    "csrfToken",
    (Math.random() * 100000000000000000).toString()
  )
);
// If a user is signed in, redirect to profile page.
app.use(checkIfSignedIn("/"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static("static/"));

// use res.render to load up an ejs view file
// index page
app.get("/", function (req, res) {
  let features = [
    {
      title: "Dog-first",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon-usp_1.png",
    },
    {
      title: "Be in control",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon-usp_2.png",
    },
    {
      title: "Roof yourself",
      text: "Lorem Ipsum Dolor sit amet",
      img: "/static/icon-usp_3.png",
    },
  ];

  res.render("pages/index", { features: features });
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

  // Get ID token and CSRF token.
  const idToken = req.body.idToken.toString();
  const csrfToken = req.body.csrfToken.toString();

  // Guard against CSRF attacks.
  if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
    res.status(401).send("UNAUTHORIZED REQUEST!");
    return;
  }
  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedClaims) {
      // In this case, we are enforcing that the user signed in in the last 5 minutes.
      if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
        return admin
          .auth()
          .createSessionCookie(idToken, { expiresIn: expiresIn });
      }
      throw new Error("UNAUTHORIZED REQUEST!");
    })
    .then(function (sessionCookie) {
      // Note httpOnly cookie will not be accessible from javascript.
      // secure flag should be set to true in production.
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: false /** to test in localhost */,
      };
      res.cookie("session", sessionCookie, options);
      res.end(JSON.stringify({ status: "success" }));
    })
    .catch(function (error) {
      res.status(401).send("UNAUTHORIZED REQUEST!");
    });
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
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
