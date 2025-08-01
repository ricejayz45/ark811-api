import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_TOKEN_URL = 'https://geocall.arkonecall.com/api/account/token';

const { GEO_USERNAME, GEO_PASSWORD } = process.env;

async function getTokenOnly() {
  try {
    console.log(`📨 Requesting token using: ${GEO_USERNAME} / [hidden password]`);

    const response = await axios.post(API_TOKEN_URL, {
      username: GEO_USERNAME,
      password: GEO_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = response.data.token;
    console.log('🔑 Token successfully retrieved:\n');
    console.log(`Bearer ${token}`);
  } catch (error) {
    console.error('❌ Failed to retrieve token:', error.response?.status || '', error.response?.data || error.message);
  }
}

getTokenOnly();
