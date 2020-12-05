const { UnavailableForLegalReasons } = require('http-errors')
const db = require('../database')
const campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const mongoose = require('mongoose')

// const db = require('./db/database');
db.on('error', console.error.bind(console, 'Connection Error: '))
db.once('open', () => {
    console.log('Database connected...')
})

const sample = (array) => Math.floor(Math.random() * array.length);
// const random1000 = () => Math.floor(Math.random() * 1000);


const seedDB = async () => {
    await campground.deleteMany({});
    // const c = new campground({ title: 'purple field' });
    // await c.save()
    // console.log('here i am')
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`
        })
        await camp.save()
    }
}

seedDB().then(() => {
    console.log('seeding is done...')
    mongoose.connection.close();
});