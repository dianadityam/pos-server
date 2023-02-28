const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let categorySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Name must contain at least 3 characters'],
        maxlength: [20, 'Description contain at most 20 characters'],
        required: [true, 'Category name must be field']
    }
});

module.exports = model('Category', categorySchema);