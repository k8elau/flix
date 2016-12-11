var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function(app, options){
    return{
        init: function(){
            passport.use(new LocalStrategy(User.authenticate()));
            //describes how Passport should store and find user data
            //from the session cookie
            passport.serializeUser(function(user, done){
                done(null, user._id);
            });
            passport.deserializeUser(function(id, done){
                User.findById(id, function(err, user){
                    if(err || !user) return done(err, null);
                    done(null, user);
                });
            });
            //app initializes passport and creates a session out of user data
            app.use(passport.initialize());
            app.use(passport.session());
            //allows us to display the username 
            app.use(function(req, res, next){
                res.locals.user = req.user;
                next();
            });
        },
        
        registerRoutes:function(){
            app.get('/sign-up', function(req,res){
            res.render('sign-up');
        });

app.post('/sign-up', function(req, res, next){
    var newUser = new User({
        username: req.body.username
    });
    
    //User.register is a passportLocalMongoose function
    //adds salt and hash and then it is added to the database
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log('signup error!', err);
            return res.render('sign-up');
        }
        //site currently doesn't go anywhere after you sign up (Even if you sign up successfully)
    passport.authenticate('local')(req, res, function(){
        console.log('success!');
        res.redirect('/shows');
    });
    });
});


app.get('/login', function(req,res){
    res.render('login');
});

//logging in wrong doesn't work yet (tell it what to do if it doesn't work!)
app.post('/login', 
        passport.authenticate('local'), 
            function(req, res, done){
    res.redirect('/shows');
    //IT WORKS!!!!
});
            
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/shows');
})
        }
    };
};


