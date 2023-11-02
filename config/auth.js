require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
module.exports = JWT_SECRET;

