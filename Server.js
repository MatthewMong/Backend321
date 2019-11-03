//Init of Firebase backend for FCM
var admin = require("firebase-admin");
var serviceAccount = require("../Backend321/thissucks-b5ac7-firebase-adminsdk-389of-ad03ab0675");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://thissucks-b5ac7.firebaseio.com"
});

//Init of Mongo Backend for database
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
// const uri = "mongodb+srv://Matthew:%25jGvP8gKW%40_%2A2dL@cpen321-q2pnc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
//app.use(bodyParser.json({ type: 'application/*+json' })); // parse various different custom JSON types as JSON
app.use(express.json());
var db;
var ObjectID = require('mongodb').ObjectID;

const port = 3000;
const coord_var = 2.00001;

client.connect(err => {
    if (err) return console.log(err);
    db = client.db('Data');
    console.log("successful connect");
    sendmessage(buildnotification())
    // perform actions on the collection object
    //client.close();
});

/*
Updates user location whenerver user communicates with backend
request must inlcude
Parameter: user_id, user_longdec, user_latdec
 */
var get_user_location = function (req, res, next) {
    var longitdec = req.body.user_longdec;
    var latitdec = req.body.user_latdec;
    var user_id = req.body.user_id;
    try {
        db.collection("Users").updateOne(
            {_id: {user_id}},
            {
                $set:
                    {
                        longdec: longitdec,
                        latdec: latitdec
                    }
            }
        );
    } catch (e) {
        console.log(e);
    }
    next();
};
app.use(get_user_location);


app.post('/Users', function (req, res) {
    db.collection("Users").insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
        res.send(result.insertedId);
    });
});

app.put('/Users/:id', function (req, res) {
    var id = new ObjectID(req.params.id);
    db.collection("Users").findOneAndUpdate({_id: id},
        {$set: req.body}, {new: true}, (err, result) => {
            if (err) return console.log(err);
            res.send(result)
        });
});


app.put('/Events/:id', function (req, res) {
    var id = new ObjectID(req.params.id);
    db.collection("Events").findOneAndUpdate({_id: id},
        {$set: req.body}, {new: true}, (err, result) => {
            if (err) return console.log(err);
            res.send(result)
        });
});


var match_users2events = function (req, res, next) {
    var interests = req.body.Interests;
    var latitdec_upper = req.body.latdec + coord_var;
    var latitdec_lower = req.body.latdec - coord_var;
    var longitdec_upper = req.body.longdec + coord_var;
    var longitdec_lower = req.body.longdec - coord_var;
    if (interests.length >= 1 || true) {
        db.collection("Users").find({
            Interests: {$in: interests},
            Active: true,
            longdec: {$gte: (longitdec_lower), $lte: (longitdec_upper)},
            latdec: {$gte: (latitdec_lower), $lte: (latitdec_upper)}
        }).toArray((err, result) => {
            if (err) return console.log(err);
            console.log(result);
            //TODO Do stuff with the array to find the best matches
        })
    }
    next();
};

/*
Creates events
Parameters in req: name (name of event), Interests (for event), latdec (lat of event), longdec (long of event)....
 */
app.post('/Events', [match_users2events], function (req, res, next) {
    db.collection("Events").insertOne(req.body, (err, result) => {
        if (err) return console.log(err);
        // var inserted_id= result.insertedId;
        res.send(result.insertedId);
    });
});


app.get('/Users', (req, res) => {
    db.collection("Users").find().toArray((err, result) => {
        res.send(result);
    })
});
app.get('/Events', (req, res) => {
    db.collection("Events").find().toArray((err, result) => {
        res.send(result);
    })
});


// app.post('/Users', (req,res) =>{
//     console.log("triggered");
//     console.log(req.body);
//     // var doc = Document.parse(req.data.toString());
//     // res.send(doc);
//     db.collection("Users").insert(req.body,function(err,result) {
//         if (err)
//             res.send(err);
//         else
//             res.send(result);})
// });

app.get('/Users/:id', (req, res) => {
    console.log("someone retrieved a user");
    var id = new ObjectID(req.params.id);//req.params.id
    db.collection("Users").find({'_id': id}).toArray((err, result) => {
        res.send(result);
    })
});

// app.get('/Location/:latitude&:longitude', (req, res) => {
//     var latitude = req.params.latitude;
//     var longitude = req.params.longitude;
//     db.collection("Users").find({'_id':id}).toArray((err,result) => {
//         res.send(result);})
// });
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});
app.post('/', function (req, res) {
    res.end();
});

// /*
// Function: Posts Events into ./Event
//  */
// app.post('/Events', (req, res, next) => {
//     db.collection('Events').save(req.body, (err, result) => {
//         if (err) return console.log(err);
//         console.log('Event Saved to Database');
//     })
//
// });


//TODO: implement updating function/call (to update songe parameter of document/json)
/*
Function: Posts Users into ./User
 */
// app.post('/Users', (req, res) => {
//     db.collection('Users').save(req.body, (err, result) => {
//         if (err) return console.log(err);
//         console.log('User Saved to Database');
//     })
// });

var server = app.listen(port, function () {
    //var host = server.address().address
    var port = server.address().port;
    console.log("Example app listening at %s!", port)
});

//firebase cloud messaging stuff

/**
 * sendmessage uses the Firebase-admin console to send a payload to a specific device
 * @param message JSON object created by buildnotification
 */
function sendmessage(message) {
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

temp_token= 'cbi6da7yD0Y:APA91bE6JaGY-9DCTkKJya9tggqdVIdGHvY3d6dugMUi8Odgot7Yb1T2ueDsVK_9u3KXwBDgeVIk8BIY9i5PwcZUcT03fU2WMXox2z2cgTYxbosKCOw_MDfcxFVCr5q1q4G2SG96f5gj'
/**
Used to build a notification, attach a json object for data and a registration token as a string, this then becomes an FCM payload
 @param stuff is a JSON object which acts as data payload for notification
 @param token is the FCM token retrieved from the user
 @return JSON object with FCM formatting
 */
function buildnotification(stuff, token) {
    var registrationToken = token;
    var message = {
            data: stuff,
        token: registrationToken
    };
    return message
}
//app.listen(port, () => console.log(`Example app listening on port ${port}!`));
