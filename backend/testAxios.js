const axios = require('axios');

axios.get('http://localhost:8080/')
  .then(res => console.log('Axios response:', res.data))
  .catch(err => console.error('Axios error:', err));
