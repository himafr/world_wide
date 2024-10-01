
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
function Map() {
    const navigate = useNavigate()
    const [searchParams,setSearchParams]= useSearchParams();
     const [lat,lng]=[searchParams.get("lat"),searchParams.get("lng")]
    return (
        <div className={styles.mapContainer}>
            <h1>Map</h1>
            <h1>position : {lat},{lng} </h1>
            <button onClick={()=>navigate('form')}>Search</button>
        </div>
    )
}

export default Map
