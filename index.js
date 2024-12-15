const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

const WEATHER_API_KEY  = "835d2072fcf14599a23235539241312";
const DEFAULT_LOCATION = 'Riyadh';
const BASE_URL = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=`;

/**
 * HTTP function that supports CORS requests
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('weather', async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
  } else if (req.method === 'GET') {
    await handleGetRequest(req, res);
  } else {
    res.status(405).send("Only GET method is allowed");
  }
});

// Set CORS headers
const setCorsHeaders = (res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Max-Age', '3600');
};

// Handle GET request
const handleGetRequest = async (req, res) => {
  const location = req.query.location || DEFAULT_LOCATION;
  const apiUrl = `${BASE_URL}${location}`;

  try {
    const response = await axios.get(apiUrl);
    res.status(200).send(response.data);
  } catch (err) {
    res.status(500).send(`Error getting weather data: ${err.message}`);
  }
};
