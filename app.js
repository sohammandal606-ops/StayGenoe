if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const Listing = require('./models/listing');

const listingRoutes = require("./routes/listings.js");
const reviewRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const chatRoutes = require("./routes/chat.js");

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

// App Config
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session & Flash
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        touchAfter: 24 * 3600
    }),
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user already exists with this googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Check if email is already registered (local account) — link Google to it
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // 3. Create a brand-new user from Google profile
        const baseUsername = profile.displayName
            ? profile.displayName.replace(/\s+/g, '_').toLowerCase()
            : profile.emails[0].value.split('@')[0];

        const newUser = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            username: baseUsername,
            image: { url: profile.photos[0] ? profile.photos[0].value : undefined }
        });
        await newUser.save();
        return done(null, newUser);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.use('/chat', chatRoutes);

app.get('/', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
});

// Error Handling
app.all('*', (req, res, next) => {
    next(new Error('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    let message = err.message;
    if (!message) {
        if (typeof err === 'string') message = err;
        else message = 'Oh No, Something Went Wrong!';
    }
    res.status(statusCode).render('error', { err: { message, stack: err.stack } });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
