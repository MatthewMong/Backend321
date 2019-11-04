const port = 3000;
const coordVar = 2.00001;

/**
 *Initiate Firebase Cloud Messaging connection
 * @type {admin}
 */
const admin = require("firebase-admin");
const serviceAccount = require("/thissucks-b5ac7-firebase-adminsdk-389of-ad03ab0675");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://thissucks-b5ac7.firebaseio.com",
});

/**
 * Initialize MongoDB constants and middleware (express)
 * @type {MongoClient}
 */
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const express = require("express");
const app = express();
app.use(express.json());
let db;
const ObjectID = require("mongodb").ObjectID;

/**
 * Connect to MongoDB server
 */
client.connect((err) => {
  if (err) {
    return console.log(err);
  }
  db = client.db("Data");
  console.log("successful connect");
});

// firebase cloud messaging stuff

/**
 * Basic notification function for FCM, sends a data packet
 * which is specified by payload to the specified user
 * @param registrationToken string should be retrieved from MongoDB or Device
 * @param payload JSON object to be delivered
 */
function sendMessage(registrationToken, payload) {
  const message = {data: payload, token: registrationToken};
  admin.messaging().send(message)
      .then((response) => {
      // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
}

/**
 * Send message to multiple users using FCM
 * @param UserID is an array, containing MongoDB ids as strings
 * @param payload JSON object to be delivered
 */
function volleyMessages(UserID, payload) {
  UserID.forEach(function(value) {
    const id = new ObjectID(value);
    db.collection("Users").find({_id: id}, {projection: {FirebaseToken: 1, _id: 0}}).toArray((err, result) => {
      if (err) {
        return console.log(err);
      }
      sendMessage(result[0].FirebaseToken, payload);
    });
  });
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
const get_user_location = function(req, res, next) {
  const longitdec = req.body.user_longdec;
  const latitdec = req.body.user_latdec;
  const user_id = req.body.user_id;
  try {
    db.collection("Users").updateOne(
        {_id: {user_id}},
        {
          $set:
                    {
                      longdec: longitdec,
                      latdec: latitdec,
                    },
        },
    );
  } catch (e) {
    console.log(e);
  }
  next();
};
app.use(get_user_location);

/**
 * Add user to MongoDB, request body should be a JSON object of the format
 * {Name:String, Age:Integer, Location:}
 * Response is MongoDB ObjectID for the newly created document
 */
app.post("/Users", function(req, res) {
  db.collection("Users").insertOne(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result.insertedId);
  });
});

/**
 * Put endpoint for REST Api, url has the extension
 * /collection/id to specify the collection and object_id that needs to be updated
 * attach updated json file in the data package.
 * Returns updated categories and status.
 */
app.put("/:collection/:id", function(req, res) {
  const id = new ObjectID(req.params.id);
  db.collection(req.params.collection).findOneAndUpdate({_id: id},
      {$set: req.body}, {new: true}, (err, result) => {
        if (err) {
          return console.log(err);
        }
        res.send(result);
      });
});

/**
 * Delete endpoint for REST Api, url has the extension
 * /collection/id to specify the collection and object_id that needs removed
 * returns confirmation or error
 */
app.delete("/:collection/:id", function(req, res) {
  const id = new ObjectID(req.params.id);
  db.collection(req.params.collection).deleteOne({_id: id}, (err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result);
  });
});

/**
 *
 * @param req
 * @param res
 * @param next
 */
const match_users2events = function(req, res, next) {
  const interests = req.body.Interests;
  const latitDecUpper = req.body.latdec + coordVar;
  const latitDecLower = req.body.latdec - coordVar;
  const longitDecUpper = req.body.longdec + coordVar;
  const longitDecLower = req.body.longdec - coordVar;
  if (interests.length >= 1 || true) {
    db.collection("Users").find({
      Interests: {$in: interests},
      Active: true,
      longdec: {$gte: (longitDecLower), $lte: (longitDecUpper)},
      latdec: {$gte: (latitDecLower), $lte: (latitDecUpper)},
    }).toArray((err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log(result);
      // TODO Do stuff with the array to find the best matches
    });
  }
  next();
};

/*
Creates events
Parameters in req: name (name of event), Interests (for event), latdec (lat of event), longdec (long of event)....
 */
/**
 * POST endpoint for REST Api, url has the extension
 * /Events/id to specify event that needs to be added
 * attach updated json file in the data package.
 * Will automatically match users and trigger notifications
 */
app.post("/Events", [match_users2events], function(req, res, next) {
  db.collection("Events").insertOne(req.body, (err, result) => {
    if (err) {
      return console.log(err);
    }
    const msg = {
      EventName: req.body.Name,
      Location: req.body.Location,
    };
    volleyMessages(["5da616b81c9d4400008b451f", "5da616b81c9d4400008b451f"], msg);
    // var inserted_id= result.insertedId;
    res.send(result.insertedId);
  });
});

/**
 * GET endpoint for REST Api, url has the extension /Users
 * will return all users in collection as JSON object
 */
app.get("/Users", (req, res) => {
  db.collection("Users").find().toArray((err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result);
  });
});

/**
 * GET endpoint for REST Api, url has the extension /Events
 * will return all events in collection as JSON object
 */
app.get("/Events", (req, res) => {
  db.collection("Events").find().toArray((err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result);
  });
});

/**
 * GET endpoint for REST Api, url has the extension /Users/id
 * where id is the MongoDB id of user
 * will return all user as a JSON object
 */
app.get("/Users/:id", (req, res) => {
  console.log("someone retrieved a user");
  const id = new ObjectID(req.params.id);// req.params.id
  db.collection("Users").find({_id: id}).toArray((err, result) => {
    res.send(result);
  });
});

/**
 * Standard error handler
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

/**
 * Basic middleware test function
 * should return a valid response if connected
 */
app.post("/", function(req, res) {
  res.end();
});

// TODO: implement updating function/call (to update songe parameter of document/json)

/**
 * Initiate REST endpoints on specified port
 * @param port integer which specifies which port
 * the REST endpoints are accessible at
 */
const server = app.listen(port, function() {
  // var host = server.address().address
  const port = server.address().port;
  console.log("App listening at %s!", port);
});
