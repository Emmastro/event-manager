const request = require('supertest');
const mongoose = require('mongoose');
const events = require('./data/events.json');
const app = require('../app');
let server;


beforeAll(done => {
  server = app.listen(3000, () => {
    global.agent = request.agent(server);
    done();
  });
});

afterAll(done => {
    if (server) {
        return server.close(done);
    }
});

describe('API Tests', () => {

    // Test for accessing the events list
    it('should access the list of events', async () => {
    const res = await request(app)
        .get('/events');

    expect(res.statusCode).toEqual(200);
    // expect(res.text).toMatch(/Events List/);
  });

  it('should create a new event', async () => {
      const res = await request(app)
          .post('/events/create')
          .send(events[0]);
      console.log("created new event. res: ", res.text);
      expect(res.statusCode).toEqual(302); // redirects to event details page
      // expect(res.headers['location']).toMatch(/\/events/); // Redirects to events page
  });

     // Test for updating an existing event
     it('should update an existing event', async () => {
      const eventId = events[0]._id;
      const updatedEventPayload = {
        "category": "new category",
      };
      
      console.log(`URL: /events/${eventId}/update`);
      const res = await request(app)
          .post(`/events/${eventId}/update`)
          .send(updatedEventPayload);

      expect(res.statusCode).toEqual(200);
      // Additional assertions as necessary
  });

      // Test for event RSVP
      it('should RSVP to an event', async () => {
        const eventId = events[0]._id;

        res = await request(app)
            .post(`/events/${eventId}/rsvp`)
            .send({ response: 'attending' });

        expect(res.statusCode).toEqual(302); // redirect to event details page
        // Additional assertions as necessary
    });


  // Test for retrieving event details
  it('should retrieve event details', async () => {

    let eventId = events[0]._id;
    console.log(`/events/${eventId}`);
    const res = await request(app)
        .get(`/events/${eventId}`);


    expect(res.statusCode).toEqual(200); // Successful access
    // expect(res.text).toMatch(/Event Details/); // Check for event details in response
});

});



