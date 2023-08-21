const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, json) => {
        if (err) console.log(err);
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/notes", async (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) console.log(err);
        const notes = JSON.parse(data);

        const newNote = {
            ...req.body,
            id: Math.floor(Math.random() * 1000000) + 1,
        };

        notes.push(newNote);

        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (err) => {
            if (err) console.log(err);
            res.status(201).json(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Now listening on http://localhost:${PORT}`);
});
