import React, { createContext, useContext, useState, useEffect } from 'react';

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};

export const GoogleMapsProvider = ({ children }) => {
  const [isGoogleApiLoaded, setIsGoogleApiLoaded] = useState(false);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => {
        setIsGoogleApiLoaded(true); // Establece a true una vez cargada
      });
      document.body.appendChild(script);
    } else {
      setIsGoogleApiLoaded(true);
    }
  }, []);

  const calcularDistancia = async (origen, destino) => {
    if (!isGoogleApiLoaded) {
      throw new Error('La API de Google Maps no está cargada');
    }
    
    const service = new window.google.maps.DistanceMatrixService();
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [origen],
          destinations: [destino],
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if (status !== "OK") {
            reject("Error con el servicio de Google Maps");
            return;
          }

          const distancia = response.rows[0].elements[0].distance.text;
          resolve(distancia);
        }
      );
    });
  };

  const value = {
    isGoogleApiLoaded,
    calcularDistancia,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
};