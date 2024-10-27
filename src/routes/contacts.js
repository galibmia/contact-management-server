const express = require('express');
const verifyToken = require('../middleware/auth');
const {
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactsController');

function createContactRoutes(contactsCollection) {
  const router = express.Router();

  router.get('/', verifyToken, (req, res) => getAllContacts(req, res, contactsCollection));
  router.post('/', verifyToken, (req, res) => addContact(req, res, contactsCollection));
  router.put('/:id', verifyToken, (req, res) => updateContact(req, res, contactsCollection));
  router.delete('/:id', verifyToken, (req, res) => deleteContact(req, res, contactsCollection));

  return router;
}

module.exports = createContactRoutes;
