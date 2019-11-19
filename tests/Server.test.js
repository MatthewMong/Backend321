var app = require('../Server'); // Link to your server file
const {MongoClient} = require('mongodb'); // For mongDB testing
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Data";
const supertest = require('supertest');
const request = supertest(app);
let connection;
let db;
var mockData = require('./model');
var mockUsers = mockData.Users;
var mockEvents = mockData.Events;
const coordIncrem = 1.01;
const maxCoordVar = 3.00001;
const numOfUsers2Send = 1;

beforeAll(async () => {
    connection = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    db = await connection.db(dbName);
});
afterAll(async () => {
    await connection.close();
});
describe("Ensure server is running tests",() =>{
    it("Send wrong endpoint expect 500", async ()=>{
        const response = await request.get('/yeet');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([])
    });
});

describe("Event Tests", () =>{
    it('should return a User as JSON', async () => {

        const users = db.collection("Events");
        const res = await request.post('/Events').send(mockEvents.mockDebugEvent);

        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("string");
    });
    it('should return a response with HTTP code 200 and an Event as JSON', async () => {
        const events = db.collection("Events");
        const res = await request.get('/Events/5dc0bff98ca4c153f47afeb0');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockEvents.mockGetEvent]);
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
        const res = await request.get(('/Users/' + mockUsers.mockAvgUser._id));
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockUsers.mockAvgUser]);
    });
    it('should add a user to the database and return the id as a string', async () => {
        const users = db.collection("Users");
        const res = await request.post('/Users').send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("string");
    });
    it('Should attempt to update a user and return a valid update', async () => {
        const users = db.collection("Users");
        const res = await request.put(('/Users/' + mockUsers.mockAvgUser._id)).send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toEqual(1);
    });
    it('should attempt to update a user and fail', async () => {
        const users = db.collection("Users");
        const res = await request.put('/Users/cdd').send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({"error": {"message": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"}});
    });
    it('should send an improper document and fail validation', async () => {
        const users = db.collection("Users");
        const res = await request.post('/Users').send(mockUsers.mockAvgUserImproper);
        expect(res.body).toEqual({"code": 121, "driver": true, "errmsg": "Document failed validation", "index": 0, "name": "MongoError"});
    });


});


describe('Complex logic Testing', () => {

    // const events = db.collection("Events");
    it('Should add all users that are a should be notified of the event', async () => {
        const users = db.collection("Users");
        const res1 = await request.post('/Users').send(mockUsers.mockEventUserAdd1);
        expect(res1.statusCode).toEqual(200);
        const res2 = await request.post('/Users').send(mockUsers.mockEventUserAdd2);
        expect(res2.statusCode).toEqual(200);
        const res3 = await request.post('/Users').send(mockUsers.mockEventUserAdd3);
        expect(res3.statusCode).toEqual(200);
        const res4 = await request.post('/Users').send(mockUsers.mockEventUserAdd4);
        expect(res4.statusCode).toEqual(200);
        const res5 = await request.post('/Users').send(mockUsers.mockEventUserAdd5);
        expect(res5.statusCode).toEqual(200);
        const res6 = await request.post('/Users').send(mockUsers.mockEventUserAdd6);
        expect(res6.statusCode).toEqual(200);
        const res7 = await request.post('/Users').send(mockUsers.mockEventUserAdd7);
        expect(res7.statusCode).toEqual(200);
        const res8 = await request.post('/Users').send(mockUsers.mockEventUserAdd8);
        expect(res8.statusCode).toEqual(200);
        //console.log(res1._data);
    });
    it('Should add all users that should NOT be notified of the event', async () => {
        const users = db.collection("Users");
        const res1 = await request.post('/Users').send(mockUsers.mockEventUserNOAdd1);
        expect(res1.statusCode).toEqual(200);
        const res2 = await request.post('/Users').send(mockUsers.mockEventUserNOAdd2);
        expect(res2.statusCode).toEqual(200);
        const res3 = await request.post('/Users').send(mockUsers.mockEventUserNOAdd3);
        expect(res3.statusCode).toEqual(200);
        const res4 = await request.post('/Users').send(mockUsers.mockEventUserNOAdd4);
        expect(res4.statusCode).toEqual(200);
    });
    it('Should add event', async () => {
        const events = db.collection("Events");
        console.log(mockEvents.mockComplexEvent);
        const res = await request.post('/Events').send(mockEvents.mockComplexEventNoID);
        expect(res.statusCode).toEqual(200);
        //console.log(app.userIDSend);
    });


});