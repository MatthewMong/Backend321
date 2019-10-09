const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
//const uri = "mongodb+srv://Matthew:%25jGvP8gKW%40_%2A2dL@cpen321-q2pnc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var express = require('express');
//var bodyParser = require('body-parser');
var app = express();
var database;
var ObjectID = require('mongodb').ObjectID;
const port = 3000;

app.use(express.json());
// var server = app.listen(8081, function(){
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log("Example app listening at http://%s:%s", host, port)
// });

client.connect(err => {
    if (err) return console.log(err);
    database = client.db('Data');
    console.log("successful connect");
    // perform actions on the collection object
    //client.close();
});
// app.get('/', (req, res) => {
//     var id = new ObjectID(req.params.id.);
//     console.log(id);
//     console.log("request recieved");
//     console.log(db.collection("Users").findOne({_id: id}));
//     return res.json(db.collection("Users").findOne({_id: id}));
// });
app.get('/Users', (req, res) => {
    database.collection("Users").find().toArray((err,result) => {
        res.send(result);})
});

app.get('/Users/:id', (req, res) => {
    var id = new ObjectID(req.params.id);//req.params.id
    database.collection("Users").find({'_id':id}).toArray((err,result) => {
        res.send(result);})
});

app.get('/Events/:id', (req, res) => {
    var id = new ObjectID(req.params.id);//req.params.id
    database.collection("Events").find({'_id':id}).toArray((err,result) => {
        res.send(result);})
});

// app.get('/Location/:latitude&:longitude', (req, res) => {
//     var latitude = req.params.latitude;
//     var longitude = req.params.longitude;
//     database.collection("Users").find({'_id':id}).toArray((err,result) => {
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

/*
Function: Posts Events into ./Event
 */
app.post('/Events', (req, res) => {
    database.collection('Events').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('Event Saved to Database');
    })
});


//TODO: implement updating function/call (to update songe parameter of document/json)
/*
Function: Posts Users into ./User
 */
app.post('/Users', (req, res) => {
    database.collection('Users').save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log('User Saved to Database');
    })
});

var server = app.listen(port, function () {
    //var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at %s!", port)
})


//app.listen(port, () => console.log(`Example app listening on port ${port}!`));
