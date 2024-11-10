const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    plot: { type: String, required: true },
    poster: { type: String }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
