const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./config/db');
const createContactRoutes = require('./routes/contacts');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Generate token route
app.get('/generate-token', (req, res) => {
  const token = jwt.sign({ data: 'trusted-user' }, JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

(async () => {
  const db = await connectDB();
  const contactsCollection = db.collection('contacts');

  // Use contacts routes
  app.use('/contacts', createContactRoutes(contactsCollection));

  app.get('/', (req, res) => {
    res.send('Server is Running');
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
