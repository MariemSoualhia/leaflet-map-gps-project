const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Pour éviter les problèmes CORS
app.use(express.json());

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

app.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

app.listen(5000, () =>
  console.log("Serveur démarré sur http://localhost:5000")
);
