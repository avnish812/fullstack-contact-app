
const contactsModel = require('../models/contacts.model');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { logErrors } = require('../utils/errorlogs');

const uploadContacts = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const contacts = xlsx.utils.sheet_to_json(sheet);
        const duplicateEmails = [];
        const invalidRows = [];

        // Validate each contact
        const checkExistingEmail = contacts.map(async (contact, index) => {
            const existingContact = await contactsModel.checkEmailExists(contact.email);
            if (existingContact.length > 0) {
                duplicateEmails.push({ row: index + 1, email: contact.email });
            }

            if (!contact.name || !contact.email || !contact.phone || !contact.address) {
                invalidRows.push({ row: index + 1, contact });
            }
        });

        await Promise.all(checkExistingEmail);
        if (duplicateEmails.length > 0 || invalidRows.length > 0) {
            const errorReportPath = logErrors(duplicateEmails, invalidRows);
            return res.status(400).json({
                message: 'There were errors in the uploaded file.',
                errorReport: `http://localhost:3000/error_logs/${errorReportPath}` 
            });
        }
        const result = await contactsModel.insertContacts(contacts.filter(contact => contact.name && contact.email && contact.phone && contact.address));
        res.status(200).json({ message: 'Contacts uploaded successfully', inserted: result.affectedRows });
    } catch (error) {
        console.error('Error processing Excel file:', error);
        res.status(500).json({ message: 'Error processing Excel file' });
    }
};


const getContacts = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'name',
        sortOrder = 'asc',
        email,
        name,
        city
    } = req.query;

    const validSortOrders = ['asc', 'desc'];

    // Validate the sort order
    if (!validSortOrders.includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sort order' });
    }

    // Create a filter object
    let filters = {};
    if (email) filters.email = email;    // If email is provided, apply filter
    if (name) filters.name = name;       // If name is provided, apply filter
    if (city) filters.city = city;       // If city is provided, apply filter

    try {
        // Fetch filtered or all contacts based on filters and pagination
        const results = await contactsModel.getContacts({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            filters   // Pass the filters to the model for filtering
        });

        const totalContacts = results.length;  // Assuming results contain the total count

        // Send response with filtered or all contacts
        res.status(200).json({ contacts: results, totalContacts });
    } catch (err) {
        console.error('Error retrieving contacts:', err);
        res.status(500).json({ message: 'Error retrieving contacts' });
    }
};

const addContacts = async(req,res)=>{
    // console.log(req)
    const contacts = req.body;
    try{
        const result = await contactsModel.addContacts(contacts)
        return res.status(200).json({
            message:'Contacts Added Successfully!',
            inserted:result.affectedRows
        })
    }catch (err){
        console.error('Error processing Excel file:', err);
        res.status(500).json({ message: 'ERROR adding contanct' });
    }
};

const updateContact = async (req, res) => {
    const contactId = req.params.id;
    const { name, email, phone, address } = req.body;

    try {
        const result = await contactsModel.updateContact(contactId, { name, email, phone, address });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ message: 'Error updating contact' });
    }
};


const deleteContacts = async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'No contacts to delete' });
    }
    try {
        const result = await contactsModel.deleteContacts(ids);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ message: 'Error deleting contact' });
    }
};

module.exports = {
    uploadContacts,
    getContacts,
    updateContact,
    deleteContacts,
    addContacts
};
