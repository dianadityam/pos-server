const { Schema, model } = require('mongoose');

const deliveryAddressSchema = Schema(
    {
        alamat: {
            type: String,
            required: [true, 'Adress is required'],
            maxlength: [250, 'Adress contain at most 250 characters'],
        },

        kelurahan: {
            type: String,
            required: [true, 'Kelurahan is required'],
            maxlength: [250, 'Kelurahan contain at most 250 characters'],
        },

        kecamatan: {
            type: String,
            required: [true, 'Kecamatan is required'],
            maxlength: [250, 'Kecamatan contain at most 250 characters'],
        },

        kota: {
            type: String,
            required: [true, 'Kelurahan is required'],
            maxlength: [250, 'Kelurahan contain at most 250 characters'],
        },

        provinsi: {
            type: String,
            required: [true, 'Provinsi is required'],
            maxlength: [250, 'Provinsi contain at most 250 characters'],
        },

        detail: {
            type: String,
            maxlength: [1000, 'Adress contain at most 1000 characters'],
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: `User`,
        },
    },
    { timestamps: true }
);

module.exports = model('DeliveryAddress', deliveryAddressSchema);
