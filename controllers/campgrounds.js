const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const cgs = await Campground.find({});
    res.render('campgrounds/index', { cgs });
};

module.exports.renderCreate = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const cg = new Campground(req.body.campground);
    cg.geometry = geoData.body.features[0].geometry;
    cg.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cg.author = req.user._id;
    await cg.save();
    req.flash('success', 'Successfully created new campground');
    res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.renderShow = async (req, res) => {
    const { id } = req.params;
    const cg = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!cg) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { cg });
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const cg = await Campground.findById(id);
    if (!cg) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { cg });
};

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const cg = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true, });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    cg.images.push(...imgs);
    await cg.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        cg.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.deleteCG = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};