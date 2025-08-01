import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
const API_TOKEN_URL = 'https://geocall.arkonecall.com/api/account/token';
const API_RESPONSE_URL = 'https://geocall.arkonecall.com/detail/ticketdefault?numbers=';

const { GEO_USERNAME, GEO_PASSWORD } = process.env;

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: 'Ticket number is required.' });
  }

  try {
    console.log(`📨 Requesting token using: ${GEO_USERNAME} / [hidden password]`);

    const tokenResponse = await axios.post(API_TOKEN_URL, {
      username: GEO_USERNAME,
      password: GEO_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = tokenResponse.data.token;
    console.log('🔑 Received token:', token);

    const response = await axios.get(`${API_RESPONSE_URL}${ticket}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Member responses retrieved successfully.');
    res.json(response.data);

  } catch (error) {
    console.error('❌ Error retrieving responses:', error.response?.status, error.response?.data);
    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
