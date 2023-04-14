require('dotenv').config();
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fallbackDB"

const connectToMongo = ()=>{
    mongoose.connect(MONGO_URI).then(()=>{console.log(`Connected to MongoDB (${MONGO_URI}) successfully...`)
    }, (err)=>{
        console.log(`Error: couldn't connect to mongoDB ${err}`)
        
    })
}

module.exports = connectToMongo;