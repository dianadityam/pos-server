const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

let userSchema = Schema({

    full_name: {
        type: String,
        required: [true, 'Name must be field'],
        maxlength: [255, 'Description contain at most 255 characters'],
        minlength: [3, 'Name must contain at least 3 characters']
    },

    customer_id: {
        type: Number,
    },

    email: {
        type: String,
        required: [true, 'Email must be field']
    },

    password: {
        type: String,
        required: [true, 'Password must be field'],
        maxlength: [255, 'Description contain at most 255 characters']
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    token: [String]
}, {timestamp: true});

userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} not valid`);

userSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('User').count({email: value});
        return !count;
    } catch (err) {
        
    } 
}, attr => `${attr.value} registered`);

const HASH_ROUND = 10;
userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next()
});

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

module.exports = model('User', userSchema);