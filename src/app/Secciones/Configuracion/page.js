"use client"
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User, Shield, Sliders, Menu, Edit2, Save, Loader2 } from "lucide-react";
import { usePerfil } from "@/Context/PerfilContext";

const opciones = [
  { key: "Inicio", label: "Inicio", icon: <User className="w-5 h-5 mr-2" /> },
  { key: "perfil", label: "Perfil", icon: <User className="w-5 h-5 mr-2" /> },
  { key: "preferencias", label: "Preferencias", icon: <Sliders className="w-5 h-5 mr-2" /> },
];

export default function ConfiguracionPage() {
  const router = useRouter();
  const { perfil, loading, error, obtenerPerfil, actualizarPerfil } = usePerfil();
  const [perfilEdit, setPerfilEdit] = useState({ nombre: "", descripcion: "" });
  const [editando, setEditando] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("perfil");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerPerfil();
  }, [obtenerPerfil]);

  useEffect(() => {
    if (perfil) {
      setPerfilEdit({
        nombre: perfil.nombre || "",
        descripcion: perfil.descripcion || "",
      });
    }
  }, [perfil]);

  const handleCerrarSesion = () => {
    localStorage.removeItem("accessToken");
    router.push("/Form/Login");
  };

  const handleEditar = () => setEditando(true);

  const handleCancelar = () => {
    setEditando(false);
    setPerfilEdit({
      nombre: perfil.nombre,
      descripcion: perfil.descripcion || "",
    });
    setMensaje("");
  };

  const handleGuardar = async () => {
    setMensaje("");
    try {
      await actualizarPerfil({
        nombre: perfilEdit.nombre,
        descripcion: perfilEdit.descripcion,
      });
      setMensaje("Perfil actualizado correctamente");
      setEditando(false);
    } catch (e) {
      setMensaje("Error al actualizar perfil");
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-black">
      {/* Panel lateral (desktop) */}
      <aside className="hidden md:flex flex-col w-60 bg-black/30 border-r border-white/10 py-8 px-2 gap-2 h-full min-h-screen">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-extrabold text-white mb-2 shadow-lg border-4 border-white/20 ring-4 ring-emerald-400/20">
            {perfil?.nombre?.[0] || "U"}
          </div>
          <div className="text-base font-semibold text-white mb-0.5 text-center truncate w-full">{perfil?.nombre}</div>
          <div className="text-xs text-white/60 font-mono text-center truncate w-full">{perfil?.email}</div>
        </div>
        <nav className="flex flex-col gap-1">
          {opciones.map((op) => (
            <button
              key={op.key}
              className={`flex items-center w-full px-4 py-2 rounded-lg transition-all font-medium text-sm text-white/80 hover:bg-emerald-500/20 hover:text-emerald-300 focus:outline-none focus:bg-emerald-500/30 ${
                opcionSeleccionada === op.key ? "bg-emerald-500/30 text-emerald-200" : ""
              }`}
              onClick={() => setOpcionSeleccionada(op.key)}
            >
              {op.icon}
              {op.label}
            </button>
          ))}
          <button
            className="flex items-center w-full px-4 py-2 rounded-lg transition-all font-medium text-sm text-white/80 hover:bg-red-500/20 hover:text-red-300 mt-4 focus:outline-none focus:bg-red-500/30"
            onClick={handleCerrarSesion}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Panel lateral móvil (drawer) */}
      <div className="md:hidden w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60">
          <span className="text-lg font-bold text-white">Configuración</span>
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-white/80 p-2 rounded hover:bg-white/10">
            <Menu className="w-7 h-7" />
          </button>
        </div>
        {menuAbierto && (
          <div className="absolute top-0 left-0 w-full h-full z-50 bg-black/80 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-extrabold text-white mb-2 shadow-lg border-4 border-white/20 ring-4 ring-emerald-400/20">
                {perfil?.nombre?.[0] || "U"}
              </div>
              <div className="text-base font-semibold text-white mb-0.5 text-center truncate w-full">{perfil?.nombre}</div>
              <div className="text-xs text-white/60 font-mono text-center truncate w-full">{perfil?.email}</div>
            </div>
            <nav className="flex flex-col gap-1 w-10/12">
              {opciones.map((op) => (
                <button
                  key={op.key}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all font-medium text-base text-white/80 hover:bg-emerald-500/20 hover:text-emerald-300 focus:outline-none focus:bg-emerald-500/30 ${
                    opcionSeleccionada === op.key ? "bg-emerald-500/30 text-emerald-200" : ""
                  }`}
                  onClick={() => {
                     setOpcionSeleccionada(op.key); setMenuAbierto(false); }}
                >
                  {op.icon}
                  {op.label}
                </button>
              ))}
              <button
                className="flex items-center w-full px-4 py-3 rounded-lg transition-all font-medium text-base text-white/80 hover:bg-red-500/20 hover:text-red-300 mt-4 focus:outline-none focus:bg-red-500/30"
                onClick={() => { handleCerrarSesion(); setMenuAbierto(false); }}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Cerrar sesión
              </button>
              <button className="mt-8 text-white/60 underline" onClick={() => setMenuAbierto(false)}>Cerrar menú</button>
            </nav>
          </div>
        )}
      </div>

      {/* Panel principal */}
      <main className="flex-1 w-full p-4 md:p-12 flex flex-col justify-center overflow-y-auto">
        {opcionSeleccionada === "perfil" && (
          <section className="max-w-2xl w-full mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Perfil</h2>
            {loading && (
              <div className="flex items-center gap-2 text-white/70 mb-4">
                <Loader2 className="animate-spin" /> Cargando...
              </div>
            )}
            {error && (
              <div className="text-red-400 mb-4">{error}</div>
            )}
            {perfil && (
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  handleGuardar();
                }}
              >
                <div>
                  <span className="block text-white/70 text-sm mb-1">Nombre</span>
                  {editando ? (
                    <input
                      className="block w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      value={perfilEdit.nombre}
                      onChange={e => setPerfilEdit(p => ({ ...p, nombre: e.target.value }))}
                      required
                    />
                  ) : (
                    <span className="block text-lg font-medium text-white bg-white/5 rounded-lg px-4 py-2">{perfil.nombre}</span>
                  )}
                </div>
                <div>
                  <span className="block text-white/70 text-sm mb-1">Correo electrónico</span>
                  <span className="block text-lg font-mono text-white bg-white/5 rounded-lg px-4 py-2">{perfil.email}</span>
                </div>
                <div>
                  <span className="block text-white/70 text-sm mb-1">Descripción</span>
                  {editando ? (
                    <textarea
                      className="block w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px]"
                      value={perfilEdit.descripcion}
                      onChange={e => setPerfilEdit(p => ({ ...p, descripcion: e.target.value }))}
                      placeholder="Agrega una breve descripción sobre ti"
                    />
                  ) : (
                    <span className="block text-base text-white bg-white/5 rounded-lg px-4 py-2 min-h-[60px]">{perfil.descripcion || <span className="text-white/30">Sin descripción</span>}</span>
                  )}
                </div>
                <div>
                  <span className="block text-white/70 text-sm mb-1">Zona horaria</span>
                  <span className="block text-base text-white bg-white/5 rounded-lg px-4 py-2">{perfil.zonaHoraria || <span className="text-white/30">No especificada</span>}</span>
                </div>
                <div>
                  <span className="block text-white/70 text-sm mb-1">Fecha de registro</span>
                  <span className="block text-base text-white bg-white/5 rounded-lg px-4 py-2">{new Date(perfil.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {editando ? (
                    <>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow disabled:opacity-60"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4" />
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all shadow"
                        onClick={handleCancelar}
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/10 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold transition-all shadow"
                      onClick={handleEditar}
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar perfil
                    </button>
                  )}
                </div>
                {mensaje && (
                  <div className={`mt-2 text-sm ${mensaje.includes('correctamente') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {mensaje}
                  </div>
                )}
              </form>
            )}
          </section>
        )}
        {opcionSeleccionada === "seguridad" && (
          <section className="max-w-2xl w-full mx-auto">
          
          </section>
        )}
        {opcionSeleccionada === "preferencias" && (
          <section className="max-w-2xl w-full mx-auto">
          </section>
        )}
      </main>
      <style jsx>{`
        .glassmorphism-professional {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.22);
          border: 1.5px solid rgba(255,255,255,0.13);
        }
      `}</style>
    </div>
  );
} 