const request = require("supertest");
const app = require("../app");
const users = require("./data/users.json");
const session = require('express-session');
let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    global.agent = request.agent(server);

    done();
  });
});

afterAll((done) => {
  if (server) {
    return server.close(done);
  }
});

describe("User Controller Tests", () => {

  it("should access the list of users", async () => {

      // get the list of users
      res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(res.text).toMatch(/Alumni Management Dashboard/);
    });

});
