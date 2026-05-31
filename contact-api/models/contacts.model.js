const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) {
                reject(err); 
            } else {
                resolve(result);
            }
        });
    });
};


const insertContacts = async (contacts) => {
    const queryStr = 'INSERT INTO contacts (name, email, phone, address) VALUES ?';
    const values = contacts.map(contact => [contact.name, contact.email, contact.phone, contact.address]);
    return await query(queryStr, [values]); 
};

const addContacts = async (contacts) => {
    const queryStr = 'INSERT INTO contacts (name, email, phone, address) VALUES  (?, ?, ?, ?)';
    const values = [contacts.name, contacts.email, contacts.phone, contacts.address];
    try{
        const result = await query(queryStr, values);
        return result
    }catch(err){
        throw new Error('Error inserting contacts: ' + err.message);
    }
};

const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM contacts WHERE email = ?', [email], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};


const getContacts = async (payload) => {
    const { page, limit, search, sortBy, sortOrder } = payload;
    const offset = (page - 1) * limit;
    const sanitizedSortBy = mysql.escapeId(sortBy);
    const queryStr = `
    SELECT * FROM contacts
    WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
    ORDER BY ${sanitizedSortBy} ${sortOrder}
    LIMIT ? OFFSET ?
  `;

    return await query(queryStr, [`%${search}%`, `%${search}%`, `%${search}%`, Number(limit), offset]);
};


const updateContact = async (id, { name, email, phone, address }) => {
    const queryStr = 'UPDATE contacts SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
    return await query(queryStr, [name, email, phone, address, id]);
};


const deleteContacts = async (ids) => {
    const queryStr = 'DELETE FROM contacts WHERE id IN(?)';
    return await query(queryStr, [ids]);
};


module.exports = {
    insertContacts,
    getContacts,
    updateContact,
    deleteContacts,
    checkEmailExists,
    addContacts
};
