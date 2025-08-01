import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GEO_USERNAME = process.env.GEO_USERNAME;
const GEO_PASSWORD = process.env.GEO_PASSWORD;

const API_TOKEN_URL = 'https://geocall.arkonecall.com/api/account/token';
const API_RESPONSE_URL = 'https://geocall.arkonecall.com/detail/ticketdefault?numbers=';

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;
  if (!ticket) return res.status(400).json({ error: 'Ticket number is required.' });

  console.log('📦 ENV vars:', GEO_USERNAME, GEO_PASSWORD ? '[hidden]' : 'MISSING');
  console.log('🎟️ Requesting token for ticket:', ticket);

  try {
    // Get auth token
    const tokenRes = await axios.post(API_TOKEN_URL, {
      username: GEO_USERNAME,
      password: GEO_PASSWORD
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fullToken = tokenRes.data.token;
    const truncatedToken = fullToken.split('.')[0]; // Take only the header portion of the JWT

    console.log('🔑 Full token:', fullToken);
    console.log('✂️ Truncated token used in header:', truncatedToken);

    // Use truncated token to get ticket responses
    const responseRes = await axios.get(`${API_RESPONSE_URL}${ticket}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${truncatedToken}`
      }
    });

    console.log('✅ Response received successfully.');
    res.json(responseRes.data);

  } catch (error) {
    console.error('❌ Error retrieving responses:', error.message);
    console.error('↪ Response data:', error.response?.data);
    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
