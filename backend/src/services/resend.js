// /backend/services/resend.js
const { Resend } = require('resend');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });  // Load environment variables from .env

// Initialize Resend with the API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Export the resend instance
module.exports = resend;
