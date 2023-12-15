const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const users = require("./data/users.json");
const User = require("../models/user");

let server;

app.use((req, res, next) => {
        
  req.session.user = { id: '627b72eaf76a5b23e4a657e6', user: 'testUser' }; // Mock user data
  req.session.isAuthenticated = true;
  next();
});

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

  it("should fail login with incorrect credentials", async () => {
    const credentials = { email: "wrong@email.com", password: "wrongPassword" };
    const res = await request(app)
      .post("/authenticate/login")
      .send(credentials);

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Login failed!/);
  });

  it("should login as the user is already logged in", async () => {
    const res = await request(app).get("/authenticate/login");
    expect(res.statusCode).toEqual(302);
  });

  it("should log out a user", async () => {
    const res = await request(app).get("/authenticate/logout");
    expect(res.statusCode).toEqual(302);
    expect(res.header["location"]).toBe("/"); // Redirects to homepage or login page
  });

  //Test for registration
  it("should register a new user", async () => {
    const newUser = users[0]
    const res = await request(app).post("/authenticate/register").send(newUser);
    expect(res.statusCode).toEqual(302);
    expect(res.header['location']).toBe("/events");
  });

  it("should login with correct credentials", async () => {
  const credentials = { email: users[0].email, password: users[0].password };
    const res = await request(app)
      .post("/authenticate/login")
      .send(credentials);

    expect(res.statusCode).toEqual(302);
    expect(res.header['location']).toBe("/events");
    
  });


  // non admin access
  // Test for getUser
  it("should fail getting user details as non-admin", async () => {

    const res = await request(app).get(`/users/${users[0]._id}/update`);
    expect(res.statusCode).toEqual(403);
    console.log("403 page: ", res.body);
    expect(res.text).toMatch(/Access denied/);
  });


   //Test for registration and making a user an admin programmatically
   it("should register a new user", async () => {
    const newUser = users[1];
    const res = await request(app).post("/authenticate/register").send(newUser);
    expect(res.statusCode).toEqual(302);
    expect(res.header['location']).toBe("/events");

    
  });

});
