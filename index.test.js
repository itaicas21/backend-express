const app = require("./app.js");
const request = require("supertest");
const { deleteTestDirectory } = require("./utils.js");
const { v4: uuidv4 } = require("uuid");
let testObject;
const fs = require("fs");
describe("Post functions", () => {
  it("Can add a new json bin", async () => {
    const response = await request(app)
      .post(`/b/`)
      .send({ name: "john" })
      .set("Content-Type", "application/json");
    testObject = response.body;
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: "john", id: response.body["id"] });
  });
});
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

describe("Put functions", () => {
  it("Can update bin by id", async () => {
    const randomNum = Math.random();
    testObject.num = `${randomNum}`;
    const response = await request(app)
      .put(`/b/${testObject.id}`)
      .send({ num: `${randomNum}` })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testObject);
  });
  test("no new bin is created while updating", async () => {
    let uniqueId = uuidv4();
    const randomNum = Math.random();
    const response = await request(app)
      .put(`/b/${uniqueId}`)
      .send({ num: `${randomNum}` })
      .set("Content-Type", "application/json");
    const files = fs.readdirSync("./tests");
    expect(files.length).toBe(1);
  });
  test("invalid bin given", async () => {
    let uniqueId = uuidv4();
    var newId = uniqueId.substring(0, uniqueId.length - 1);
    const randomNum = Math.random();
    const response = await request(app)
      .put(`/b/${newId}`)
      .send({ num: `${randomNum}` })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(422);
  });
});

afterAll(() => {
  deleteTestDirectory();
});
