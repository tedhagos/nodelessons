
// TODO: implement the user creation
// TODO: use an encryption  mechanism e.g. bcryptjs
// TODO: research other ways to encrypt data in db
// TODO: Use MongoDB
// TODO: work on the snippets github, specifically winston


// MODULES --------------------------------------------------------------------
// 
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;


// CREATE OUR OWN MIDDLEWARE -------------------------------------------------
function authenticate(req,res, next){

  // Right now, this is an in-memory way of setting the user
  // This is probably where you will check for the user against
  // a datastore e.g. MySQL or MongoDB or any other database
  
  var user = {
    username: "Ted",
    level: "admin"
  }
 
  // We could just hang the our newly created user object right on the 
  // request object. That way, subsequent route handlers should be able to
  // check if the req.user property is set, if it is not, then there is
  // no logged in user
  
  req.user = user;
  next();
}

// MONGOOSE and MODEL SETUP ------------------------------------------------------------
//
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required:true}
});

var User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost/testAuth');


// EXPRESS SETUP -------------------------------------------------------------- 

const app = express();
app.use(authenticate); // Use our authenticate middleware


// ROUTES ---------------------------------------------------------------------

app.get('/login', (req, res) => {

  // Here is the place where we check the username and password on the
  // database
  
  res.send({
    stat: "ok",
    username : req.user.username,
    isAdmin: (req.user.level === "admin")
  });
});

app.get('/author', (req, res) => {

  // CHECK IF USER IS LOGGED IN

  if(req.user) {
    res.send({
      stat: "ok",
      username : req.user.username,
      isAdmin: (req.user.level === "admin")
    });
  }
  else {
    res.status(500, {stat: 'Not Autenticated'});
    res.json({stat: "Not authenticated"});
  }

});

// START THE APPLICATION ------------------------------------------------------

app.listen(port, () => {
  console.log("Application Started");
});
