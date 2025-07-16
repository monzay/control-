import { useState, useCallback } from "react";

// Función auxiliar para obtener el token del localStorage
const obtenerToken = () => localStorage.getItem("accessToken");

// Función auxiliar para construir los headers, agregando el token si existe
const construirHeaders = (headers = {}, token = null) => {
    const headersFinales = {
        "Content-Type": "application/json",
        ...headers,
    };
    if (token) {
        headersFinales["Authorization"] = `Bearer ${token}`;
    }
    return headersFinales;
};

// Función auxiliar para refrescar el token
const refrescarToken = async () => {
    const respuesta = await fetch("http://localhost:4000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    if (!respuesta.ok) return null;
    const datos = await respuesta.json();
    localStorage.setItem("accessToken", datos.accessToken);
    return datos.accessToken;
};

export function CallApi(baseUrl = "") {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async (endpoint, opciones = {}) => {
            setCargando(true);
            setError(null);

            const { method = "GET", body, headers = {} } = opciones;

            let token = obtenerToken();
            let headersFinales = construirHeaders(headers, token);

            const hacerPeticion = async (headersUsar) => {
                const respuesta = await fetch(`${baseUrl}${endpoint}`, {
                    method,
                    headers: headersUsar,
                    body: body ? JSON.stringify(body) : undefined,
                });
                const datos = await respuesta.json();
                return { respuesta, datos };
            };

            try {
                // Primer intento de petición
                let { respuesta, datos } = await hacerPeticion(headersFinales);

                // Si el token expiró, intentamos refrescarlo y reintentamos la petición
                if (respuesta.status === 401) {
                    token = await refrescarToken();
                    if (token) {
                        headersFinales = construirHeaders(headers, token);
                        ({ respuesta, datos } = await hacerPeticion(headersFinales));
                    } else {
                        window.location.href = "Login";
                        return;
                    }
                }

                // Si la respuesta no es exitosa, lanzamos un error
                if (!respuesta.ok) {
                    throw new Error(datos.message || "Error inesperado en la API");
                }

                return datos;
            } catch (err) {
                console.error("Error en la API:", err.message);
                setError(err.message || "Error desconocido");
                throw err;
            } finally {
                setCargando(false);
            }
        },
        [baseUrl]
    );

    // Retornamos la función de petición y los estados de carga y error
    return { request, loading: cargando, error };
}



