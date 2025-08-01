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

  try {
    console.log("📦 ENV vars:", GEO_USERNAME, GEO_PASSWORD);
    console.log("🎟️ Requesting token for ticket:", ticket);

    // Step 1: Get the token
    const tokenRes = await axios.post(API_TOKEN_URL, {
      username: GEO_USERNAME,
      password: GEO_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = tokenRes.data.token;
    console.log("🔑 Retrieved token:", token);

    // Step 2: Use token to get ticket responses
    const responseRes = await axios.get(`${API_RESPONSE_URL}${ticket}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("📄 Successfully retrieved ticket responses");
    res.json(responseRes.data);

  } catch (error) {
    console.error('❌ Error retrieving responses:', error.message);
    if (error.response) {
      console.error('↪ Response data:', error.response.data);
    }
    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
