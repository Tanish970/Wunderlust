module.exports.isLoggedin=(req,res,next)=>{
    if (!req.isAuthenticated()){
        req.flash("failure","You must be signed to create a listing")
        return res.redirect("/signin")
      }
      console.log("In")
      next()
}