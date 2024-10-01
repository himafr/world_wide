// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./ButtonBack";
import ButtonBack from "./ButtonBack";
import { useUrlLocation } from "../hooks/useUrlLocation";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [isGeoLoading,setIsGeoLoading] =useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const[lat,lng]=useUrlLocation();
  const BASE_URL='https://api.bigdatacloud.net/data/reverse-geocode-client'
   useEffect(  function(){
async function fetchCityData(){
try{
  setIsGeoLoading(true);
  const res=await fetch(`${BASE_URL}?latitude=${lng}&longitude=${lat}`)
  const data=await res.json();
  setCityName(data.city||data.locality || "")

}catch(error){
  console.log(error)
}finally{
  setIsGeoLoading(false)
}
}
fetchCityData();
    }
    ,[lat,lng])
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
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
      <Button  type='primary' >Add</Button>
       <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
