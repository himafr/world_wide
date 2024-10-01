import { createContext,useContext,useEffect,useState} from "react"

const CitiesContext= createContext();

function CitiesProvider({children}){
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCity, setCurrentCity] = useState({});
  
    useEffect(function () {
      async function fetchCities() {
        try {
          setIsLoading(true);
          const res = await fetch(`http://localhost:8000/cities`);
          const data = await res.json();
          setCities(data);
        } catch {
          alert("something went wrong while loading data");
        } finally {
          setIsLoading(false);
        }
      }
      fetchCities();
    }, []);

    async function getCity(id){
        try {
            setIsLoading(true);
            const res = await fetch(`http://localhost:8000/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
          } catch {
            alert("something went wrong while loading data");
          } finally {
            setIsLoading(false);
          }
        }
    return (
        <CitiesContext.Provider value={{
            cities,
            isLoading,
            getCity,
            currentCity,
        }} >{children}</CitiesContext.Provider>
    )
  
}
function useCities(){
    const context =useContext(CitiesContext)
    if(context===undefined)throw new Error(" useCities is used out of the CitiesContext")
    return context;
}
export {CitiesProvider,useCities}