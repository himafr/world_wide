import { useSearchParams } from "react-router-dom";
export function useUrlLocation() {
  const [searchParams] = useSearchParams();
  const [lat, lng] = [searchParams.get("lat"), searchParams.get("lng")];
  return [lat, lng];
}
