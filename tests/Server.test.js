var app = require("../Server"); // Link to your server file
const {MongoClient} = require("mongodb"); // For mongDB testing
const uri = "mongodb+srv://kswic:rqerBR73CjIcOnaB@test-cluster-323xs.azure.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "Data";
const supertest = require("supertest");
const request = supertest(app);
let connection;
let db;
var mockData = require("./model");
var mockUsers = mockData.Users;
var mockEvents = mockData.Events;
const func = require("./../HelperFunctions");
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
        const response = await request.get("/yeet");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([])
    });
});

describe("Event Tests", () => {
    it("should return a User as JSON", async () => {

        const users = db.collection("Events");
        const res = await request.post("/Events").send(mockEvents.mockDebugEvent);

        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
    });
    it("should return a response with HTTP code 200 and an Event as JSON", async () => {
        const events = db.collection("Events");
        const res = await request.get("/Events/5dc0bff98ca4c153f47afeb0");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockEvents.mockGetEvent]);
    });
    it("should return a response with HTTP code 200 and an empty array", async () => {
        const events = db.collection("Events");
        const res = await request.get("/Events/5dc0bff98ca4c153f47afebd");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
    it("should return a response with HTTP code 200 and an empty array", async () => {
        const users = db.collection("Events");
        const res = await request.get("/Events");
        expect(res.statusCode).toEqual(200);
    });
});

describe("GET invalid Event", () => {
    it("should return a response with HTTP code 200 and an empty array", async () => {
        const users = db.collection("Users");
        // const mockUser = {_id: "5dd1f920fcd2064ba8787a9d", name: "John"};

        const res = await request.get("/Users/5dd1f920fcd2064ba8787a9d");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });
    it("should return a User as JSON", async () => {
        const res = await request.get(("/Users/" + mockUsers.mockAvgUser._id));
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockUsers.mockAvgUser]);
    });
    it("should add a user to the database and return the id as a string", async () => {
        const users = db.collection("Users");
        const res = await request.post("/Users").send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual("object");
    });
    it("Should attempt to update a user and return a valid update", async () => {
        const users = db.collection("Users");
        const res = await request.put(("/Users/" + mockUsers.mockAvgUser._id)).send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(200);
        expect(res.body.ok).toEqual(1);
    });
    it("should attempt to update a user and fail", async () => {
        const users = db.collection("Users");
        const res = await request.put("/Users/cdd").send(mockUsers.mockAvgUserNoID);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({"error": {"message": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"}});
    });
    it("should send an improper document and fail validation", async () => {
        const users = db.collection("Users");
        const res = await request.post("/Users").send(mockUsers.mockAvgUserImproper);
        expect(res.body).toEqual({"code": 121, "driver": true, "errmsg": "Document failed validation", "index": 0, "name": "MongoError"});
    });


});


describe("Complex logic Testing", () => {

    // const events = db.collection("Events");
    it("Should add EventUserAdd1 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res1 = await request.post("/Users").send(mockUsers.mockEventUserAdd1);
        expect(res1.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd2 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res2 = await request.post("/Users").send(mockUsers.mockEventUserAdd2);
        expect(res2.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd3 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res3 = await request.post("/Users").send(mockUsers.mockEventUserAdd3);
        expect(res3.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd4 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res4 = await request.post("/Users").send(mockUsers.mockEventUserAdd4);
        expect(res4.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd5 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res5 = await request.post("/Users").send(mockUsers.mockEventUserAdd5);
        expect(res5.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd6 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res6 = await request.post("/Users").send(mockUsers.mockEventUserAdd6);
        expect(res6.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd7 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res7 = await request.post("/Users").send(mockUsers.mockEventUserAdd7);
        expect(res7.statusCode).toEqual(200);
    });
    it("Should add EventUserAdd8 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res8 = await request.post("/Users").send(mockUsers.mockEventUserAdd8);
        expect(res8.statusCode).toEqual(200);
        //console.log(res1._data);
    });
    it("Should add EventUserNOAdd1 that should NOT be notified of the event", async () => {
        const users = db.collection("Users");
        const res1 = await request.post("/Users").send(mockUsers.mockEventUserNOAdd1);
        expect(res1.statusCode).toEqual(200);
    });
    it("Should add EventUserNOAdd2 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res2 = await request.post("/Users").send(mockUsers.mockEventUserNOAdd2);
        expect(res2.statusCode).toEqual(200);
    });
    it("Should add EventUserNOAdd3 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res3 = await request.post("/Users").send(mockUsers.mockEventUserNOAdd3);
        expect(res3.statusCode).toEqual(200);
    });
    it("Should add EventUserNOAdd4 that should be notified of the event", async () => {
        const users = db.collection("Users");
        const res4 = await request.post("/Users").send(mockUsers.mockEventUserNOAdd4);
        expect(res4.statusCode).toEqual(200);
    });
    it("Should add Complex Logic event", async () => {
        const events = db.collection("Events");
        console.log(mockEvents.mockComplexEvent._id);
        const res = await request.post("/Events").send(mockEvents.mockComplexEventNoID);
        expect(res.statusCode).toEqual(200);
        //console.log(app.userIDSend);
    });
    it("Sorting Algorithm", async () => {
        const arraySortedUsers = [];
        const arrayAllUsers = [];

        for (var key of Object.keys(mockUsers)) {
            if (mockUsers[key].hasOwnProperty("latdec") && mockUsers[key].hasOwnProperty("Active")) {
                if (mockUsers[key].Active) {
                    arrayAllUsers.push(mockUsers[key]);
                }
            }
        }
        const expectedArray = [
            mockUsers.mockEventUserAdd1,
            mockUsers.mockEventUserAdd2,
            mockUsers.mockEventUserAdd3,
            mockUsers.mockEventUserAdd4,
            mockUsers.mockEventUserAdd5,
            mockUsers.mockEventUserAdd6,
            mockUsers.mockEventUserAdd7,
            mockUsers.mockEventUserAdd8];
        //console.log(arrayAllUsers);

        arrayUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers, 39.01, 49.1);


        //console.log(arrayUsers);
        expect(arrayUsers).toStrictEqual(expectedArray);

    });
    it("Does not add EventUserNOAdd1", async () => {
        const arraySortedUsers = [];
        const arrayAllUsers = [];

        for (var key of Object.keys(mockUsers)) {
            if (mockUsers[key].hasOwnProperty("latdec") && mockUsers[key].hasOwnProperty("Active")) {
                if (mockUsers[key].Active) {
                    arrayAllUsers.push(mockUsers[key]);
                }
            }
        }
        const expectedArray = [
            mockUsers.mockEventUserAdd1,
            mockUsers.mockEventUserAdd2,
            mockUsers.mockEventUserAdd3,
            mockUsers.mockEventUserAdd4,
            mockUsers.mockEventUserAdd5,
            mockUsers.mockEventUserAdd6,
            mockUsers.mockEventUserAdd7,
            mockUsers.mockEventUserAdd8];
        //console.log(arrayAllUsers);

        const arrayUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers);
        const present = arrayUsers.includes(mockUsers.mockEventUserNOAdd1);
        expect(present).toBe(false);
    });

    it("Does not add EventUserNOAdd2", async () => {
        const arraySortedUsers = [];
        const arrayAllUsers = [];

        for (var key of Object.keys(mockUsers)) {
            if (mockUsers[key].hasOwnProperty("latdec") && mockUsers[key].hasOwnProperty("Active")) {
                if (mockUsers[key].Active) {
                    arrayAllUsers.push(mockUsers[key]);
                }
            }
        }
        const expectedArray = [
            mockUsers.mockEventUserAdd1,
            mockUsers.mockEventUserAdd2,
            mockUsers.mockEventUserAdd3,
            mockUsers.mockEventUserAdd4,
            mockUsers.mockEventUserAdd5,
            mockUsers.mockEventUserAdd6,
            mockUsers.mockEventUserAdd7,
            mockUsers.mockEventUserAdd8];
        //console.log(arrayAllUsers);

        const arrayUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers);
        const present = arrayUsers.includes(mockUsers.mockEventUserNOAdd2);
        expect(present).toBe(false);
    });
    it("Does not add EventUserNOAdd3", async () => {
        const arraySortedUsers = [];
        const arrayAllUsers = [];

        for (var key of Object.keys(mockUsers)) {
            if (mockUsers[key].hasOwnProperty("latdec") && mockUsers[key].hasOwnProperty("Active")) {
                if (mockUsers[key].Active) {
                    arrayAllUsers.push(mockUsers[key]);
                }
            }
        }
        const expectedArray = [
            mockUsers.mockEventUserAdd1,
            mockUsers.mockEventUserAdd2,
            mockUsers.mockEventUserAdd3,
            mockUsers.mockEventUserAdd4,
            mockUsers.mockEventUserAdd5,
            mockUsers.mockEventUserAdd6,
            mockUsers.mockEventUserAdd7,
            mockUsers.mockEventUserAdd8];
        //console.log(arrayAllUsers);

        const arrayUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers);
        const present = arrayUsers.includes(mockUsers.mockEventUserNOAdd3);
        expect(present).toBe(false);
    });
    it("Does not add EventUserNOAdd4", async () => {
        const arraySortedUsers = [];
        const arrayAllUsers = [];

        for (var key of Object.keys(mockUsers)) {
            if (mockUsers[key].hasOwnProperty("latdec") && mockUsers[key].hasOwnProperty("Active")) {
                if (mockUsers[key].Active) {
                    arrayAllUsers.push(mockUsers[key]);
                }
            }
        }
        const expectedArray = [
            mockUsers.mockEventUserAdd1,
            mockUsers.mockEventUserAdd2,
            mockUsers.mockEventUserAdd3,
            mockUsers.mockEventUserAdd4,
            mockUsers.mockEventUserAdd5,
            mockUsers.mockEventUserAdd6,
            mockUsers.mockEventUserAdd7,
            mockUsers.mockEventUserAdd8];
        //console.log(arrayAllUsers);

        const arrayUsers = func.sortMatchedUsers(arrayAllUsers, 0, arraySortedUsers);
        const present = arrayUsers.includes(mockUsers.mockEventUserNOAdd4);
        expect(present).toBe(false);
    });

});