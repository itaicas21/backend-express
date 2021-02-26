const app = require("./app.js");
const request = require("supertest");
const testObject = {
  task: "Get Milk",
  id: "32c43c3f-e7ff-4b4f-85bf-05b8b18cc823",
  Hello: "Hi",
};
describe("Get Functions", () => {
  it("Get Bin by Id", async () => {
    const response = await request(app).get(`/b/${testObject.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testObject);
  });
  it("Not able to find Bin by Id", async () => {
    const response = await request(app).get(
      `/b/32c43c3e-e7ff-4b4f-85bf-05b8b18cc822`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "File not found" });
  });
  it("Invalid Id", async () => {
    const response = await request(app).get(
      `/b/32c43c3-e7ff-4b4f-85bf-05b8b18cc822`
    );
    expect(response.status).toBe(422);
    expect(response.body).toEqual({ message: "Invalid Id" });
  });
});

describe("Post functions", () => {
  it("Can add a new json bin", async () => {
    const response = await request(app)
      .post(`/b/`)
      .send({ name: "john" })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "john", id: response.body["id"] });
  });
});
