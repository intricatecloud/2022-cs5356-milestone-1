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
  // ✅ DONE
  // CS5356 TODO #4

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
  res.redirect("/sign-up");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // ✅ DONE
  // CS5356 TODO #5

  // Get the message that was submitted from the request body
  const userMessage = req.body.message.toString();

  // Get the user object from the request body
  const user = req.user;

  // Add the message to the userFeed so its associated with the user
  await userFeed.add(user, userMessage);

  // Reload dashboard to show new feed
  res.redirect("/dashboard");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
