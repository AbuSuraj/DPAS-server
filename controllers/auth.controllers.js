const bcrypt = require('bcryptjs');
const client = require('../utils/db/index.js'); 

exports.register = (req, res) => {
  // CHECK IF USER ALREADY EXISTS
  const checkUserQuery = 'SELECT * FROM users WHERE name = $1';
  
  client.query(checkUserQuery, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    
    if (data.length) {
      return res.status(409).json("User already exists!");
    }
    
    // CREATE A NEW USER
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const createUserQuery = 'INSERT INTO users ( name, role, email, password) VALUES ($1, $2, $3, $4)';
    const values = [ req.body.name, req.body.role, req.body.email,hashedPassword];

    client.query(createUserQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};
