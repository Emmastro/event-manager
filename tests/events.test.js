const request = require("supertest");
const events = require("./data/events.json");
const mongoose = require("mongoose");
const app = require("../app");
let server;

beforeAll((done) => {

  app.use((req, res, next) => {
        
    req.session.user = { id: '627b72eaf76a5b23e4a657e6', user: 'testUser' }; // Mock user data
    req.session.isAuthenticated = true;
    next();
  });
  
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

describe("API Tests", () => {

  describe("Event Controller and EJS Template Tests", () => {
  // Test for accessing the create event form
  it("should access the create event form", async () => {
    const res = await request(app).get("/events/create");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Create a New Event/);
  });

  // Test for form submission without all required fields
  it("should fail to create an event when required fields are missing", async () => {
    const incompleteEvent = {
      // Assuming title is a required field
      description: "Test event description",
      category: "professional development",
      date: "2023-05-01",
      location: "Test Location",
    };
    const res = await request(app).post("/events/create").send(incompleteEvent);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Failed creating the event/);
  });

  // Test for form submission all required fields
  it("should passs creating an event when required fields are filled", async () => {
    const  event = events[0];
    const res = await request(app).post("/events/create").send(event);
    expect(res.statusCode).toEqual(302);
    expect(res.text).toMatch(/Found. Redirecting to \/events/);
  });


  // Test for accessing the events list
  it("should access the list of events", async () => {
    const res = await request(app).get("/events");

    expect(res.statusCode).toEqual(200);
    expect(res.text).toMatch(/Upcoming Events/);
  });


  // Test for updating an existing event
  it("should update an existing event", async () => {
    const eventId = events[0]._id;
    const updatedEventPayload = {
      category: "campus events",
    };

    const res = await request(app)
      .post(`/events/${eventId}/update`)
      .send(updatedEventPayload);

    expect(res.statusCode).toEqual(302); // redirecting to event details page
    // Additional assertions as necessary
  });

  // Test for event RSVP
  it("should RSVP to an event", async () => {
    const eventId = events[0]._id;

    res = await request(app)
      .post(`/events/${eventId}/rsvp`)
      .send({ response: "attending" });

    expect(res.statusCode).toEqual(302); // redirect to event details page
    // Additional assertions as necessary
  });

  // Test for retrieving event details
  it("should retrieve event details", async () => {
    let eventId = events[0]._id;
    const res = await request(app).get(`/events/${eventId}`);

    expect(res.statusCode).toEqual(200); // Successful access
    // expect(res.text).toMatch(/Event Details/); // Check for event details in response
  });
});


  // Test for accessing the edit event form with an existing event
  it("should access the edit event form for an existing event", async () => {
    const eventId = events[0]._id;
    const res = await request(app).get(`/events/${eventId}/update`);
    expect(res.statusCode).toEqual(302);
    expect(res.text).toMatch(/Found. Redirecting to \/events/);
  });


  // Test for 404 on accessing edit event form with a non-existent event
  it("should return 404 for edit event form with a non-existent event", async () => {
    const nonExistentEventId = '5f9d5c6a0f1b5e1f3c9d6c9a'

    const res = await request(app).post(`/events/${nonExistentEventId}/update`);
    expect(res.statusCode).toEqual(404);
    //expect(res.text).toMatch(/It seems you're lost in memories./);
  });

  // Test for delete event
  it("should delete an event", async () => {
    const eventId = events[0]._id;
    const res = await request(app).post(`/events/${eventId}/delete`);
    expect(res.statusCode).toEqual(302); // Redirects after deletion
  });

  // Test for 404 on deleting a non-existent event
  it("should return 404 for deleting a non-existent event", async () => {
    const nonExistentEventId = new mongoose.Types.ObjectId();
    const res = await request(app).post(`/events/${nonExistentEventId}/delete`);
    expect(res.statusCode).toEqual(404);
  });
});
