const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const invoiceSchema = Schema({
    sub_total: {
        type: Number,
        required: [true, 'sub_total must be field']
    },

    delivery_fee: {
        type: Number,
        required: [true, 'delivery_fee must be field']
    },

    delivery_adress: {
        provinsi: { type: String, required: [true, 'provinsi must be field'] },
        kota: { type: String, required: [true, 'kota must be field'] },
        kecamatan: { type: String, required: [true, 'kecamatan must be field'] },
        kelurahan: { type: String, required: [true, 'kelurahan must be field'] },
        detail: { type: String }
    },

    total: {
        type: Number,
        required: [true, 'total must be field']
    },

    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {timestamps: true});

module.exports = model('Invoice', invoiceSchema);