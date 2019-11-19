var app = require('../Server'); // Link to your server file
const {MongoClient} = require('mongodb'); // For mongDB testing
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Data";
const supertest = require('supertest');
const request = supertest(app);
let connection;
let db;


beforeAll(async () => {
    __MONGO_URI__=uri;
    connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    __MONGO_DB_NAME__ = dbName;
    db = await connection.db(global.__MONGO_DB_NAME__);
});
afterAll(async () => {
    await connection.close();
    //await db.close();
});
// describe("Ensure server is running tests",() =>{
//     it("Tests to make sure server is online and responding", async ()=>{
//         const response = await request.get('/test')
//         expect(response.status).toBe(200)
//         expect(response.body.message).toBe('Skrt Skrt')
//         done()
//     });
// });

describe("Event Tests", () =>{
    it('should return a response with HTTP code 200 and an Event as JSON', async () => {
        const events = db.collection("Events");
        const res = await request.get('/Events/5dc0bff98ca4c153f47afeb0');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{"name":"TESTETER","Interests":["aoope", "Basketball", "Basebal"],_id: "5dc0bff98ca4c153f47afeb0","latdec": 49.01,"longdec": 39.001}]);
    });
    it('should return a response with HTTP code 200 and an empty array', async () => {
        const events = db.collection("Events");
        const res = await request.get('/Events/5dc0bff98ca4c153f47afebd');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
    it('should return a response with HTTP code 200 and an empty array', async () => {
        const users = db.collection("Events");
        const res = await request.get('/Events');
        expect(res.statusCode).toEqual(200);
    });
});

describe('GET invalid Event', () => {
    it('should return a response with HTTP code 200 and an empty array', async () => {
        const users = db.collection("Users");
        // const mockUser = {_id: "5dd1f920fcd2064ba8787a9d", name: 'John'};

        const res = await request.get('/Users/5dd1f920fcd2064ba8787a9d');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
    it('should return a User as JSON', async () => {
        const users = db.collection("Users");
        const res = await request.get('/Users/5dd1f920fcd2064ba8787a95');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{
            _id: '5dd1f920fcd2064ba8787a95',
            "FirstName": "DEBUG",
                "LastName": "DEBUG",
                "Email": "DEBUG",
                "DateofBirth": "DEBUG",
                "Gender": "DEBUG",
                "UserID": "DEBUG",
                "FirebaseToken": "DEBUG"
        }]);
    });
});

