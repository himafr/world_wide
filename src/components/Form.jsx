// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import { useUrlLocation } from "../hooks/useUrlLocation";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";

// import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/ContextCities";
import { useNavigate } from "react-router-dom";
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodeErr, setGeoCodeErr] = useState("");
  const [lat, lng] = useUrlLocation();
  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityData() {
        try {
          setIsGeoLoading(true);
          setGeoCodeErr("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lng}&longitude=${lat}`
          );
          const data = await res.json();
          if (!data.countryName)
            throw new Error("Invalid city place . pls click somewhere else");
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setGeoCodeErr(error.message);
        } finally {
          setIsGeoLoading(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName && !date) return;
    // save data to your database here
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat,
        lng,
      },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isGeoLoading) return <Spinner />;
  if (!lat && !lng) return <Message message="start by clicking on the map" />;
  if (geoCodeErr) return <Message message={geoCodeErr} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
