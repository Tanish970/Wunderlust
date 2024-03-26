const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('/workspaces/Wunderlust/Models/listings.js'); // Assuming this is the correct path

const initDb = async () => {
  await Listing.deleteMany({}); // Clears the existing listings
  await Listing.insertMany(initData.data); // Inserts new listings
  console.log('Database initialized with data!');
};

mongoose.connect('mongodb+srv://rohithguntur:test123@cluster0.3xgqumk.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    initDb().then(() => {
      mongoose.disconnect(); // Cleanly disconnect after initialization
    });
  })
  .catch(err => console.error('Could not connect to MongoDB Atlas.', err));
