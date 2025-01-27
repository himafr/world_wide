import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CitiesContext = createContext();
const initialSate = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cites/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "current/updated":
      return {
        ...state,
        currentCity: action.payload,
        isLoading: false,
      };
      case "cite/added":return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };
      case "cite/deleted":return{
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      }
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      throw new Error("action does not exist ");
  }
}

function CitiesProvider({ children }) {
  const [{cities,isLoading,currentCity,error},dispatch]=useReducer(reducer,initialSate)
  useEffect(function () {
    dispatch({type:"loading"})
    async function fetchCities() {
      try {
        const res = await fetch(`http://localhost:8000/cities`);
        const data = await res.json();
        dispatch({type:"cites/loaded",payload:data})
      } catch {
        dispatch({type:"rejected",payload:"something went wrong while loading data"})
      } 
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    dispatch({type:"loading"})

    try {
      const res = await fetch(`http://localhost:8000/cities/${id}`);
      const data = await res.json();
      dispatch({type:"current/updated",payload:data})
    } catch {
      dispatch({type:"rejected",payload:"something went wrong while loading data"});
    }
  }
  async function createCity(newCity) {
    dispatch({type:"loading"})

    try {

      const res = await fetch(`http://localhost:8000/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await res.json();
      dispatch({type:"cite/added",payload:data})
    } catch {
      dispatch({type:"rejected",payload:"something went wrong while loading data"});
      }
  }
  async function deleteCity(id) {
    dispatch({type:"loading"})
    try {
      await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({type:"cite/deleted" ,payload:id})
    } catch {
      dispatch({type:"rejected",payload:"something went wrong while loading data"});
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
  if (context === undefined)
    throw new Error(" useCities is used out of the CitiesContext");
  return context;
}
export { CitiesProvider, useCities };
