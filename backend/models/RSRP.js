// models/RSRP.js
const mongoose = require("mongoose");

const rsrpSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  rsrp: { type: Number, required: true },
  time: { type: Date, required: true },
});

module.exports = mongoose.model("RSRP", rsrpSchema);
