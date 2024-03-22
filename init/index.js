const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing=require('../Models/listings.js');


mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB.', err));



const initDb=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);


}

initDb();