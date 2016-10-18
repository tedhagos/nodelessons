/*

   What have I learned here?

   It is extremely difficult for me to use hte middle ware technique to remember
   the user and use this remembering who is currently logged in.

   I probably can use the middle ware to enforce ACLs, but for remembering
   the user, I need to use sessions. or Passport
   
*/


const express = require('express');
const app = express();
const bodyparser = require('body-parser');

function login(req, res, next, user) {

  //var user = {
  //  username: 'ted',
  //  isAdmin: true
  //}
  req.user = user;
  next();
};

// app.use(login);
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('src/public'));
app.use('/bower_components', express.static('bower_components'))

app.post('/login', (req, res, next) => {
  var user = {
    username: req.body.username,
    password: req.body.password
  };
  console.log(user);
  req.user = user;
  res.json(user);
  login(req, res, next,user);
  //next();
  //res.json({stat: 'logged in ' + user.username }); this code is unreachable
});

app.get('/', login, (req, res) => {

  if(!req.user){
    res.json({stat: 'no logged in user'});
  }
  else {
    res.json({loggedInUser: req.user.username});
  }
});

app.get('/author', (req, res) => {
  res.json({
    loggedInUser: req.user.username,
    stat: 'ok'
  });
});

app.listen(3000, () => {
  console.log('App started');
});
