const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Matthew:%25jGvP8gKW%40_%2A2dL@cpen321-q2pnc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var express = require('express');
//var bodyParser = require('body-parser');
var app = express();
var db;
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
app.get('/', (req, res) => {
    db.collection("Users").find().toArray((err,result) => {
        res.send(result);})
});

app.get('/Users', (req, res) => {
    var id = new ObjectID(JSON.stringify(req.body.id));//req.params.id
    console.log(JSON.stringify(req.body));
    db.collection('Users').findOne({'_id':id})
        .then(function(doc) {
            if(!doc)
                throw new Error('No record found.');
            console.log(doc);//else case
        });

});

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
