const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Matthew:%25jGvP8gKW%40_%2A2dL@cpen321-q2pnc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var express = require('express');
//var bodyParser = require('body-parser');
var app = express();
app.use(express.json());
var db;
var ObjectID = require('mongodb').ObjectID;
const port = 3000;


// var server = app.listen(8081, function(){
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log("Example app listening at http://%s:%s", host, port)
// });

client.connect(err => {
    if (err) return console.log(err);
    db = client.db('test');
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
// app.post('/', (req,res)=>{
//     db.collection("Users").insertOne({"task":req.body.task,"info":req.body.info}, (err, result)=>{
//         if (err) return console.log(err);
//         res.send("saved");
//     })
// });



app.post('/Users', function(req,res){
    db.collection("Users").insertOne(req.body, (err, result)=>{
        if (err) return console.log(err);
        res.send(result.insertedId);
        });
    });


app.post('/Events', function(req,res){
    db.collection("Users").insertOne(req.body, (err, result)=>{
        if (err) return console.log(err);
        res.send(result.insertedId);
    });
});


app.get('/', (req, res) => {
    db.collection("Users").find().toArray((err,result) => {
        res.send(result);})
});

//
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
    db.collection("Users").find({'_id':id}).toArray((err,result) => {
        res.send(result);})
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
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
