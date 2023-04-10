const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    cg.reviews.push(newReview);
    await newReview.save();
    await cg.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
};