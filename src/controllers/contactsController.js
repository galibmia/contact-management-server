const { ObjectId } = require('mongodb');

async function getAllContacts(req, res, contactsCollection) {
  const result = await contactsCollection.find().toArray();
  res.send(result);
}

async function addContact(req, res, contactsCollection) {
  const contactInfo = req.body;

  const existingContact = await contactsCollection.findOne({ email: contactInfo.email });
  if (existingContact) {
    return res.status(400).send({ message: "Email already exists" });
  }

  const result = await contactsCollection.insertOne(contactInfo);
  res.send(result);
}

async function updateContact(req, res, contactsCollection) {
  const id = req.params.id;
  const updatedContact = req.body;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: updatedContact };

  const result = await contactsCollection.updateOne(filter, updateDoc);
  res.send(result);
}

async function deleteContact(req, res, contactsCollection) {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  const result = await contactsCollection.deleteOne(filter);
  res.send(result);
}

module.exports = {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
};
