const express = require('express');
const cors = require('cors');
const app = express();

// Configuration CORS détaillée
const corsOptions = {
  origin: ['http://localhost:3000'], // Vous pouvez ajouter d'autres origines dans ce tableau
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache les résultats du preflight pendant 10 minutes
};

app.use(cors(corsOptions));

// Middleware pour les headers CORS personnalisés
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ... reste du code serveur 