const axios = require('axios');

async function fetchKnowledge(query) {
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`);
    console.log(response.data.extract);
  } catch (error) {
    console.error('Error fetching knowledge:', error.message);
  }
}

fetchKnowledge('Artificial_Intelligence');