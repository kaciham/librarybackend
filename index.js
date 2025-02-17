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
    origin: "*", // À remplacer par l'URL de ton frontend en production
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Liste d'en-têtes autorisés
    credentials: false // Doit être `false` si `origin` est "*"
};

app.use(cors(corsOptions));

// Middleware pour journaliser les requêtes (à placer avant les routes)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
    next();
});

// Déclaration des routes
app.use("/api", router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route par défaut
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ message: "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL." });
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
