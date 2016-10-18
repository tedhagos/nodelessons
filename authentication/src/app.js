
// DONE: implement the user creation
// TODO: use an encryption  mechanism e.g. bcryptjs
// TODO: research other ways to encrypt data in db
// TODO: Use MongoDB
// TODO: work on the snippets github, specifically winston
// TODO: Complete the User Registration code
// TODO: Refactor the Express Setup, and separate the routes
// TODO: Investigate further the module exports
// TODO: Learn how to consume JSON in POST, test in PostMan
//
// MODULES --------------------------------------------------------------------
// 
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passutil = require('./lib/encrypt-decrypt.js');

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
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/testAuth');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required:true}
});

var User = mongoose.model('User', userSchema);



// EXPRESS SETUP -------------------------------------------------------------- 

const app = express();

app.use(express.static('src/public'));
app.use('/bower_components', express.static('bower_components'));
app.use(authenticate); // Use our authenticate middleware
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

// ROUTES ---------------------------------------------------------------------

app.post('/createuser', (req, res) => {
  musername = req.body.username;
  mpassword = req.body.password;

  var user = new User({
    username: musername,
    password: passutil.encrypt(mpassword)
  });

  user.save((err) => {
    if(err) {
      res.json({stat: err});
    }
    else {
      res.json({stat: 'Saved one user'});
    }
  });

});

app.post('/login', (req, res) => {

  // Here is the place where we check the username and password on the
  // database
  /*
  res.send({
    stat: "ok",
    username : req.user.username,
    isAdmin: (req.user.level === "admin")
  });
  */
  var musername = req.body.username;
  var mpassword = req.body.password;
  
  User.findOne({username:musername}, (err, record) => {
    if(err) {
      res.json(err);
    }
    else {
      res.json({stat: "musername access: " + passutil.decrypt(mpassword, record.password)});
      //res.json({username: record.username, password: record.password});
    }
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
