const port = 3000;
const expiryDate = 5;

/**
 *Initiate Firebase Cloud Messaging connection
 * @type {admin}
 */
const admin = require("firebase-admin");
const serviceAccount = require("../Backend321/thissucks-b5ac7-firebase-adminsdk-389of-ad03ab0675");
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
const func = require("./HelperFunctions");

/**
 * Connect to MongoDB server
 */
client.connect((err) => {
    if (err) {
        //return console.log(err);
    }
    db = client.db("Data");
    //console.log("successful connect");
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
        })
        .catch((error) => {
        });
}

/**
 * Send message to multiple users using FCM
 * @param UserID is an array, containing MongoDB ids as strings
 * @param payload JSON object to be delivered
 */
/**
 * Send message to multiple users using FCM
 * @param UserID is an array, containing MongoDB ids as strings
 * @param payload JSON object to be delivered
 */
function volleyMessages(UserID, payload) {
    UserID.forEach(function (value) {
        const id = new ObjectID(value);
        db.collection("Users").find({_id: id}, {projection: {FirebaseToken: 1, _id: 0}}).toArray((err, result) => {
            sendMessage(result[0].FirebaseToken, payload);
        });
    });
}

/**
 *  Deletes events older than the expiry date
 * @param req
 * @param res
 * @param next
 */
const deleteOldEvents = function (req, res, next){
    var date = new Date();
    date.setDate(date.getDate()-expiryDate);
    db.collection("Events").deleteMany({
        created: {$lte: (date.toJSON())}
        });
    next();
};

app.use(deleteOldEvents);


/**
 *
 * @param req
 * @param res
 * @param next
 * TODO: Change req.body.variable_name to req.body.variableName when variableName known
 */
const getUserLocation = function (req, res, next) {
    const longitdec = req.body.user_longdec;
    const latitdec = req.body.user_latdec;
    const userId = req.body.user_id;
    try {
        db.collection("Users").updateOne(
            {_id: {userId}},
            {
                $set:
                    {
                        longdec: longitdec,
                        latdec: latitdec,
                    },
            },
        );
    } catch (e) {
        //console.log(e);
    }
    next();
};
app.use(getUserLocation);

/**
 * Add user to MongoDB, request body should be a JSON object of the format
 * {Name:String, Age:Integer, Location:}
 * Response is MongoDB ObjectID for the newly created document
 */
app.post("/Users", function (req, res) {
    db.collection("Users").insertOne(req.body, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json({"id":result.insertedId});
        }
    });
});

/**
 * Put endpoint for REST Api, url has the extension
 * /collection/id to specify the collection and object_id that needs to be updated
 * attach updated json file in the data package.
 * Returns updated categories and status.
 */
app.put("/:collection/:id", function (req, res) {
    const id = new ObjectID(req.params.id);
    db.collection(req.params.collection).findOneAndUpdate({_id: id},
        {$set: req.body}, {new: true}, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
});

/**
 * Delete endpoint for REST Api, url has the extension
 * /collection/id to specify the collection and object_id that needs removed
 * returns confirmation or error
 */
app.delete("/:collection/:id", function (req, res) {
    const id = new ObjectID(req.params.id);
    db.collection(req.params.collection).deleteOne({_id: id}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

/**
 *
 * @param req
 * @param callback
 */
function matchUsers2Events(req, callback) {
  const interests = req.body.Interests;
  const latitDecUpper = req.body.latdec + func.maxCoordVar;
  const latitDecLower = req.body.latdec - func.maxCoordVar;
  const longitDecUpper = req.body.longdec + func.maxCoordVar;
  const longitDecLower = req.body.longdec - func.maxCoordVar;
  if (interests.length >= 1) {
    db.collection("Users").find({
      Interests: {$in: interests},
      Active: true,
      longdec: {$gte: (longitDecLower), $lte: (longitDecUpper)},
      latdec: {$gte: (latitDecLower), $lte: (latitDecUpper)},
    }, {projection: {
        Interests: true,
        longdec: true,
        latdec: true
      }}).toArray((err, result) => {
      if (err) {
        //return console.log(err);
      } else {
        callback(result);
      }
    });
  }
}
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
app.post("/Events", function (req, res, next) {
    db.collection("Events").insertOne(req.body, (err, result) => {
        if (err) {
            //return console.log(err);
        }
        var latDec = req.body.latdec;
        var longDec = req.body.longdec;
        var interests = req.body.Interests;

        const msg = {
            EventName: req.body.Name,
            Location: req.body.Location,
        };

        matchUsers2Events(req, function (arrayAllUsers) {
            var arraySortedUsers = [];
            arraySortedUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers, longDec, latDec);
            var userIDSend = [];
            for (var i = 0; i < arraySortedUsers.length; i++) {
                userIDSend.push(arraySortedUsers[parseInt(i, 10)]._id.toString());
            }
            volleyMessages(userIDSend, msg);
        });
        res.json({"id":result.insertedId});
    });
});

/**
 * GET endpoint for REST Api, url has the extension /collection
 * will return all objects in collection as JSON object
 */
app.get("/:collection", (req, res) => {
    db.collection(req.params.collection).find().toArray((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


/**
 * GET endpoint for REST Api, url has the extension /collection/id
 * where id is the MongoDB id of user
 * will return document as a JSON object
 */
app.get("/:collection/:id", (req, res) => {
    const id = new ObjectID(req.params.id);// req.params.id
    db.collection(req.params.collection).find({_id: id}).toArray((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
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
const server = app.listen(port, function () {
    // var host = server.address().address
    const port = server.address().port;
});
