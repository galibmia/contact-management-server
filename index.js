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

// Generate a token 
app.get('/generate-token', (req, res) => {
  const token = jwt.sign({ data: 'trusted-user' }, JWT_SECRET, { expiresIn: '1h' });
  res.send({ token });
});

async function run() {
  try {
    await client.connect();
    const contactsCollection = client.db('cmaDB').collection('contacts');

    // Get all contacts
    app.get('/contacts', verifyToken, async (req, res) => {
      const result = await contactsCollection.find().toArray();
      res.send(result);
    });

    // Add a new contact
    app.post('/contacts', verifyToken, async (req, res) => {
      const contactInfo = req.body;
      const result = await contactsCollection.insertOne(contactInfo);
      res.send(result);
    });

    // Update a contact 
    app.put('/contacts/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedContact = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updatedContact,
      };
      const result = await contactsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Delete a contact
    app.delete('/contacts/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await contactsCollection.deleteOne(filter);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

// Basic route
app.get('/', (req, res) => {
  res.send('Server is Running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
