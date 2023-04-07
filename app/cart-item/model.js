const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'Product name must contain at least 5 characters'],
        required: [true, 'Product name must be field'],
    },

    qty: {
        type: Number,
        required: [true, 'Qty must be field'],
        min: [1, 'minimum of qty is 1'],
    },

    price: {
        type: Number,
        default: 0,
    },

    image_url: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
});

module.exports = model('CartItem', cartItemSchema);
