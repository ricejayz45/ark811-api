const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const USERNAME = 'agrlocates@gmail.com';
const PASSWORD = 'Oilfield12!';

app.post('/get-responses', async (req, res) => {
  const { ticket } = req.body;
  if (!ticket) return res.status(400).json({ error: 'Ticket number is required.' });

  try {
    const loginResponse = await axios.post(
      'https://geocall.arkonecall.com/api/account/token',
      { username: USERNAME, password: PASSWORD },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const token = loginResponse.data.token;

    const response = await axios.get(
      `https://geocall.arkonecall.com/detail/ticketdefault?numbers=${ticket}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to retrieve responses',
      details: err.response?.data || err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
