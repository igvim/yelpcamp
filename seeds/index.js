const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const cg = new Campground({
            author: '60987b6cc03cab450c4baa39',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/dagnptip3/image/upload/v1620669478/YelpCamp/mus6zlthhk0sqh20tvzl.jpg',
                filename: 'YelpCamp/mus6zlthhk0sqh20tvzl'
            }],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias, ab! Quas necessitatibus expedita aliquid vel. Sed in dolorem suscipit eaque deserunt est accusantium corrupti odio alias at, autem commodi quo.',
            price
        })
        await cg.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})