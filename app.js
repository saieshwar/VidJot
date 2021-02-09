const express = require('express');
const path = require('path');

const app  = express();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Load Routes

const ideas = require('./routes/ideas')
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);
//DB Config
const db = require('./config/database') 


//connect to mongoose
//mongodb+srv://sbobbili:Chintu@509216@vidjotcluster.5fapb.mongodb.net/dev?retryWrites=true&w=majority


mongoose.connect(db.mongoURI, 
    {useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
    }, (err) => {
        if(err) throw err;
        console.log("DB Connected :)");
    });



//handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  //Flash middleware
app.use(flash());


//Global Variables
app.use(function(req,res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    // console.log("=====" + req.user);

    next();
})

app.use(express.urlencoded({extended: true})); 
app.use(express.json());  

//static folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req,res)=>{
    const title = 'Welcome';
    res.render('index' , {
        title: title
    });
});

//About Route
app.get('/about' , (req,res) => {
    res.render('about');
})


//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});