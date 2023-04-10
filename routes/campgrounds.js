const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCG } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCG, catchAsync(campgrounds.create));

router.get('/new', isLoggedIn, campgrounds.renderCreate);

router.route('/:id')
    .get(catchAsync(campgrounds.renderShow))
    .put(isLoggedIn, isAuthor, validateCG, catchAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCG));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEdit));

module.exports = router;