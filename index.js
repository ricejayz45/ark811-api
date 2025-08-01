import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const API_TOKEN_URL = 'https://geocall.arkonecall.com/api/account/token';
const API_RESPONSE_URL = 'https://geocall.arkonecall.com/detail/ticketdefault?numbers=';

const { PORT = 10000, GEO_USERNAME, GEO_PASSWORD } = process.env;

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: 'Ticket number is required.' });
  }

  console.log(`📨 Requesting token using: ${GEO_USERNAME} / [hidden password]`);
  console.log(`🎟️ Requesting token for ticket: ${ticket}`);

  try {
    // Step 1: Get Bearer Token
    const tokenRes = await axios.post(API_TOKEN_URL, {
      username: GEO_USERNAME,
      password: GEO_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = tokenRes.data.token?.trim();

    console.log(`🔑 Received token: ${token}`);

    // Step 2: Use Token to Retrieve Member Responses
    const responseRes = await axios.get(`${API_RESPONSE_URL}${ticket}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Member responses retrieved successfully.');
    res.json(responseRes.data);

  } catch (error) {
    const status = error.response?.status || 'unknown';
    const message = error.response?.data || error.message;
    console.error(`❌ Error retrieving responses: ${status} `);
    console.error('↪ Response data:', message);

    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
