const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        // Check if user exists with same email (link account)
        const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
        if (existingEmailUser) {
            existingEmailUser.googleId = profile.id;
            existingEmailUser.avatar_url = profile.photos[0].value;
            await existingEmailUser.save();
            return done(null, existingEmailUser);
        }

        // Create new user
        const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            full_name: profile.displayName,
            avatar_url: profile.photos[0].value,
            organization: 'Google User' // Default org
        });

        await newUser.save();
        done(null, newUser);
    } catch (err) {
        done(err, null);
    }
}));
