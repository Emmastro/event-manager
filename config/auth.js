require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

module.exports = {
    JWT_SECRET,
    SESSION_SECRET,
    SENDGRID_KEY
    };