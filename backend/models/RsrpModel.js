const mongoose = require("mongoose");

const rsrpSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  rsrp: Number,
});

module.exports = mongoose.model("RsrpData", rsrpSchema);
