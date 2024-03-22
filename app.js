const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing=require('../MONGO3/Models/listings.js')
const app = express();
const port = 8081;
const methodOverride = require('method-override')
const engine = require('ejs-mate')


mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB.', err));




// Set views and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));



app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render('../views/listings/index.ejs', { allListing });
        
})


app.get("/listings/new",(req,res)=>{
  console.log("HII")
  res.render("../views/listings/new.ejs")
})


app.post("/listings",async (req,res)=>{
  const newlisting=new Listing(req.body);
  newlisting.save();
  const allListing=await Listing.find({});
  res.render("../views/listings/index.ejs", { allListing })

})

app.get("/listings/:id",async (req,res)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  console.log(listing)
  res.render("../views/listings/show.ejs",{listing});
})

app.get("/listings/:id/edit",async(req,res)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  console.log("Not Working")
  res.render("../views/listings/edit.ejs",{listing});
})
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  // Assuming req.body.listing holds the updated values for the listing, including the image URL as a string
  const updatedData = req.body.listing;
  await Listing.findByIdAndUpdate(id, updatedData, { new: true }); // Add { new: true } to get the updated document
  res.redirect("/listings/" + id); // Redirect to show the updated listing
});


app.delete("/listings/:id",async(req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings")
})
// Start server
app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});
