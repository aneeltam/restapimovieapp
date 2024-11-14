// Import the Mongoose library
const mongoose = require('mongoose');

// Define the schema for a Movie document in MongoDB
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    plot: { type: String, required: true },
    poster: { type: String }
});

// Create the Movie model based on the schema, using the 'movies' collection in MongoDB
const Movie = mongoose.model('Movie', movieSchema, 'movies');

module.exports = Movie;
