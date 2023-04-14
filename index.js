const connectTOMongo = require('./db');
const express = require('express');

const cors = require('cors');

const port = 5000;
const app = express();

// connecting to mongoDB
connectTOMongo();

app.use(cors())
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))

app.listen(port, ()=>{
    console.log(`listening at port ${port}`);
    
})