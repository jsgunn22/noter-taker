// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const dbPath = "./db.db.json";
// const db = require(dbPath);
// const uniqid = require("uniqid");

// const PORT = 3001;

// const app = express();

// app.use(express.json());
// app.use(express.static("public"));

// // gets notes.html to render page
// app.get("/notes", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/notes.html"));
// });

// // writes to db.json when user clicks save icon
// app.post("/api/notes", (req, res) => {
//   console.info(`${req.method} was received`);

//   const { title, text } = req.body;

//   const newNote = {
//     title,
//     text,
//     id: uniqid(), // generates a unique id for each note
//   };

//   const response = {
//     status: "success",
//     body: newNote,
//   };

//   const notes = db; // gets the array of existing notes

//   notes.push(newNote); // adds the new note to the array

//   // writes the note to the database
//   fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });

//   // responds with the status and response message
//   res.status(201).json(response);
// });

// // gets the list of notes from db and sends them to index.js
// app.get("/api/notes", (req, res) => {
//   res.send(db);
// });

// // deletes a note based on its uniqid
// app.delete("/api/notes/:id", (req, res) => {
//   const notes = db; // gets the array of notes from db
//   const noteId = req.params.id;

//   // finds the index of the uniqid and deletes it from the array
//   notes.splice(
//     notes.findIndex((x) => x.id === noteId),
//     1
//   );

//   // overwrites the db with the updated array
//   fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });

//   res.status(201).json(`successfully deleted note ${noteId}`);
// });

// // renders landing page when url is indirect
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public/index.html"));
// });

// // hosts application out of port.
// app.listen(process.env.PORT || PORT, () => {
//   console.log(`Application is running at http://localhost:${PORT}`);
// });

const express = require("express");
const fs = require("fs");
const path = require("path");
const dbPath = "./db/db.json";
const uniqid = require("uniqid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.static("public"));

// gets notes.html to render page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// writes to db.json when user clicks save icon
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    id: uniqid(), // generates a unique id for each note
  };

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const parsedNotes = JSON.parse(data);

    parsedNotes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(parsedNotes), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  const response = {
    status: "success",
    body: newNote,
  };

  //   // responds with the status and response message
  res.status(201).json(response);
});

// gets the list of notes from db and sends them to index.js
app.get("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }

    res.send(data);
  });
});

// deletes a note based on its uniqid
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }

    const parsedNotes = JSON.parse(data);

    // finds the index of the uniqid and deletes it from the array
    parsedNotes.splice(
      parsedNotes.findIndex((x) => x.id === noteId),
      1
    );

    // overwrites the db with the updated array
    fs.writeFile(dbPath, JSON.stringify(parsedNotes), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  res.status(201).json(`successfully deleted note ${noteId}`);
});

// renders landing page when url is indirect
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// hosts application out of port.
app.listen(process.env.PORT || PORT, () => {
  console.log(`Application is running at http://localhost:${PORT}`);
});
