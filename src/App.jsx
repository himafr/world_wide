import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { CitiesProvider } from "./contexts/ContextCities";
import { AuthProvider } from "./contexts/AuthContext";
import SpinnerFullPage from "./components/SpinnerFullPage";

const HomePage  =lazy(()=> import( "./pages/Homepage"));
const Pricing  =lazy(()=> import( "./pages/Pricing"));
const Product  =lazy(()=> import( "./pages/Product"));
const NotFound  =lazy(()=> import( "./pages/NotFound"));
const Login  =lazy(()=> import( "./pages/Login"));
const AppLayout  =lazy(()=> import( "./pages/AppLayout"));
const ProtectedRoute  =lazy(()=> import( "./pages/ProtectedRoute"));

function App() {
  return (
    <div>
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
        <Suspense  fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/product" element={<Product />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="cities" replace />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
