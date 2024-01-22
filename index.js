const express = require('express');
// const emailRoutes = require('./routes/email.route.js');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
const { config } = require('dotenv');
const client = require('./utils/db/index.js');

config();
const app = express();

app.use(express.json());
 
app.use(express.json());
app.use(cors());
client.connect();
  
// app.use(cookieParser());
// app.use("/api/employees", employeeRoutes);
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
app.listen(5000, () => {
    console.log("API working!");
  });