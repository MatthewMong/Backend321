//var app = require('../Server') // Link to your server file
/**
 * Start Server.js and then run Server.test.js (alias is npm test)
 */

const supertest = require('supertest');
const request = supertest('http://localhost:5555/');
describe('Get All Users', function () {
    it('should return a response with HTTP code 200', function (done) {
        request.get('Users').expect(200, done);
    });
});

describe('GET User by ID', function () {
    it('should return a response with HTTP code 200 and a json schema', function (done) {
        request.get('Users/5dd1f920fcd2064ba8787a95').expect(200).expect([{
            _id: '5dd1f920fcd2064ba8787a95',
            "FirstName": "DEBUG",
                "LastName": "DEBUG",
                "Email": "DEBUG",
                "DateofBirth": "DEBUG",
                "Gender": "DEBUG",
                "UserID": "DEBUG",
                "FirebaseToken": "DEBUG"
        }], done);
    });
});
describe('Get specific User', function () {
    it('should return a response with HTTP code 200', function (done) {
        request.get('Users').expect(200, done);
    });
});

describe('GET invalid User', function () {
    it('should return a response with HTTP code 200 and an empty array', function (done) {
        request.get('Users/5dd1f920fcd2064ba8787a9a').expect(200).expect([], done);
    });
});

describe('GET invalid User', function () {
    it('should return a response with HTTP code 200 and an array containing event', function (done) {
        request.get('Events/5da74c738795bf29b0baae3c').expect(200).expect([
            {
                "_id": "5da74c738795bf29b0baae3c",
                "name": "DEBUG",
                "Interests": [
                    "DEBUG",
                    "DEBUG",
                    "DEBUG"
                ],
                "latdec": 50,
                "longdec": 50
            }
        ], done);
    });
});

describe('GET invalid Event', function () {
    it('should return a response with HTTP code 200 and an empty array', function (done) {
        request.get('Users/5dd1f920fcd2064ba8787a9d').expect(200).expect([], done);
    });
});