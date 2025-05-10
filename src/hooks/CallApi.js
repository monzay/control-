import { useState, useCallback } from "react";

export function CallApi (baseUrl = "") {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const { method = "GET", body, headers = {} } = options;

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error inesperado en la API");
        }

        return data;
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.message || "Error desconocido");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl]
  );

  return { request, loading, error };
}
