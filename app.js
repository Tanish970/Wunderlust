const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('/workspaces/Wunderlust/Models/listings.js'); // Adjust path as needed
const app = express();
const exec = require('child_process').exec;
const passport = require('passport');
const localStrategy = require("passport-local");
const port = 8081;
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const session = require('express-session');
const User = require('./Models/user.js');
const flash = require('connect-flash');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

// Replace with your MongoDB Atlas connection string
mongoose.connect('mongodb+srv://rohithguntur:test123@cluster0.3xgqumk.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB Atlas and using the wanderlust database!'))
  .catch(err => console.error('Could not connect to MongoDB Atlas.', err));

// Set views and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure")
  next();
});


app.get("/test",(req,res)=>{
  req.flash("failure","Testing Success")
  
  res.redirect("/listings")
})
app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render('../views/listings/index.ejs', { allListing });
        
})


app.get("/signup", (req, res) => {
  res.render('../views/users/signup.ejs');
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    console.log(registerUser);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
  } catch (e) {
    console.log("error")
    req.flash("error", e.message);
    res.locals.failure=flash("failure","Invalid Credentials")
    res.redirect("/signup");
  }
});

app.post("/signin", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("failure", "Invalid username or password");
      return res.redirect('/signin');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Loggedin");
      return res.redirect('/listings');
    });
  })(req, res, next);
});

app.get("/signin", (req, res) => {
  res.render('../views/users/signin.ejs');
});

app.get("/demouser", async(req,res)=>{
  const fakeUser = new User({
    email:"student@gmail.com",
    username:"delta-student",
  })
  let registeredUser=await User.register(fakeUser,"helloworld")
  res.send(registeredUser)
})


app.get("/listings/new",(req,res)=>{
  if (!req.isAuthenticated()){
    req.flash("failure","You must be signed to create a listing")
    return res.redirect("/signin")
  }
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
