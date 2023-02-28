const mongoose = require('mongoose');
const {model, Schema} = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'processing'],
        default: 'waiting_payment'
    },

    delivery_fee: {
        type: Number,
        default: 0
    },

    delivery_adress: {
        provinsi: { type: String, required: [true, 'provinsi must be field'] },
        kota: { type: String, required: [true, 'kota must be field'] },
        kecamatan: { type: String, required: [true, 'kecamatan must be field'] },
        kelurahan: { type: String, required: [true, 'kelurahan must be field'] },
        detail: { type: String }
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    order_items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderItem'
        }
    ]


}, {timestamps: true});

orderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});
orderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0);
});
orderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((total, item) => total += (item.price * item.qty), 0);
    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total + this.delivery_fee),
        delivery_adress: this.delivery_adress
    });
    await Invoice.save();
});

module.exports = model('Order', orderSchema);