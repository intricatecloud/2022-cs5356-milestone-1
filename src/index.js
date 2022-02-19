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
// content-type: text/plain
app.use(bodyParser.json());
// content-type: application/json
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
  // debugger
  // cookies : managed by browsers
  res.cookie('chenran-cookie','123', {httpOnly:true})
  res.render("pages/index");
});

// // 2 different function definations
// // function(req, res, next){}
// // verify the authorization before log in
// const authMiddleware = (req, res, next) => {
//   const cookies = req.cookies
//   // idtoken is inside the cookies
//   const sessionCookie = cookies.session;
//   // next: verify the session cookies
//   // if not login in just redirect
//   if(sessionCookie){
//     admin.auth().verifySessionCookie(sessionCookie)
//     .then(function(user){
//       next()
//     })
//     .catch(() => {
//       res.redirect('/sign-in');
//     })
//   }
//   else{
//     res.redirect('/sign-in');
//   }
// }


app.get('/about', authMiddleware, function(req, res){
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


/*
SessionLogin is a post request, not rendering a page.
*/
app.post("/sessionLogin", async (req, res) => {
  // CS5356 TODO #4
  // Get the ID token from the request body
  // Create a session cookie using the Firebase Admin SDK
  // Set that cookie with the name 'session'
  // And then return a 200 status code instead of a 501

    const idToken = req.body.idToken;
    // console.log(body);
    const expiresIn = 3600 * 1000; // this is one hour
    admin.auth().createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) =>{
        // Set cookie policy for sessiong cookie.
        const options = { maxAge: expiresIn, httpOnly : true, secure: true};
        // Set that cookie with the name 'session'
        res.cookie('session', sessionCookie, options);
        res.status(201).send(JSON.stringify({status: 'success'}));
      },
      (error) => {
        res.status(501).send(error.toString());
      }
    )
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
  await userFeed.add(req.user, req.body['message']);
  const feed = await userFeed.get();
  res.render("pages/dashboard", { user: req.user, feed });
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
