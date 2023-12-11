const request = require('supertest');
// const expect = require('chai').expect;

const events = require('./data/events.json');
const app = require('../index');
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


function sum(a, b) {
    return a + b;
  }

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});


// describe('API Tests', () => {
//   it('should create a new event', async () => {
//       const res = await request(app)
//           .post('/api/events')
//           .send(events[0]);

//       expect(res.statusCode).to.equal(404);
//       expect(res.body).to.have.property('title', events[0].title);

//   });

// });


// //       const res = await request(app)
// //         .post('/api/events')
// //         .send(eventData);

// //       expect(res.statusCode).toBe(201);
// //       expect(res.body).toHaveProperty('title', eventData.title);
// //       // ...other assertions...
// //     });

// //     it('should not create an event with missing required fields', async () => {
// //       const eventData = {
// //         // Missing title, date, etc.
// //         organizerId: 'validOrganizerId',
// //         description: 'Description for an incomplete event.',
// //       };

// //       const res = await request(app)
// //         .post('/api/events')
// //         .send(eventData);

// //       expect(res.statusCode).toBe(400);
// //       // ...other assertions...
// //     });
// //   });

// //   // Test Event Update Endpoint
// //   describe('PUT /api/events/:eventId', () => {
// //     it('should update the event with valid data', async () => {
// //       const eventId = 'validEventId'; // Replace with a valid ObjectId
// //       const eventData = {
// //         title: 'Updated Alumni Meetup Title',
// //         // ...other fields to update...
// //       };

// //       const res = await request(app)
// //         .put(`/api/events/${eventId}`)
// //         .send(eventData);

// //       expect(res.statusCode).toBe(200);
// //       expect(res.body).toHaveProperty('title', eventData.title);
// //       // ...other assertions...
// //     });
// //   });

// //   // Test RSVP Endpoint
// //   describe('POST /api/events/:eventId/rsvp', () => {
// //     it('should let a user RSVP to an event', async () => {
// //       const eventId = 'validEventId'; // Replace with a valid ObjectId
// //       const rsvp = {
// //         userId: 'validUserId', // Replace with a valid ObjectId
// //         response: 'attending',
// //       };

// //       const res = await request(app)
// //         .post(`/api/events/${eventId}/rsvp`)
// //         .send(rsvp);

// //       expect(res.statusCode).toBe(201);
// //       expect(res.body).toHaveProperty('userId', rsvp.userId);
// //       // ...other assertions...
// //     });
// //   });

// //   // Test Event Deletion Endpoint
// //   describe('DELETE /api/events/:eventId', () => {
// //     it('should delete the event if the user is authorized', async () => {
// //       const eventId = 'validEventId'; // Replace with a valid ObjectId

// //       const res = await request(app)
// //         .delete(`/api/events/${eventId}`)
// //         // You would also need to send an authentication header
// //         // .set('Authorization', `Bearer ${validToken}`)
// //         .send();

// //       expect(res.statusCode).toBe(200);
// //       // ...other assertions...
// //     });
// //   });

// //   // ...more tests for other endpoints...

// // });


// // describe('POST /api/users/register', () => {
// //   it('should register a new user with valid details', async () => {
// //     const res = await request(app)
// //       .post('/api/users/register')
// //       .send({
// //         email: 'testuser@example.com',
// //         password: 'Password123!',
// //         firstName: 'Test',
// //         lastName: 'User',
// //         graduationYear: 2020,
// //         major: 'Computer Science'
// //       });

// //     expect(res.statusCode).toEqual(201);
// //     expect(res.body).toHaveProperty('_id');
// //     expect(res.body.email).toEqual('testuser@example.com');
// //     // Add more assertions as necessary
// //   });

// //   it('should not register a user without required fields', async () => {
// //     const res = await request(app)
// //       .post('/api/users/register')
// //       .send({
// //         email: 'testuser@example.com'
// //         // missing other required fields
// //       });

// //     expect(res.statusCode).toEqual(400);
// //     // Assert on the error message as necessary
// //   });

// //   // Add more tests for other scenarios
// // });
