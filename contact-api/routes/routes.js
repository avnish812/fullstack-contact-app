// routes/contactsRoutes.js
const express = require('express');
const multer = require('multer');
const contactsController = require('../controllers/contacts.controller');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/upload', upload.single('file'), contactsController.uploadContacts);
router.post('/addcontacts', contactsController.addContacts);
router.get('/contacts', contactsController.getContacts);
router.put('/:id', contactsController.updateContact);
router.post('/delete', contactsController.deleteContacts);

module.exports = router;
