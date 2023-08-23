const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");
const uniqid = require("uniqid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} was received`);

  const { title, text } = req.body;

  const newNote = {
    title,
    text,
    noteId: uniqid(),
  };

  const response = {
    status: "success",
    body: newNote,
  };

  const notes = db;

  notes.push(newNote);

  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) =>
    err
      ? console.log(err)
      : console.log(`Note: ${newNote.title} - saved successfully`)
  );

  console.log(response);
  res.status(201).json(response);
});

app.get("/api/notes", (req, res) => {
  res.send(db);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Application is running at http://localhost:${PORT}`);
});
