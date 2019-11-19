var app = require('../Server'); // Link to your server file
const {MongoClient} = require('mongodb'); // For mongDB testing
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Data";
const supertest = require('supertest');
const request = supertest(app);


//
// /**
//  * Start Server.js and then run Server.test.js (alias is npm test)
//  */
// const supertest = require('supertest');
// const request = supertest(app);
//
// describe('Get All Users', function () {
//     it('should return a response with HTTP code 200', function (done) {
//         request.get('Users').expect(200, done);
//     });
// });
//
// describe('GET User by ID', function () {
//     it('should return a response with HTTP code 200 and a json schema', function (done) {
//         request.get('Users/5dd1f920fcd2064ba8787a95').expect(200).expect([{
//             _id: '5dd1f920fcd2064ba8787a95',
//             "FirstName": "DEBUG",
//                 "LastName": "DEBUG",
//                 "Email": "DEBUG",
//                 "DateofBirth": "DEBUG",
//                 "Gender": "DEBUG",
//                 "UserID": "DEBUG",
//                 "FirebaseToken": "DEBUG"
//         }], done);
//     });
// });
// describe('Get specific User', function () {
//     it('should return a response with HTTP code 200', function (done) {
//         request.get('Users').expect(200, done);
//     });
// });
//
// describe('GET invalid User', function () {
//     it('should return a response with HTTP code 200 and an empty array', function (done) {
//         request.get('Users/5dd1f920fcd2064ba8787a9a').expect(200).expect([], done);
//     });
// });
//
// describe('GET invalid User', function () {
//     it('should return a response with HTTP code 200 and an array containing event', function (done) {
//         request.get('Events/5da74c738795bf29b0baae3c').expect(200).expect([
//             {
//                 "_id": "5da74c738795bf29b0baae3c",
//                 "name": "DEBUG",
//                 "Interests": [
//                     "DEBUG",
//                     "DEBUG",
//                     "DEBUG"
//                 ],
//                 "latdec": 50,
//                 "longdec": 50
//             }
//         ], done);
//     });
// });
//
// describe('GET invalid Event', function () {
//     it('should return a response with HTTP code 200 and an empty array', function (done) {
//         request.get('Users/5dd1f920fcd2064ba8787a9d').expect(200).expect([], done);
//     });
// });
// describe('GET invalid Event', function () {
//     it('should return a response with HTTP code 200 and an empty array', function (done) {
//         request.get('Users/5dd1f920fcd2064ba8787a9d').expect(200).expect([], done);
//     });
// });



describe('GET invalid Event', () => {
    let connection;
    let db;

    beforeAll(async () => {
        //__MONGO_URI__=uri;
        connection = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        //__MONGO_DB_NAME__ = dbName;
        db = await connection.db(dbName);
    });


    afterAll(async () => {
        //await db.close();
        await connection.close();
        await db.close();
    });
    it('should return a response with HTTP code 200 and an empty array', async () => {
        //const users = db.collection("Users");
        const mockUser = {_id: "5dbf442a5a3fb30420fc0ebc", name: 'John'};

        const res = await request.get("/Users/"+mockUser._id);
       // expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual("5da61616f3d9a936c43a5bbd");

    });

});
// describe('GET invalid Event', () => {
//     let connection;
//     let db;
//
//     beforeAll(async () => {
//         //__MONGO_URI__=uri;
//         connection = await MongoClient.connect(__MONGO_URI__, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//        // __MONGO_DB_NAME__ = dbName;
//         db = await connection.db(__MONGO_DB_NAME__);
//     });
//
//
//     afterAll(async () => {
//         //await db.close();
//         await connection.close();
//         await db.close();
//     });
//     it('should return a response with HTTP code 200 and an empty array', async () => {
//         const users = db.collection("Users");
//         const mockUser = {_id: "5dbf442a5a3fb30420fc0ebc", name: 'John'};
//
//         await users.insertOne(mockUser);
//
//         const insertedUser = await users.findOne({_id: 'some-user-id'});
//         expect(insertedUser).toEqual(mockUser);
//
//         // const res = await request.get("/Users/"+mockUser._id);
//         // // expect(res.statusCode).toEqual(200);
//         // expect(res.body).toEqual("5da61616f3d9a936c43a5bbd");
//
//     });
//
// });
//
//
// const {MongoClient} = require('mongodb');

// const {MongoClient} = require('mongodb');


describe('insert', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db();
    });

    afterAll(async () => {
        await connection.close();
    });

    it('should insert a doc into collection', async () => {
        const users = db.collection('Users');

        const mockUser = {_id: 'some-user-id', name: 'John'};
        await users.insertOne(mockUser);

        const insertedUser = await request.get("\Users"+mockUser._id);
        expect(insertedUser.body).toEqual(1);
    });
});