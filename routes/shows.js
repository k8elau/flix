//everything here is accessed with shows/_____ (eg localhost:8888/shows/add) because the file name is shows.js

var express = require('express');
var router = express.Router();

var path = require('path');
//used for image
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local');
//creates the uploads folder for you
var uploadPath = path.join(__dirname, '../public/uploads');
//puts stuff getting uploaded in public folder
var upload = multer({ dest: uploadPath});
var Show = require('../models/show');
var User = require('../models/user');
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//when you go to 'shows/add', it renders new-show.handlebars view
router.get('/add', function(req, res){
    res.render('new-show');
});


//if you're posting something on the /add (aka pressing submit button), this thing happens
router.post('/add', upload.single('image'), function(req,res){
   var show = new Show({
      show_name: req.body.show_name,
      genre: req.body.genre,
      year_released: req.body.year_released,
      imageFilename:req.file.filename,
      description:req.body.description
   }); 
   
    show.save(function(err, data){
        //if there's an error in saving the shows do the redirect
        if(err){
            //returns so nothing else happens
            return res.redirect(303, '/shows');
        }
        //for redirect you use msg number 303
        //this redirects to the shows VIEWS page
        return res.redirect(303, '/shows');
    });
});


router.get('/sign-up', function(req,res){
    res.render('sign-up')
});

router.post('/sign-up', function(req,res){
    var newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, function(err, user){
        console.log('signup error:', err);
    });
    passport.authenticate('local')(req, res, function(){
        res.send('Welcome ' + req.body.name);
    })
});


router.get('/login', function(req,res){
    res.render('login')
});

router.post('/login', passport.authenticate('local'), function(req, res, next){
    res.send('Welcome back ' + req.body.name);
});


//this is what the main page of the website would be 
router.get('/', function(req, res){
    var query = {};
    //if you did something like localhost:8888/shows?genre=horror, horror would be the query
    if (req.query.genre){
        query = {genre: req.query.genre};
    }
    
    Show.find(query, function(err, data){
        var pageData = {
            shows: data
        };
        //renders the shows view, and then passes in shows array from the database(?)
        //render the SHOWS VIEW with pageData
        res.render('shows', pageData);
    });
});


 //http://localhost:8888/shows?genre=comedy&genre=drama gets shows that are BOTH comedy and drama, while http://localhost:8888/shows?genre=comedy&drama gets shows that are comedy, or drama, or both.
//this would be an individual show info page, because all shows have different slugs
router.get('/:show_name', function(req, res){
    Show.findOne({slug: req.params.show_name}, function(err, data){
        var pageData = {
            shows: [data]
        };
        //you could also render a more detailed page (view) about that show
        //res.send(pageData);
        res.render('show-slug', pageData);
    });
});


module.exports = router;