import React, { useState } from "react";
import axios from "axios";

const Geolocation = () => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: { q: address, format: "json", limit: 1 },
        }
      );
      if (response.data.length > 0) {
        setLocation(response.data[0]);
      } else {
        alert("Adresse introuvable !");
      }
    } catch (error) {
      console.error("Erreur de géolocalisation", error);
    }
  };

  return (
    <div>
      <h2>Recherche d'adresse</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Entrez une adresse"
      />
      <button onClick={getLocation}>Rechercher</button>
      {location && (
        <div>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lon}</p>
        </div>
      )}
    </div>
  );
};

export default Geolocation;
