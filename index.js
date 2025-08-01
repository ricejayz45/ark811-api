import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = 10000;

// Replace this with the known working token from ReqBin
const KNOWN_GOOD_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // <== full token here

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;
  if (!ticket) return res.status(400).json({ error: 'Ticket number is required.' });

  try {
    const response = await axios.get(`https://geocall.arkonecall.com/detail/ticketdefault?numbers=${ticket}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': KNOWN_GOOD_TOKEN
      }
    });

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
