const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        default: null
    },
    image: {
        url: {
            type: String,
            default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
        },
        filename: String
    }
});

UserSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
