import { useState } from "react";

export function useGeoLocation(setPosition) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  function getPosition() {
    if (!navigator.geolocation)
      return setError("your browser does not support geolocation");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
      // {timeout:10000}
    );
  }
  return { isLoading, error, getPosition };
}
