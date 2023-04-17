require('dotenv').config();
const connectTOMongo = require('./db');
const express = require('express');

const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

// connecting to mongoDB
connectTOMongo();

app.use(cors())
app.use(express.json())
app.get('/', (req, res)=>{
    res.status(200).send('welcome to texty backend')
})
app.use('/api/auth', require('./routes/auth'))

app.listen(port, ()=>{
    console.log(`listening at port ${port}`);
    
})