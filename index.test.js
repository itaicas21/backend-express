const app = require('./app.js');
const request = require('supertest');
const testObject={
    "task":"Get Milk",
    "id":"32c43c3f-e7ff-4b4f-85bf-05b8b18cc823",
    "Hello":"Hi"
}
describe('Get Functions', ()=>{
    it ('By Id',async ()=>{
        const response= await request(app).get(`/b/${testObject.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(testObject);
        
    });   
});