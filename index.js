require('dotenv').config();
require("./configs/db.config");

const express = require('express');
const app = express();
const port = 4000;
const cors = require("cors");
const router = require("./routes/routeIndex.js");
const path = require("path");

// Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./uploads"));

// Configuration CORS (Doit être avant les routes)
const corsOptions = {
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: false 
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Déclaration des routes
app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
    res.status(404).json({ message: "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL." });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
