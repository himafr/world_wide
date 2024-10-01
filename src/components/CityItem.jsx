import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/ContextCities";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ item }) {
  const {currentCity}=useCities()
  const { emoji, date, cityName: name ,id,position} = item;
  return (
    <li >
    <Link className={`${styles.cityItem} ${currentCity.id===id?styles["cityItem--active"]:""}`} to={`${id}?lat=${position.lat}&lng=${position.lng}`}>

      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}>{name}</h3>
      <time className={styles.date}>{formatDate(date)}</time>
      <button className={styles.deleteBtn}>&times;</button>
    </Link>
    </li>
  );
}

export default CityItem;
