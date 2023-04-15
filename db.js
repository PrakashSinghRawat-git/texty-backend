require('dotenv').config();
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fallbackDB"

const connectToMongo = ()=>{
    mongoose.connect(MONGO_URI).then(()=>{console.log(`Connected to MongoDB successfully...`)
    }, (err)=>{
        console.log(MONGO_URI);
        
        console.log(`Error: couldn't connect to mongoDB ${err}`)
        
    })
}

module.exports = connectToMongo;