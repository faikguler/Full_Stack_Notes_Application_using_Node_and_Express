// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../..")));


// Define the path to the JSON file
const noteFilePath = path.join(__dirname, "notes.json");



// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "", "index.html"));
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
