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
app.use(express.static(path.join(__dirname, "public")));


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


app.post("/api/notes", (req, res) => {
  const now = new Date();
  const dateTime = now.toLocaleDateString("en-GB") + ' ' + 
                   now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });


  const notes = readNotes();
  const newNote = {
    id: now.getTime(),
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    created: dateTime
  };
  
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});


app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

app.get("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id == req.params.id);
  
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  
  res.json(note);
});


app.put("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id == req.params.id);
  
  const now = new Date();
  const dateTime = now.toLocaleDateString("en-GB") + ' ' + 
                   now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });



  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  
    note.title = req.body.title;
    note.content = req.body.content;
    note.category = req.body.category;
    note.updated = dateTime;

  writeNotes(notes);
  res.json({ message: "Note updated", data: note });
});


app.delete("/api/notes/:id", (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id == req.params.id);
  
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  
  const index = notes.indexOf(note);
  const deletedNote = notes.splice(index, 1)[0];
  writeNotes(notes);
  
  res.json({ message: "Note deleted", data: deletedNote });
});

app.delete("/api/notes", (req, res) => {
  writeNotes([]);
  res.json({ message: "All notes deleted" });
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