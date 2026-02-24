// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3000;


// Middleware to parse incoming JSON requests
app.use(express.json());


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../..")));


// Define the path to the JSON file
const noteFilePath = path.join(__dirname, "notes.json");



const readNotes = () => {
  if (!fs.existsSync(noteFilePath)) {
    return [];
  }
  const data = fs.readFileSync(noteFilePath);

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Function to write data to the JSON file
const writeNotes = (data) => {
  fs.writeFileSync(noteFilePath, JSON.stringify(data, null, 2));
};

  const now = new Date();
  const dateTime = now.toLocaleDateString("en-GB") + ' ' + 
                   now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });

app.post("/api/notes", (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: now.getTime(),
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    date: dateTime
  };
  
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});

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