const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const store = async (req, res, next) => {
    try {
        let payload = req.body;

        if (payload.category) {
            let category = await Category.findOne({
                name: { $regex: payload.category, $options: 'i' },
            });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = { ...payload, tags: tags.map((tag) => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt =
                req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('close', async () => {
                try {
                    let product = new Product({ ...payload, image_url: filename });
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors,
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async () => {
                next(err);
            });
        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;

        if (payload.category) {
            let category = await Category.findOne({
                name: { $regex: payload.category, $options: 'i' },
            });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({ name: { $in: payload.tags } });
            if (tags.length) {
                payload = { ...payload, tags: tags.map((tag) => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt =
                req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = await Product.findById(id);
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    let payloadWithImage = {
                        ...payload,
                        image_url: filename,
                    };

                    product = await Product.findByIdAndUpdate(id, payloadWithImage, {
                        new: true,
                        runValidators: true,
                    });
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors,
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async () => {
                next(err);
            });
        } else {
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true,
            });
            return res.json(product);
        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            res.json({
                error: 1,
                message: err.message,
                fields: err.errors,
            });
        }
        next(err);
    }
};

const index = async (req, res, next) => {
    try {
        let { q = '', category = '', tags = [] } = req.query;
        const pageSize = 9;
        const page = parseInt(req.query.page || 0);

        let criteria = {};

        if (q.length) {
            criteria = {
                ...criteria,
                name: { $regex: `${q}`, $options: 'i' },
            };
        }

        if (category.length) {
            let categoryResult = await Category.findOne({
                name: { $regex: `${category}`, $options: 'i' },
            });

            if (categoryResult) {
                criteria = { ...criteria, category: categoryResult._id };
            }
        }

        if (tags.length) {
            let tagsResult = await Tag.find({ name: { $in: tags } });

            if (tagsResult.length > 0) {
                criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } };
            }
        }

        let product = await Product.find(criteria)
            .limit(pageSize)
            .skip(pageSize * page)
            .populate('category')
            .populate('tags');

        let count = await Product.find(criteria).countDocuments();
        return res.json({
            count,
            data: product,
            totalPages: Math.ceil(count / pageSize),
        });
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        let product = await Product.findById(id).populate('category').populate('tags');
        return res.json({
            data: product,
        });
    } catch (err) {
        next(err);
    }

    if (!product) {
        return res.json({
            message: 'Product not found',
        });
    }
};

const destroy = async (req, res, next) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);
        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
        }

        return res.json(product);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    store,
    index,
    update,
    destroy,
    getById,
};
