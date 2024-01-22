const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const client = require('./utils/db/index.js');
const authRoutes = require('./routes/auth.route.js');
config();
const bcrypt = require('bcryptjs');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
app.use(express.json());
 
app.use(express.json());
app.use(cors());
app.use(cookieParser());
client.connect();
 
// app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.get('/users', (req, res)=>{
    client.query(`Select * from testings`, (err, result)=>{
        if(!err){
            console.log(result.rows)
            res.send(result.rows);
        }
        console.log(err);
    });
    client.end;
})

app.post('/users', (req, res)=> {
    const user = req.body;
    let insertQuery = `insert into testings(id, name) 
                       values(${user.id}, '${user.name}' )`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})
 
app.get('/', (req, res) => {
    res.send('DPAS server is running');
  });
app.listen(port, () => {
    console.log("API working!");
  });