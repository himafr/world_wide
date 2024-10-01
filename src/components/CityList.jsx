import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from "./Spinner"
function CityList({cities,isLoading}) {
    if(isLoading) return (<Spinner />)
        
    return (
        <ul className={styles.cityList}>
        {cities.map(city=><CityItem item={city} key={city.id}/>)}    
        </ul>
    )
}

export default CityList
