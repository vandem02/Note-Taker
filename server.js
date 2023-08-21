const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000
const { log } = require("console");
// const { generateId } = require("../utils/generateid");

//middleware used to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //middleware = request json data
app.use(express.static("public")); //middleware - allows brower access to css and js files

//router for index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//router for notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//router for API/notes to render db.json
app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, json) => {
        if (err) console.log(err);
        let obj = JSON.parse(json);
        res.json(obj);
    });
});

//router to redirect to index.html when a 404 type param is typed
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//router for creating content
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

//route listener
app.listen(PORT, () => {
    console.log(`Express Listening on http://localhost:${PORT}`);
});
