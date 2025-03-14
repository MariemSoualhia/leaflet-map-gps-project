// // routes/rsrp.js
// const express = require("express");
// const router = express.Router();
// const RSRP = require("../models/RSRP");

// // Récupérer les données RSRP depuis MongoDB
// router.get("/all", async (req, res) => {
//   try {
//     const rsrpData = await RSRP.find(); // Vous pouvez filtrer avec req.query si nécessaire
//     res.json(rsrpData);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// const rsrpData = [
//   { lat: 48.8566, lng: 2.3522, rsrp: -70 }, // Paris Centre
//   { lat: 48.8606, lng: 2.3376, rsrp: -85 }, // Musée du Louvre
//   { lat: 48.8529, lng: 2.3508, rsrp: -90 }, // Cathédrale Notre-Dame
//   { lat: 48.8667, lng: 2.311, rsrp: -95 }, // Arc de Triomphe
//   { lat: 48.8738, lng: 2.295, rsrp: -100 }, // Tour Eiffel
// ];

// router.get("/", (req, res) => {
//   res.json(rsrpData);
// });

// module.exports = router;
const express = require("express");
const RsrpData = require("../models/RsrpModel");
const router = express.Router();

// Récupérer toutes les données RSRP
router.get("/", async (req, res) => {
  try {
    const data = await RsrpData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Ajouter des données RSRP
router.post("/", async (req, res) => {
  try {
    const { lat, lng, rsrp } = req.body;
    const newData = new RsrpData({ lat, lng, rsrp });
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
