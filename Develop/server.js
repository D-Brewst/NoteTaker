// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Set up express app
var app = express();
var PORT = process.env.PORT || 5000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// renders static files to allow styles.css and index.js files to be applied.
app.use(express.static('./public'))

// HTML routes
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

// The following API routes should be created:

// * GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res){
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if (err) throw err;
        // fs readFile returns data from db.json as a string, so it needs to be parsed back to an object.
        let notes = JSON.parse(data);
        res.json(notes);
    })
})
// * POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res){
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if (err) throw err;
        // fs readFile returns data from db.json as a string, so it needs to be parsed back to an object.
        let notes = JSON.parse(data);
        // req.body hosts is equal to the JSON post sent from the user
        // This works because of our body parsing middleware
        var newNote = req.body;
        console.log(newNote);
        // Give each new note a unique id that is based title
        newNote.id = newNote.title;
        if(notes.length === 0){
            newNote.id = newNote.title;
        }
        // Add new note to the array of notes
        notes.push(newNote)

        fs.writeFile("./db/db.json", JSON.stringify(notes), function(err, data){
            if (err) throw err;
            res.sendStatus(200);
        })
    })
})

// * DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", function(req, res){
    // Save the id of the note to be deleted.
    var kick = req.params.id;
    // Read the db.json file.
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if (err) throw err;
        // fs readFile returns data from db.json as a string, so it needs to be parsed back to an object.
        let notes = JSON.parse(data);
        // Loop through the notes array.
        for(var i = 0; i < notes.length; i++){
            if(notes[i].id === kick){
                notes.splice(i, 1);
            }
        }
        // rewrite the notes to the `db.json` file with the selected note removed.
        fs.writeFile("./db/db.json", JSON.stringify(notes), function(err, data){
            if (err) throw err;
            res.sendStatus(200);
        })
    })
})

app.listen(PORT, function(){
    console.log("Server is listening on PORT: http://localhost:" + PORT);
})
