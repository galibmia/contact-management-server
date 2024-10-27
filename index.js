const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret Key
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jedysg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from header
  if (!token) {
    return res.sendStatus(403); // Forbidden if no token
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = decoded;
    next();
  });
};

// Route to generate a token
app.get('/generate-token', (req, res) => {
  const token = jwt.sign({ data: 'trusted-user' }, JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

// Main function to connect to MongoDB and define API routes
async function run() {
  try {
    await client.connect();
    const contactsCollection = client.db('cmaDB').collection('contacts');

    // Get all contacts (Protected Route)
    app.get('/contacts', verifyToken, async (req, res) => {
      const result = await contactsCollection.find().toArray();
      res.send(result);
    });

    // Add a new contact (Protected Route)
    app.post('/contacts', verifyToken, async (req, res) => {
      const contactInfo = req.body;

      // Check if the email already exists
      const existingContact = await contactsCollection.findOne({ email: contactInfo.email });
      if (existingContact) {
        return res.status(400).send({ message: "Email already exists" });
      }

      const result = await contactsCollection.insertOne(contactInfo);
      res.send(result);
    });

    // Update a contact (Protected Route)
    app.put('/contacts/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedContact = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedContact };

      const result = await contactsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete a contact (Protected Route)
    app.delete('/contacts/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const result = await contactsCollection.deleteOne(filter);
      res.send(result);
    });

    // Verify connection to MongoDB
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

// Initialize the MongoDB connection and start the server
run().catch(console.dir);

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Server is Running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
