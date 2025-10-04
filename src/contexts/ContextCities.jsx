import { createContext, useCallback, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

// Default mock data if localStorage is empty
const mockCities = [
   {
      "cityName": "Lisbon",
      "country": "Portugal",
      "emoji": "🌏",
      "date": "2027-10-31T15:59:59.138Z",
      "notes": "My favorite city so far!",
      "position": {
        "lat": 38.727881642324164,
        "lng": -9.140900099907554
      },
      "id": 73930385
    },
    {
      "cityName": "Madrid",
      "country": "Spain",
      "emoji": "😶",
      "date": "2027-07-15T08:22:53.976Z",
      "notes": "",
      "position": {
        "lat": 40.46635901755316,
        "lng": -3.7133789062500004
      },
      "id": 17806751
    },
    {
      "cityName": "Berlin",
      "country": "Germany",
      "emoji": "😅",
      "date": "2027-02-12T09:24:11.863Z",
      "notes": "Amazing 😃",
      "position": {
        "lat": 52.53586782505711,
        "lng": 13.376933665713324
      },
      "id": 98443197
    }
];

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cites/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "current/updated":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "cite/added":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
    case "cite/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState);

  // Load cities from localStorage or fallback to mock data
  useEffect(() => {
    dispatch({ type: "loading" });
    try {
      const storedCities = localStorage.getItem("cities");
      const citiesData = storedCities ? JSON.parse(storedCities) : mockCities;
      dispatch({ type: "cites/loaded", payload: citiesData });
    } catch {
      dispatch({ type: "rejected", payload: "Failed to load cities" });
    }
  }, []);

  // Save cities to localStorage whenever they change
  useEffect(() => {
    if(cities.length)localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const getCity = useCallback(
    function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });

      try {
        const foundCity = cities.find((city) => city.id === Number(id));
        if (!foundCity) throw new Error();
        dispatch({ type: "current/updated", payload: foundCity });
      } catch {
        dispatch({ type: "rejected", payload: "City not found" });
      }
    },
    [currentCity.id, cities]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const id = Date.now(); // simple unique ID
      const cityWithId = { ...newCity, id };
      dispatch({ type: "cite/added", payload: cityWithId });
    } catch {
      dispatch({ type: "rejected", payload: "Failed to add city" });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
       dispatch({ type: "cite/deleted", payload: id });
      if(cities.length==1)localStorage.setItem("cities", "[]");
    } catch {
      dispatch({ type: "rejected", payload: "Failed to delete city" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
