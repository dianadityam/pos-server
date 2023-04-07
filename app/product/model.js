const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema({

    name: {
        type: String,
        minlength: [3, 'Name must contain at least 3 characters']
    },

    description: {
        type: String,
        maxlength: [1000, 'Description contain at most 1000 characters']
    },

    price: {
        type: Number,
        default: 0
    },

    image_url: String,

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },

    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }]

}, { timestamps: true });

module.exports = model('Product', productSchema);