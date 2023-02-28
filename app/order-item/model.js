const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const orderItemSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'Product name must contain at least 5 characters'],
        required: [true, 'product name must be field']
    },

    price: {
        type: Number,
        required: [true, 'price must be field']
    },

    qty: {
        type: Number,
        required: [true, 'quantity must be field'],
        min: [1, 'minimum quantity is 1']
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = model('OrderItem', orderItemSchema);