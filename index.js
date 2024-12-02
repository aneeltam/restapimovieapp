// Import libraries
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Movie = require('./movie');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)  // No need for useNewUrlParser and useUnifiedTopology anymore
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Serve the React frontend from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
// Fetch all movies
app.get('/api/getall', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch a single movie by ID
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

// Add a new movie
app.post('/api/add', async (req, res) => {
  const { title, genre, releaseYear, plot, poster } = req.body;
  try {
    const newMovie = new Movie({ title, genre, releaseYear, plot, poster });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a movie by ID
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

// Delete a movie by ID
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

// Catch-all handler to serve the React app for all unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
