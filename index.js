require('dotenv').config();
require("./configs/db.config")
const express = require('express');
const app = express();
const port = 3000
const cors = require("cors");
const router = require("./routes/routeIndex.js");
const path = require("path")

//project
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./uploads"));
app.use(cors());
app.use("/api", router);

app.use('/images', express.static(path.join(__dirname, 'images')));

// gestion des erreurs 404
app.use(({ res }) => {
    const message = "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
    res.status(404).json({ message });
})

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => (
    console.log(`Server is running on port http://localhost:${port}`)
))