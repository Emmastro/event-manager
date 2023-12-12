const ejs = require("ejs");
const path = require("path");

const Event = require("../models/event");
const RSVP = require("../models/rsvp");
const mongoose = require("mongoose");

exports.getEvents = async (req, res) => {

  console.log("getEvents");
  const isAuthenticated = req.session.isAuthenticated;
  
  const eventsQuery = isAuthenticated ? {} : { visibility: "public" };
  const events = await Event.find(eventsQuery).limit(3);

  events.forEach((event) => {
    if (isAuthenticated){
        if (event.organizerId.toString() === req.session.user.id.toString()) {
            event.isOrganizer = true;
          }
    }
    else{
        event.isOrganizer = false;
    }
    
  });
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "events.ejs"),
    { events }
  );

  res.render("partials/layout", {
    body: content,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.createOrUpdateEvent = async (req, res) => {

  console.log("createOrUpdateEvent");
  if (!req.session.isAuthenticated) {

    return res.redirect("/auth/login?next=/events/create");
  }

  console.log("authenticated");
  let message = null;
  if (req.method === "POST") {
    try {
      const payload = req.body;
      console.log("payload: ", payload);
      payload.organizerId = req.session.user.id;

      const event = new Event(payload);
      await event.save();
      message = "Event created successfully";
      // redirect to events page
      return res.redirect("/events");
    } catch (error) {
      message = `Failed creating the event ${error.message} ${req.session.user}`;
    }
  }
  const content = await ejs.renderFile(
    path.join(__dirname, "..", "views", "events-create.ejs"),
    { message }
  );
  res.render("partials/layout", {
    body: content,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.getEvent = async (req, res) => {

    console.log("event Id: ",req.params.id)
  const event = await Event.findById(new mongoose.Types.ObjectId(req.params.id));
  if (!event) return res.status(404).json({ message: "Event not found" });

  let isOrganizer = false;
  let participants = null;

  const isAuthenticated = req.session.isAuthenticated;

  if (!isAuthenticated) {
    return res.redirect("/auth/login?next=/events/create");
  }
  if (event.organizerId.toString() === req.session?.user?.id.toString()) {
    isOrganizer = true;
  }

  if (isOrganizer || req.session.user.role === "admin") {
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
    { event, participants, isOrganizer }
  );

  res.render("partials/layout", {
    body: content,
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (deleted) {
      return res.status(200).send("Event deleted");
    }
    throw new Error("Event not found");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
