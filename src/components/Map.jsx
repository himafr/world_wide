import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useCities } from "../contexts/ContextCities";
import { useGeoLocation } from "../hooks/GeoLocation";
import Button from "./Button";
import { useUrlLocation } from "../hooks/useUrlLocation";
function Map() {
  const [mapPosition, setMapPosition] = useState([30.505, 31.09]);
  const {cities}=useCities();
  const {isLoading:isLoadingPosition,getPosition}=useGeoLocation(setMapPosition);
  const [lat,lng]= useUrlLocation()
  useEffect(
    function(){
      if(lat&&lng)setMapPosition([lat,lng]);
    }
    ,[lat,lng])
  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
{isLoadingPosition?"loading...":"User Your Location"}
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city=><Marker position={mapPosition} key={city.id}>
          <Popup>
            {city.emoji} {city.cityName}
          </Popup>
          <ChangeView position={mapPosition}/>
        </Marker>)}
          <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeView({position}){
 const map= useMap();
 map.setView(position);
 return null;
}
function DetectClick(){
  const navigate = useNavigate()
  useMapEvents({
    click: e=> navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}
export default Map;
