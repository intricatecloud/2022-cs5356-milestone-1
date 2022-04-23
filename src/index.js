//const functions = require("firebase-functions")
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =  "mongodb+srv://ja548:3hFmV7tyeqjyPjfP@cluster0.ggyax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.post("/create", async (request, response) => {
  try {
    await client.connect();
    const collection = client.db("game").collection("scores");
    const alreadyExisting = await collection.findOne({ username: request.body.username });
    if (alreadyExisting){
      var old_player_score = alreadyExisting.score
    }
  if ( !alreadyExisting && (request.body.username !== null)) {
      let result = await collection.insertOne(
        {
            "username": request.body.username,
            "score": request.body.score,
        }
    );
    response.send({ "_id": result.insertedId });
    client.close()
  }
 else if (  old_player_score <= request.body.score && (request.body.username !== null) ) {
      let { username, score } = req.body;
      // check if the username already exists
      collection.updateOne({
        _id: alreadyExisting._id
      }, {
          $set: {
            score: request.body.score
        }
      })
      response.send({ "_id": alreadyExisting._id });
      client.close()
}
  else {
    response.send({ status: false, msg: 'player username already exists or the score is higher' });
      }
  } catch (e) {
      response.status(500).send({ message: e.message });
  }
});
  

app.get("/get", async (request, response) => {
  try {
    await client.connect();
    const collection = client.db("game").collection("scores");
      let result = await collection.find({}).sort({ score: -1 }).limit(3).toArray();
      response.send(result);
    } catch (e) {
      response.status(500).send({ message: e.message });
    }
    
});


app.delete('/delete', async function(req, response) {
  try {
    let { username, score } = req.body;
    await client.connect();
    const collection = client.db("game").collection("scores");

    // check if the username already exists
    const alreadyExisting = await collection.findOne({ username: req.body.username });
    if (alreadyExisting) {
        const result = await collection.deleteMany(alreadyExisting);
        response.send({ status: true, msg: 'player deleted' });
    } else {
      response.send({ status: false, msg: 'username not found' });
    }    } catch (e) {
      response.status(500).send({ message: e.message });
    }
    
});


// // The index route
// app.get('/', function(req, res) {
//    res.send('Sweet Game Leaderboard API!');
// });

// // Connect to the database with [url]
// (async () => {
//    let client = await MongoClient.connect(
//        url,
//        { useNewUrlParser: true }
//    );

//    db = client.db('Players');

//    app.listen(PORT, async function() {
//        console.log(`Listening on Port ${PORT}`);
//        if (db) {
//            console.log('Database is Connected!');
//        }
//    });
// })();


// // Route to create new player
// app.post('/players', async function(req, res) {
//   // get information of player from POST body data
//   let { username, score } = req.body;

//   // check if the username already exists
//   const alreadyExisting = await db
//       .collection('players')
//       .findOne({ username: username });

//   if (alreadyExisting) {
//       res.send({ status: false, msg: 'player username already exists' });
//   } else {
//       // create the new player
//       await db.collection('players').insertOne({ username, score });
//       console.log(`Created Player ${username}`);
//       res.send({ status: true, msg: 'player created' });
//   }
// });


// app.put('/players', async function(req, res) {
//   let { username, score } = req.body;
//   // check if the username already exists
//   const alreadyExisting = await db
//       .collection('players')
//       .findOne({ username: username });
//   if (alreadyExisting) {
//       // Update player object with the username
//       await db
//           .collection('players')
//           .updateOne({ username }, { $set: { username, score } });
//       console.log(`Player ${username} score updated to ${score}`);
//       res.send({ status: true, msg: 'player score updated' });
//   } else {
//       res.send({ status: false, msg: 'player username not found' });
//   }
// });


// // delete player
// app.delete('/players', async function(req, res) {
//   let { username, score } = req.body;
//   // check if the username already exists
//   const alreadyExisting = await db
//       .collection('players')
//       .findOne({ username: username });

//   if (alreadyExisting) {
//       await db.collection('players').deleteOne({ username });
//       console.log(`Player ${username} deleted`);
//       res.send({ status: true, msg: 'player deleted' });
//   } else {
//       res.send({ status: false, msg: 'username not found' });
//   }
// });

// // Access the leaderboard
// app.get('/players', async function(req, res) {
//   // retrieve ‘lim’ from the query string info
//   let { lim } = req.query;
//   db.collection('players')
//       .find()
//       // -1 is for descending and 1 is for ascending
//       .sort({ score: -1 })
//       // Show only [lim] players
//       .limit(lim)
//       .toArray(function(err, result) {
//           if (err)
//               res.send({ status: false, msg: 'failed to retrieve players' });
//           console.log(Array.from(result));
//           res.send({ status: true, msg: result });
//       });
// });


// Connect to the database with the url


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

const fire_pref = require("firebase/performance");



// use cookies
app.use(cookieParser());
app.use(express.text())
app.use(express.json());
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

app.get("/game", function (req, res) {
  res.render("pages/game");
});


app.get("/leaderboard", function (req, res) {
  res.render("pages/leaderboard");
});

app.get("/dashboard", authMiddleware, async function (req, res) {
  const feed = await userFeed.get();
  res.render("pages/dashboard", { user: req.user, feed });
});

app.post("/sessionLogin", async(req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;  

  admin.auth().createSessionCookie(idToken, { expiresIn }).then( (sessionCookie) => {
      const options = { maxAge: expiresIn, httpOnly: false };
      res.cookie("__session", sessionCookie, options);
      res.status(200).send(JSON.stringify({status: 'success'}))
  }, error => {
    res.status(401).send('UNAUTHORIZED REQUEST!')
  })

});

app.get("/sessionLogout", (req, res) => {
  res.clearCookie("__session");
  res.redirect("/sign-in");
});

app.post("/dog-messages", authMiddleware, async (req, res) => {
  // CS5356 TODO #5

  // Get the message that was submitted from the r   equest body
  // Get the user object from the request body
  // Add the message to the userFeed so its associated with the user
  const msg = req.body.message
  const user = req.user 
  await userFeed.add(user,msg)
  res.redirect("/dashboard");

});


//exports.app = functions.https.onRequest(app);

app.listen({ hostname : 'localhost', port : PORT});
console.log("Server started at http://localhost:" + PORT);
