//Include express router
var express = require('express');
//Create router
var router = express.Router();
var User = require('../models/user');
var Pusher = require('pusher');
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/public/index.html'));
});

router.get('/homepage', function(req,res){
 res.sendFile(__dirname + '/homepage.html');
}); 

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice - registration
  if (req.body.password !== req.body.password2) {
    var err = new Error('Passwords do not match. Please try again.');
    err.status = 400;
    res.send("Passwords do not match. Please try again.");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.password2) {

    var userProfile = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
    }

    User.create(userProfile, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/homepage');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password. Please try again.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/homepage');
      }
    });
  } else {
    var err = new Error('All fields required. Please try again.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/homepage', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        }
      }
    });
});

// GET route for logout - return user to index page
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//Pusher App for live chat
var pusherChat = new Pusher({
  appId: '492694',
  key: '44854cb20b4f2aed58b0',
  secret: 'a731d6bddb992d3b2bc6',
  cluster: 'eu',
  encrypted: true
});


//Defined endpoint as /aqaComment where the comment will be sent by user using pusher
router.post('/aqaComment', function(req, res) {
  var comment = req.body.comment;
  pusherChat.trigger( 'aqa-chat', 'comment-added', { comment });
  res.sendStatus(200);
});



router.get('/pBox', function (req, res) {
     User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email)
        }
      })
    });




//Initialise pusher object for voting
var pusherPoll = new Pusher({
  appId: '506160',
  key: 'a36a12270741efa5f9fb',
  secret: '921a93c4ec1748d09042',
  cluster: 'eu',
  encrypted: true
});

//In polls route file - '/' means '/poll'
router.get('/poll', (req, res) => { 
  //Take vote model and find which gives us a promise
  //promise called votes will return success true and array votes inside of votes
  Vote.find().then(votes => res.json({success: true, 
    votes: votes}));
});  

//Post to '/poll'
router.post('/poll', (req, res) => {
  //create variable called to new vote, set it as a new object. 
  const newVote = {
    //sets answer to answer uses chooses when clicking the radio button before submitting their vote
    answer: req.body.answer,
    //one point represents one vote
    points: 1
  }
  //save vote to database which gives a promise back
  //inside promise it gives us the vote added to the database
  new Vote(newVote).save().then(vote => {
    //Pusher will trigger an event we sucsribe to on the front end and gets the points and answer
    pusherPoll.trigger('vote-poll', 'answer-vote', {
      points: parseInt(vote.points),
      answer: vote.answer
  });
    //return thank you for voting message
  return res.json({success: true, message: 'Thanks for voting'});
  });

  
});





module.exports = router;