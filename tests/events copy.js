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

describe('API Tests for unauthenticated users', () => {

        // Test for unsuccessful event creation due to lack of authentication
        it('should not create an event without authentication', async () => {
          const eventPayload = {
              // Event data
          };
  
          const res = await request(app)
              .post('/events/create')
              .send(eventPayload);
  
          expect(res.statusCode).toEqual(302); // Assuming redirection due to lack of authentication
          expect(res.headers['location']).toMatch(/\/auth\/login/); // Redirects to login page
      });
      
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

      expect(res.statusCode).toEqual(200);
      // expect(res.headers['location']).toMatch(/\/events/); // Redirects to events page
  });

//   // Test for retrieving event details
//   it('should retrieve event details', async () => {

//     let eventId = events[0]._id;
//     // convert eventId to a format for bson
//     // eventId = new mongoose.Types.ObjectId(eventId);
//     console.log(`/events/${eventId}`);
//     const res = await request(app)
//         .get(`/events/${eventId}`);


//     expect(res.statusCode).toEqual(200); // Successful access
//     expect(res.text).toMatch(/Event Details/); // Check for event details in response
// });

});



