const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Replace with your actual API key and external user ID
const apiKey = '<replace_api_key>';
const externalUserId = '<replace_external_user_id>';

app.use(express.static('public'));
app.use(express.json());

// Function to create a chat session
async function createChatSession() {
  try {
    const response = await axios.post(
      'https://api.on-demand.io/chat/v1/sessions',
      {
        pluginIds: [],
        externalUserId: externalUserId
      },
      {
        headers: {
          apikey: apiKey
        }
      }
    );
    return response.data.data.id; // Extract session ID
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

// Function to submit a query
async function submitQuery(sessionId, query) {
  try {
    const response = await axios.post(
      `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
      {
        endpointId: 'predefined-openai-gpt4o',
        query: query,
        pluginIds: ['plugin-1712327325', 'plugin-1713962163'],
        responseMode: 'sync'
      },
      {
        headers: {
          apikey: apiKey
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting query:', error);
    throw error;
  }
}

// Route to handle chat session and query submission
app.post('/api/chat', async (req, res) => {
  const { userQuery } = req.body;

  try {
    const sessionId = await createChatSession();
    const queryResponse = await submitQuery(sessionId, userQuery);
    res.json(queryResponse);
  } catch (error) {
    res.status(500).send('Error processing query');
  }
});

// Serve the front-end HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
