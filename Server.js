const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Matthew:%25jGvP8gKW%40_%2A2dL@cpen321-q2pnc.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
var express = require('express');
var app = express();
//app.use(express.json);
var db;
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
app.get('/', (req, res) => {
    return res.send("memes");
});
app.post('/', function (req, res) {
    res.end();
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
