const ejs = require("ejs");
const path = require("path");

const Event = require("../models/event");
const RSVP = require("../models/rsvp");
const mongoose = require("mongoose");
const { render404 } = require("../utils/custom_responses");

exports.getEvents = async (req, res) => {
  const isAuthenticated = req.session.isAuthenticated;

  console.log("req.locals", req.locals, res.locals);
  const eventsQuery = isAuthenticated ? {} : { visibility: "public" };

  const page = parseInt(req.query.page) || 1; // Current page number, default is 1
  const limit = 10; // Number of events per page
  const skip = (page - 1) * limit; // Number of events to skip

  const totalEvents = await Event.countDocuments(eventsQuery);
  const totalPages = Math.ceil(totalEvents / limit);
  const events = await Event.find(eventsQuery).skip(skip).limit(limit);

  events.forEach((event) => {
    event.isOrganizer =
      isAuthenticated &&
      event.organizerId.toString() === req.session.user.id.toString();
  });

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "events.ejs"),
    { ...res.locals, events, page, totalPages }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.createOrUpdateEvent = async (req, res) => {

  let event = null;
  let message = null;

  //if the ID is present, then we are updating an existing event
  if (req.params.id) {
    event = await Event.findById(new mongoose.Types.ObjectId(req.params.id));

    if (!event) return render404(res, 'Event not found');

    if (req.method === "POST") {

      event = Object.assign(event, req.body);

      await event.save();
      return res.redirect(`/events`);
    }
  }

  if (req.method === "POST") {
    try {
      const payload = req.body;
      payload.organizerId = req.session.user.id;

      event = new Event(payload);
      await event.save();
      message = "Event created successfully";
      // redirect to events page
      return res.redirect("/events");
    } catch (error) {
      message = `Failed creating the event ${error.message} ${req.session.user}`;
      console.log("error: ", error);
    }
  } 
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "events-create.ejs"),
    { ...res.locals, message, event }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.getEvent = async (req, res) => {
  const event = await Event.findById(
    new mongoose.Types.ObjectId(req.params.id)
  );
  if (!event) return render404(res, 'Event not found');;

  let isOrganizer = false;
  let participants = null;

  if (event.organizerId.toString() === req.session?.user?.id.toString()) {
    isOrganizer = true;
  }

  if (isOrganizer || req.session.user?.role === "admin") {
    participants = await RSVP.aggregate([
      {
        $match: {
          eventId: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "user._id": 1,
          "user.email": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          response: 1,
        },
      },
    ]);
  }

  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "event.ejs"),
    { ...res.locals, event, participants, isOrganizer }
  );

  res.render("partials/layout", {
    body: content,
  });
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (deleted) {
      return res.redirect("/events");
    }

    return render404(res, 'Event not found');;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
