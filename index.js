import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;
  if (!ticket) return res.status(400).json({ error: 'Ticket number is required.' });

  try {
    // Step 1: Get Token
    const tokenResponse = await axios.post(
      'https://geocall.arkonecall.com/api/account/token',
      {
        username: process.env.ARK_USERNAME,
        password: process.env.ARK_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const token = tokenResponse.data.token;

    // Step 2: Use Token to Fetch Ticket Info
    const response = await axios.get(
      `https://geocall.arkonecall.com/detail/ticketdefault?numbers=${ticket}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error('Error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: error?.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
