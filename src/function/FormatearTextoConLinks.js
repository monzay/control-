import React from "react";

/**
 * Función para convertir URLs en texto a enlaces clicables
 * @param {string} texto - El texto que puede contener URLs
 * @returns {Array|string} Array de elementos React (texto y enlaces) o texto original
 */
export function formatearTextoConLinks(texto) {
  if (!texto || typeof texto !== 'string') return texto;

  // Expresión regular para detectar URLs
  // Detecta http://, https://, www., y también URLs sin protocolo
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/g;

  const partes = [];
  let ultimoIndice = 0;
  let match;
  let indiceKey = 0;

  while ((match = urlRegex.exec(texto)) !== null) {
    // Agregar el texto antes del match
    if (match.index > ultimoIndice) {
      const textoAntes = texto.substring(ultimoIndice, match.index);
      if (textoAntes) {
        partes.push(
          <React.Fragment key={`text-${indiceKey++}`}>
            {textoAntes}
          </React.Fragment>
        );
      }
    }

    // Procesar la URL encontrada
    let url = match[0];
    let urlCompleta = url;

    // Limpiar la URL de caracteres finales comunes (puntos, comas, etc.)
    const caracteresFinales = /[.,;:!?]+$/;
    const matchFinales = url.match(caracteresFinales);
    let caracteresExtra = '';
    if (matchFinales) {
      caracteresExtra = matchFinales[0];
      url = url.slice(0, -caracteresExtra.length);
      urlCompleta = url;
    }

    // Si la URL no tiene protocolo, agregar https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.startsWith('www.')) {
        urlCompleta = `https://${url}`;
      } else {
        urlCompleta = `https://${url}`;
      }
    }

    // Crear el elemento de enlace
    partes.push(
      <a
        key={`link-${indiceKey++}`}
        href={urlCompleta}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 hover:text-emerald-300 underline break-all"
        onClick={(e) => {
          e.stopPropagation(); // Evitar que se propague el evento al card
        }}
      >
        {url}
      </a>
    );

    // Agregar los caracteres extra después del link
    if (caracteresExtra) {
      partes.push(
        <React.Fragment key={`extra-${indiceKey++}`}>
          {caracteresExtra}
        </React.Fragment>
      );
    }

    ultimoIndice = match.index + match[0].length;
  }

  // Agregar el texto restante después del último match
  if (ultimoIndice < texto.length) {
    const textoRestante = texto.substring(ultimoIndice);
    if (textoRestante) {
      partes.push(
        <React.Fragment key={`text-${indiceKey++}`}>
          {textoRestante}
        </React.Fragment>
      );
    }
  }

  // Si no se encontraron URLs, devolver el texto original
  if (partes.length === 0) {
    return texto;
  }

  return partes;
}

