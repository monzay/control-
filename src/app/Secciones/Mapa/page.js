"use client"

import { useCallback, useState, useEffect } from "react"
import ReactFlow, {
  addEdge,
  Background,
  ConnectionMode,
  Controls,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"
import { ReactFlowProvider } from "reactflow"

const temas = {
  oscuro: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    cardBackground: "#1f2937",
    text: "#f9fafb",
    border: "#374151",
    buttonPrimary: "#22c55e",
    buttonSecondary: "#6b7280",
    buttonDanger: "#ef4444",
    input: "#374151",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
  },
}

const obtenerEstiloNodo = (color, tema) => {
  const estilosBase = {
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    padding: "12px 20px",
  }

  const estilos = {
    black: {
      background: "#000000",
      color: "white",
      border: "none",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
    },
    green: {
      background: "#22c55e",
      color: "white",
      border: "none",
      boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)",
    },
    white: {
      background: "#f9fafb",
      color: "#000000",
      border: "2px solid #374151",
      boxShadow: "0 4px 15px rgba(249, 250, 251, 0.2)",
    },
  }
  return { ...estilosBase, ...estilos[color] }
}

const nodosIniciales = [
  {
    id: "1",
    type: "input",
    data: { label: "Inicio", color: "black" },
    position: { x: 400, y: 50 },
    style: obtenerEstiloNodo("black", "oscuro"),
  },
  {
    id: "2",
    data: { label: "Análisis de Datos", color: "white" },
    position: { x: 200, y: 180 },
    style: obtenerEstiloNodo("white", "oscuro"),
  },
  {
    id: "3",
    data: { label: "Procesamiento", color: "green" },
    position: { x: 600, y: 180 },
    style: obtenerEstiloNodo("green", "oscuro"),
  },
]

const conexionesIniciales = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#000000", strokeWidth: 2 },
    type: "bezier",
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#22c55e", strokeWidth: 2 },
    type: "bezier",
  },
]

// Componentes UI nativos
const Boton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  style = {},
}) => {
  // Siempre tema oscuro
  const coloresTema = temas["oscuro"]

  const estilosBase = {
    border: "none",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
    ...style,
  }

  const estilosTamanio = {
    sm: { padding: "6px 12px", fontSize: "12px" },
    md: { padding: "8px 16px", fontSize: "14px" },
    lg: { padding: "12px 24px", fontSize: "16px" },
  }

  const estilosVariante = {
    primary: {
      backgroundColor: coloresTema.buttonPrimary,
      color: "white",
    },
    secondary: {
      backgroundColor: coloresTema.buttonSecondary,
      color: "white",
    },
    danger: {
      backgroundColor: coloresTema.buttonDanger,
      color: "white",
    },
    outline: {
      backgroundColor: "transparent",
      color: coloresTema.text,
      border: `1px solid ${coloresTema.border}`,
    },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...estilosBase,
        ...estilosTamanio[size],
        ...estilosVariante[variant],
      }}
    >
      {children}
    </button>
  )
}

const Entrada = ({ value, onChange, placeholder, onKeyPress, className = "" }) => {
  // Siempre tema oscuro
  const coloresTema = temas["oscuro"]; 
  
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyPress={onKeyPress}
      className={className}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: `1px solid ${coloresTema.border}`,
        borderRadius: "6px",
        color: coloresTema.text,
        fontSize: "14px",
        outline: "none",
      }}
    />
  )
}

const Tarjeta = ({ children, className = "", title }) => {
  // Siempre tema oscuro
  const coloresTema = temas["oscuro"]

  return (
    <div
      className={className}
      style={{
        backgroundColor: "black",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      {title && (
        <div
          style={{
            padding: "16px 16px 8px 16px",
            borderBottom: `1px solid ${coloresTema.border}`,
            fontWeight: "600",
            fontSize: "16px",
            color: coloresTema.text,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  )
}

function Mapa() {
  // Siempre tema oscuro
  const tema = "oscuro"
  const coloresTema = temas[tema]

  const [nodos, setNodos, onNodosChange] = useNodesState([])
  const [conexiones, setConexiones, onConexionesChange] = useEdgesState([])
  const [idNodoSeleccionado, setIdNodoSeleccionado] = useState(null)
  const [nuevoNombreNodo, setNuevoNombreNodo] = useState("")
  const [idNodoEditando, setIdNodoEditando] = useState(null)
  const [nombreNodoEditando, setNombreNodoEditando] = useState("")
  const { fitView, getNodes } = useReactFlow()
  const [esMovil, setEsMovil] = useState(false)
  const [panelAbierto, setPanelAbierto] = useState(false)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const nodosGuardados = localStorage.getItem("flowchart-nodes")
    const conexionesGuardadas = localStorage.getItem("flowchart-edges")

    if (nodosGuardados) {
      const nodosParseados = JSON.parse(nodosGuardados)
      // Actualizar estilos de nodos según el tema oscuro
      const nodosActualizados = nodosParseados.map((nodo) => ({
        ...nodo,
        style: obtenerEstiloNodo(nodo.data.color, "oscuro"),
      }))
      setNodos(nodosActualizados)
    } else {
      setNodos(nodosIniciales)
    }

    if (conexionesGuardadas) {
      setConexiones(JSON.parse(conexionesGuardadas))
    } else {
      setConexiones(conexionesIniciales)
    }
  }, [setNodos, setConexiones])

  // Detectar tamaño de pantalla
  useEffect(() => {
    const chequearTamanioPantalla = () => {
      const movil = window.innerWidth < 768
      setEsMovil(movil)
      if (!movil) {
        setPanelAbierto(true) // Mantener panel abierto en escritorio
      } else {
        setPanelAbierto(false) // Cerrar panel por defecto en móvil
      }
    }

    chequearTamanioPantalla()
    window.addEventListener('resize', chequearTamanioPantalla)
    return () => window.removeEventListener('resize', chequearTamanioPantalla)
  }, [])

  // Guardar en localStorage cuando cambien los nodos
  useEffect(() => {
    if (nodos.length > 0) {
      localStorage.setItem("flowchart-nodes", JSON.stringify(nodos))
    }
  }, [nodos])

  // Guardar en localStorage cuando cambien las conexiones
  useEffect(() => {
    if (conexiones.length > 0) {
      localStorage.setItem("flowchart-edges", JSON.stringify(conexiones))
    }
  }, [conexiones])

  const alConectar = useCallback(
    (params) => {
      const nuevaConexion = {
        ...params,
        animated: true,
        style: { stroke: "#22c55e", strokeWidth: 2 },
        type: "bezier",
      }
      setConexiones((conns) => addEdge(nuevaConexion, conns))
    },
    [setConexiones],
  )

  const alClicNodo = useCallback((event, nodo) => {
    setIdNodoSeleccionado(nodo.id)
  }, [])

  const agregarNuevoNodo = useCallback(() => {
    if (!nuevoNombreNodo.trim()) return

    const nuevoNodo = {
      id: `nodo-${Date.now()}`,
      data: { label: nuevoNombreNodo, color: "white" },
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 400 + 200,
      },
      style: obtenerEstiloNodo("white", tema),
    }

    setNodos((nds) => [...nds, nuevoNodo])
    setNuevoNombreNodo("")
  }, [nuevoNombreNodo, setNodos, tema])

  const cambiarColorNodo = useCallback(
    (idNodo, color) => {
      setNodos((nds) =>
        nds.map((nodo) => {
          if (nodo.id === idNodo) {
            return {
              ...nodo,
              data: { ...nodo.data, color },
              style:
                nodo.id === "5"
                  ? {
                      ...obtenerEstiloNodo(color, tema),
                      border: "3px solid #22c55e",
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                    }
                  : obtenerEstiloNodo(color, tema),
            }
          }
          return nodo
        }),
      )
    },
    [setNodos, tema],
  )

  const autoEstructurar = useCallback(() => {
    const copiaNodos = getNodes()
    const nodosEstructurados = copiaNodos.map((nodo, indice) => ({
      ...nodo,
      position: {
        x: (indice % 3) * 250 + 150,
        y: Math.floor(indice / 3) * 150 + 100,
      },
    }))

    setNodos(nodosEstructurados)
    setTimeout(() => fitView({ padding: 0.2 }), 100)
  }, [getNodes, setNodos, fitView])

  const reiniciarDiagrama = useCallback(() => {
    setNodos(nodosIniciales.map(n => ({
      ...n,
      style: obtenerEstiloNodo(n.data.color, tema)
    })))
    setConexiones(conexionesIniciales)
    setIdNodoSeleccionado(null)
    localStorage.removeItem("flowchart-nodes")
    localStorage.removeItem("flowchart-edges")
    setTimeout(() => fitView({ padding: 0.2 }), 100)
  }, [setNodos, setConexiones, fitView, tema])

  const eliminarNodo = useCallback(
    (idNodo) => {
      setNodos((nds) => nds.filter((nodo) => nodo.id !== idNodo))
      setConexiones((conns) => conns.filter((conn) => conn.source !== idNodo && conn.target !== idNodo))
      setIdNodoSeleccionado(null)
    },
    [setNodos, setConexiones],
  )

  const comenzarEditarNodo = useCallback(
    (idNodo) => {
      const nodo = nodos.find((n) => n.id === idNodo)
      if (nodo) {
        setIdNodoEditando(idNodo)
        setNombreNodoEditando(nodo.data.label)
      }
    },
    [nodos],
  )

  const actualizarNombreNodo = useCallback(() => {
    if (!idNodoEditando || !nombreNodoEditando.trim()) return

    setNodos((nds) =>
      nds.map((nodo) => (nodo.id === idNodoEditando ? { ...nodo, data: { ...nodo.data, label: nombreNodoEditando } } : nodo)),
    )
    setIdNodoEditando(null)
    setNombreNodoEditando("")
  }, [idNodoEditando, nombreNodoEditando, setNodos])

  const cancelarEdicion = useCallback(() => {
    setIdNodoEditando(null)
    setNombreNodoEditando("")
  }, [])

  const desvincularNodo = useCallback(
    (idNodo) => {
      setConexiones((conns) => conns.filter((conn) => conn.source !== idNodo && conn.target !== idNodo))
    },
    [setConexiones],
  )

  const eliminarConexionEspecifica = useCallback(
    (idConexion) => {
      setConexiones((conns) => conns.filter((conn) => conn.id !== idConexion))
    },
    [setConexiones],
  )

  const limpiarTodo = useCallback(() => {
    localStorage.removeItem("flowchart-nodes")
    localStorage.removeItem("flowchart-edges")
    setNodos([])
    setConexiones([])
    setIdNodoSeleccionado(null)
  }, [setNodos, setConexiones])

  const alternarPanel = useCallback(() => {
    setPanelAbierto(!panelAbierto)
  }, [panelAbierto])

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: coloresTema.background,
        display: "flex",
        position: "relative",
      }}
    >
      {/* Botón hamburguesa para móvil */}
      {esMovil && (
        <button
          onClick={alternarPanel}
          style={{
            position: "fixed",
            top: "16px",
            left: "16px",
            zIndex: 1000,
            backgroundColor: coloresTema.cardBackground,
            border: `1px solid ${coloresTema.border}`,
            borderRadius: "8px",
            padding: "12px",
            cursor: "pointer",
            boxShadow: coloresTema.shadow,
            color: coloresTema.text,
            fontSize: "18px",
          }}
        >
          {panelAbierto ? "Cerrar" : "Menú"}
        </button>
      )}

      {/* Overlay para móvil */}
      {esMovil && panelAbierto && (
        <div
          onClick={() => setPanelAbierto(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
        />
      )}

      {/* Panel de Control */}
      <div
        style={{
          width: esMovil ? "90vw" : "320px",
          maxWidth: esMovil ? "350px" : "320px",
          backgroundColor: coloresTema.cardBackground,
          borderRight: !esMovil ? `1px solid ${coloresTema.border}` : "none",
          padding: "16px",
          overflowY: "auto",
          color: coloresTema.text,
          position: esMovil ? "fixed" : "relative",
          top: 0,
          left: esMovil && panelAbierto ? 0 : esMovil ? "-100%" : 0,
          height: "100vh",
          zIndex: 999,
          transition: esMovil ? "left 0.3s ease" : "none",
          boxShadow: esMovil ? coloresTema.shadow : "none",
        }}
      >
        {/* Título del panel en móvil */}
        {esMovil && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${coloresTema.border}`,
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Panel de Control</h2>
            <button
              onClick={() => setPanelAbierto(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: coloresTema.text,
                padding: "4px",
              }}
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Agregar Nota */}
        <Tarjeta title="Agregar Nota">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Entrada
              placeholder="Nombre de la nota"
              value={nuevoNombreNodo}
              onChange={(e) => setNuevoNombreNodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && agregarNuevoNodo()}
            />
            <Boton onClick={agregarNuevoNodo} style={{ width: "100%" }}>Crear Nota</Boton>
          </div>
        </Tarjeta>

        {/* Editar Nota */}
        {idNodoSeleccionado && (
          <Tarjeta title="Editar Nota">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "14px", color: coloresTema.text, margin: 0, wordBreak: "break-word" }}>
                Nota: {nodos.find((n) => n.id === idNodoSeleccionado)?.data.label}
              </p>

              {idNodoEditando === idNodoSeleccionado ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Entrada
                    value={nombreNodoEditando}
                    onChange={(e) => setNombreNodoEditando(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && actualizarNombreNodo()}
                    placeholder="Nuevo nombre"
                  />
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Boton onClick={actualizarNombreNodo} size="sm" style={{ flex: 1, minWidth: "80px" }}>
                      Guardar
                    </Boton>
                    <Boton onClick={cancelarEdicion} variant="outline" size="sm" style={{ flex: 1, minWidth: "80px" }}>
                      Cancelar
                    </Boton>
                  </div>
                </div>
              ) : (
                <Boton onClick={() => comenzarEditarNodo(idNodoSeleccionado)} variant="outline" style={{ width: "100%" }}>
                  Editar Texto
                </Boton>
              )}

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Boton onClick={() => desvincularNodo(idNodoSeleccionado)} variant="secondary" size="sm" style={{ flex: 1, minWidth: "100px" }}>
                  Desvincular
                </Boton>
                <Boton onClick={() => eliminarNodo(idNodoSeleccionado)} variant="danger" size="sm" style={{ flex: 1, minWidth: "80px" }}>
                  Eliminar
                </Boton>
              </div>
            </div>
          </Tarjeta>
        )}

        {/* Cambiar Color */}
        <Tarjeta title="Cambiar Color">
          {idNodoSeleccionado ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "14px", color: coloresTema.text, margin: 0, wordBreak: "break-word" }}>
                Nota: {nodos.find((n) => n.id === idNodoSeleccionado)?.data.label}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Boton
                  onClick={() => cambiarColorNodo(idNodoSeleccionado, "black")}
                  size="sm"
                  style={{ backgroundColor: "#000000", color: "white", flex: 1, minWidth: "60px" }}
                >
                  Negro
                </Boton>
                <Boton
                  onClick={() => cambiarColorNodo(idNodoSeleccionado, "green")}
                  size="sm"
                  style={{ backgroundColor: "#22c55e", color: "white", flex: 1, minWidth: "60px" }}
                >
                  Verde
                </Boton>
                <Boton
                  onClick={() => cambiarColorNodo(idNodoSeleccionado, "white")}
                  size="sm"
                  style={{ backgroundColor: "#ffffff", color: "#000000", border: "1px solid #000000", flex: 1, minWidth: "60px" }}
                >
                  Blanco
                </Boton>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: "14px", color: coloresTema.text, margin: 0 }}>
              Haz clic en una nota para cambiar su color
            </p>
          )}
        </Tarjeta>

        {/* Conexiones */}
        {idNodoSeleccionado && (
          <Tarjeta title="Conexiones">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {conexiones
                .filter((conn) => conn.source === idNodoSeleccionado || conn.target === idNodoSeleccionado)
                .map((conn) => {
                  const nodoOrigen = nodos.find((n) => n.id === conn.source)
                  const nodoDestino = nodos.find((n) => n.id === conn.target)
                  return (
                    <div
                      key={conn.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        backgroundColor: "#374151",
                        borderRadius: "6px",
                        fontSize: "12px",
                        gap: "8px",
                      }}
                    >
                      <span style={{ flex: 1, wordBreak: "break-word", minWidth: 0 }}>
                        {nodoOrigen?.data.label} - {nodoDestino?.data.label}
                      </span>
                      <Boton
                        onClick={() => eliminarConexionEspecifica(conn.id)}
                        variant="danger"
                        size="sm"
                        style={{ padding: "6px 10px", fontSize: "12px", flexShrink: 0 }}
                      >
                        Eliminar
                      </Boton>
                    </div>
                  )
                })}
              {conexiones.filter((conn) => conn.source === idNodoSeleccionado || conn.target === idNodoSeleccionado).length ===
                0 && <p style={{ fontSize: "14px", color: coloresTema.text, margin: 0 }}>No hay conexiones</p>}
            </div>
          </Tarjeta>
        )}
        {/* Estructurar */}
        <Tarjeta title="Estructurar">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Boton onClick={autoEstructurar} variant="outline" style={{ width: "100%" }}>
              Organizar automáticamente
            </Boton>
            <Boton onClick={reiniciarDiagrama} variant="outline" style={{ width: "100%" }}>
              Reiniciar diagrama
            </Boton>
            <Boton onClick={limpiarTodo} variant="danger" style={{ width: "100%" }}>
              Limpiar todo
            </Boton>
          </div>
        </Tarjeta>
      </div>

      {/* Área del Diagrama */}
      <div 
        style={{ 
          flex: 1,
          marginLeft: esMovil ? 0 : 0,
          width: esMovil ? "100vw" : "auto",
        }}
      >
        <ReactFlow
          nodes={nodos}
          edges={conexiones}
          onNodesChange={onNodosChange}
          onEdgesChange={onConexionesChange}
          onConnect={alConectar}
          onNodeClick={alClicNodo}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          style={{ backgroundColor: "transparent" }}
          panOnScroll={!esMovil}
          panOnScrollSpeed={0.5}
          zoomOnScroll={!esMovil}
          zoomOnPinch={esMovil}
          panOnDrag={!esMovil ? [1, 2] : true}
          selectNodesOnDrag={false}
        >
          <Background variant="dots" gap={20} size={1} color={"#374151"} />
          <Controls
            position={esMovil ? "bottom-right" : "bottom-left"}
            style={{
              background: coloresTema.cardBackground,
              border: `1px solid ${coloresTema.border}`,
              borderRadius: "8px",
              boxShadow: coloresTema.shadow,
              transform: esMovil ? "scale(1.2)" : "scale(1)",
            }}
            showZoom={true}
            showFitView={true}
            showInteractive={false}
          />
          <MiniMap
            position={esMovil ? "top-right" : "bottom-right"}
            style={{
              background: coloresTema.cardBackground,
              border: `1px solid ${coloresTema.border}`,
              borderRadius: "8px",
              boxShadow: coloresTema.shadow,
              width: esMovil ? "120px" : "200px",
              height: esMovil ? "80px" : "150px",
            }}
            maskColor={"rgba(0, 0, 0, 0.3)"}
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function Pagina() {
    return (
        <ReactFlowProvider>
          <Mapa />
        </ReactFlowProvider>
    )
}