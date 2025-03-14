import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import axios from "axios";

// Icône personnalisée pour les marqueurs
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Composant pour centrer la carte dynamiquement
const ChangeMapCenter = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13);
    }
  }, [location, map]);
  return null;
};

const App = () => {
  const [rsrpData, setRsrpData] = useState([]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: 36.8065, lng: 10.1815 }); // Position par défaut (Tunis)
  const [userLocation, setUserLocation] = useState(null);
  const [route, setRoute] = useState(null); // Stocke l’itinéraire

  // Charger les données RSRP depuis l'API backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/rsrp-data")
      .then((response) => setRsrpData(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des données RSRP", error)
      );
  }, []);

  // Fonction pour rechercher une adresse et mettre à jour la carte
  const getLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        { params: { q: address, format: "json", limit: 1 } }
      );
      if (response.data.length > 0) {
        const newLocation = {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        };
        setLocation(newLocation);
        if (userLocation) {
          getRoute(userLocation, newLocation);
        }
      } else {
        alert("Adresse introuvable !");
      }
    } catch (error) {
      console.error("Erreur de géolocalisation", error);
    }
  };

  // Fonction pour récupérer la position actuelle de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserLocation = { lat: latitude, lng: longitude };
          setUserLocation(newUserLocation);
          setLocation(newUserLocation); // Centre la carte sur la position actuelle
        },
        (error) => {
          console.error("Erreur de localisation", error);
          alert("Impossible d'accéder à votre position !");
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  // Fonction pour récupérer un itinéraire avec OSRM (Open Source Routing Machine)
  const getRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );
      setRoute(coordinates);
    } catch (error) {
      console.error("Erreur lors du calcul de l'itinéraire", error);
    }
  };

  return (
    <div>
      {/* Barre de recherche d'adresse et bouton Ma Position */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#fff",
          zIndex: 1000,
          position: "absolute",
          top: 10,
          left: 10,
          borderRadius: 5,
        }}
      >
        <h3>Recherche d'adresse</h3>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Entrez une adresse"
          style={{ padding: "5px", marginRight: "5px" }}
        />
        <button
          onClick={getLocation}
          style={{ padding: "5px", marginRight: "5px" }}
        >
          Rechercher
        </button>
        <button
          onClick={getUserLocation}
          style={{ padding: "5px", backgroundColor: "blue", color: "white" }}
        >
          📍 Ma Position
        </button>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <ChangeMapCenter location={location} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Marqueur pour la position recherchée */}
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Tooltip permanent direction="top">
            📍 Adresse trouvée
          </Tooltip>
        </Marker>

        {/* Marqueur pour la position de l'utilisateur */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={customIcon}
          >
            <Tooltip permanent direction="top">
              📍 Ma Position
            </Tooltip>
          </Marker>
        )}

        {/* Affichage de l'itinéraire */}
        {route && <Polyline positions={route} color="blue" weight={5} />}
      </MapContainer>
    </div>
  );
};

export default App;
