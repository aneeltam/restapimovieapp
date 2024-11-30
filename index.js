// Get environment variables from .env
require('dotenv').config();

// Import other libaries
const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./movie');
const cors = require('cors');

// Start Express and define the port
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware - This allows all origins by default
app.use(cors({ origin: '*' }));

// Allows the app to read JSON data in requests
app.use(express.json());

// Connect to MongoDB using the MONGO_URI environment variable
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => { console.error('MongoDB connection error:', error); process.exit(1); });

// Route: Get all movies from the database
app.get('/api/getall', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: Get a single movie by its ID
app.get('/api/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route: Add a new movie to the database
app.post('/api/add', async (req, res) => {
    console.log(req.body);
    const { title, genre, releaseYear, plot, poster } = req.body;
    try {
        const newMovie = new Movie({ title, genre, releaseYear, plot, poster });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route: Update a movie by its ID
app.put('/api/update/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(updatedMovie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route: Delete a movie by its ID
app.delete('/api/delete/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server and listen on the specific port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
