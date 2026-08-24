import React, { useEffect, useState, useRef } from "react";



const CATEGORIAS = [
  { id: "bebidas-sin-alcohol", label: "Sin Alcohol", icon: GlassIcon },
  { id: "cerveza-artesanal", label: "Cerveza Artesanal", icon: MugIcon },
  { id: "latas", label: "Latas", icon: CanIcon },
  { id: "picadas", label: "Picadas", icon: BoardIcon },
  { id: "resto-bar", label: "Resto Bar", icon: PlateIcon },
  { id: "happy-hour", label: "Happy Hour", subtitulo: "De 18:00 a 20:00 hs", icon: ClockIcon },
];

function normalizarProducto(producto) {
  const categoria = producto.categoria ?? producto.category;
  const categoriaEncontrada = CATEGORIAS.find(
    (item) => item.id === categoria || item.label.toLowerCase() === String(categoria).toLowerCase(),
  );

  return {
    nombre: producto.nombre ?? producto.name,
    descripcion: producto.descripcion ?? producto.shortDesc,
    precio: Number(producto.precio ?? producto.price),
    categoria: categoriaEncontrada?.id ?? categoria,
    imagen_url: producto.imagen_url ?? producto.image,
  };
}

function GlassIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M7 3h10l-1.3 15.5a2 2 0 0 1-2 1.8h-3.4a2 2 0 0 1-2-1.8L7 3Z" />
      <path d="M8 8h8" />
    </svg>
  );
}
function MugIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M5 8h11v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 8V5a1 1 0 0 1 1-1h1" />
    </svg>
  );
}
function CanIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M7 5h10l-.6 14.2a1 1 0 0 1-1 .8H8.6a1 1 0 0 1-1-.8L7 5Z" />
      <path d="M6.5 5h11" />
      <path d="M10 2.5h4l.4 2.5h-4.8l.4-2.5Z" />
    </svg>
  );
}
function BoardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <circle cx="8" cy="11" r="1.4" />
      <path d="M13 9.5h5M13 12.5h5M6 15.5h12" />
    </svg>
  );
}
function PlateIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function formatPrecio(value) {
  return Number(value).toLocaleString("es-AR");
}

export default function BarMenu() {
  const [activa, setActiva] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const refs = useRef({});

  useEffect(() => {
    const controller = new AbortController();

    async function cargarProductos() {
      try {
        const response = await fetch("https://bar-admin.onrender.com/productos", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudieron cargar los productos");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("La respuesta no es una lista");

        setProductos(data.map(normalizarProducto));
        setError(false);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Error cargando productos", fetchError);
          setError(true);
        }
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
    const intervalo = window.setInterval(cargarProductos, 30000);
    window.addEventListener("focus", cargarProductos);

    return () => {
      controller.abort();
      window.clearInterval(intervalo);
      window.removeEventListener("focus", cargarProductos);
    };
  }, []);

  function irACategoria(id) {
    setActiva(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--cream)", minHeight: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Zilla+Slab:wght@400;500;600&display=swap');

        .bar-menu-root {
          --bg: #15110c;
          --surface: #1e1810;
          --surface2: #241d13;
          --accent: #d9902f;
          --accent-dark: #a85e1e;
          --cream: #f1e7d3;
          --muted: #b3a284;
          --divider: #34291a;
          font-family: 'Zilla Slab', serif;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .bar-menu-root *, .bar-menu-root *::before, .bar-menu-root *::after { box-sizing: border-box; }
        .bar-menu-root button { font: inherit; cursor: pointer; }
        .bar-menu-root h1, .bar-menu-root h2, .bar-menu-root h3, .bar-menu-root p { margin: 0; }
        .bm-status { padding: 16px 24px; color: var(--accent); text-align: center; font-family: 'Oswald', sans-serif; }
        .bm-status-error { color: #e58a72; }
        .bm-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .bm-heading { font-family: 'Oswald', sans-serif; }
        .bm-hero {
          padding: 56px 24px;
          text-align: center;
          background: radial-gradient(ellipse at 30% -10%, rgba(217,144,47,0.18), transparent 60%), var(--surface);
          border-bottom: 1px solid var(--divider);
        }
        .bm-hero h1 { font-size: clamp(4.25rem, 10vw, 6.5rem); line-height: 0.95; margin-top: 8px; }
        .bm-hero p:last-child { margin-top: 12px; font-size: 1rem; }
        .bm-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 16px;
          background: rgba(21,17,12,0.92);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--divider);
        }
        .bm-nav > div { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; width: min(100%, 768px); margin: 0 auto; }
        .bm-coaster {
          display: flex;
          flex: 0 1 80px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 80px;
          height: 80px;
          padding: 6px;
          border-radius: 50%;
          border: 2px solid var(--divider);
          background: var(--surface2);
          color: var(--muted);
          transition: all 0.2s ease;
        }
        .bm-coaster:hover { border-color: var(--accent-dark); color: var(--cream); }
        .bm-coaster.active { background: var(--accent); border-color: var(--accent); color: #1a1409; }
        .bm-coaster span { font-size: 10px; line-height: 1.1; text-align: center; text-transform: uppercase; }
        .bm-card {
          display: flex;
          min-width: 0;
          overflow: hidden;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--divider);
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .bm-card:hover { border-color: var(--accent-dark); transform: translateY(-2px); }
        .bm-card { min-height: 168px; }
        .bm-card > img { width: 168px; height: 168px; flex: 0 0 168px; object-fit: cover; }
        .bm-card > div { display: flex; min-width: 0; flex: 1; flex-direction: column; justify-content: space-between; gap: 12px; padding: 18px; }
        .bm-card h3 { font-size: 1.25rem; line-height: 1.15; }
        .bm-card p { margin-top: 6px; font-size: 1rem; line-height: 1.3; }
        .bm-card > div > div:last-child { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .bm-card > div > div:last-child > span:first-child { font-size: 10px; text-transform: uppercase; white-space: nowrap; }
        .bm-price {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 4px;
          padding: 4px 8px 4px 12px;
          font-family: 'Oswald', sans-serif;
          background: var(--accent);
          color: #1a1409;
          clip-path: polygon(14% 0%, 100% 0%, 100% 100%, 14% 100%, 0% 50%);
        }
        .bm-price-hole { width: 5px; height: 5px; border-radius: 50%; background: #1a1409; opacity: 0.35; }
        main { width: min(100%, 780px); margin: 0 auto; padding: 48px 24px; }
        main section { scroll-margin-top: 132px; margin-bottom: 56px; }
        main section > div:first-child { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
        .bm-section-title { font-family: 'Oswald', sans-serif; font-size: 1.5rem; line-height: 1.2; text-transform: uppercase; }
        .bm-section-subtitle { margin: 4px 0 16px; color: var(--accent); font-family: 'Oswald', sans-serif; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; }
        .bm-divider {
          height: 1px;
          background: repeating-linear-gradient(90deg, var(--divider), var(--divider) 6px, transparent 6px, transparent 12px);
        }
        main .grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        footer { padding: 32px 24px; text-align: center; font-size: 0.75rem; }
        footer .bm-divider { width: min(100%, 320px); margin: 0 auto 16px; }
        @media (max-width: 640px) {
          .bm-hero { padding: 44px 18px; }
          .bm-hero h1 { font-size: clamp(3.75rem, 18vw, 5rem); }
          .bm-hero p:last-child { font-size: 0.9rem; }
          .bm-nav { padding: 12px 8px; }
          .bm-nav > div { gap: 8px; }
          .bm-coaster { flex-basis: 64px; width: 64px; height: 64px; }
          .bm-coaster svg { width: 18px; height: 18px; }
          .bm-coaster span { font-size: 9px; }
          main { padding: 32px 16px; }
          main section { margin-bottom: 44px; }
          main .grid { grid-template-columns: 1fr; gap: 12px; }
          .bm-card { min-height: 132px; }
          .bm-card > img { width: 132px; height: 132px; flex-basis: 132px; }
          .bm-card > div { padding: 14px; }
          .bm-card h3 { font-size: 1.05rem; }
          .bm-card p { font-size: 0.9rem; }
          .bm-section-title { font-size: 1.3rem; }
        }
        @media (max-width: 420px) {
          main { padding-inline: 12px; }
          .bm-card { flex-direction: column; }
          .bm-card > img { width: 100%; height: 180px; flex-basis: 180px; }
          .bm-card > div { padding: 16px; }
        }
      `}</style>

      <div className="bar-menu-root">
        {cargando && <p className="bm-status">Cargando productos...</p>}
        {error && <p className="bm-status bm-status-error">Error al cargar productos</p>}
        <header className="bm-hero px-6 py-14 text-center">
          <p className="bm-heading text-xs tracking-[0.3em] uppercase" style={{ color: "var(--accent)" }}>Carta</p>
          <h1 className="bm-display text-6xl md:text-7xl mt-2" style={{ color: "var(--cream)" }}>El Rincón</h1>
          <p className="mt-3 text-sm md:text-base" style={{ color: "var(--muted)" }}>Bebidas, cerveza artesanal y algo para picar</p>
        </header>

        <nav className="bm-nav sticky top-0 z-10 px-4 py-4">
          <div className="flex gap-4 justify-center flex-wrap max-w-3xl mx-auto">
            {CATEGORIAS.map((cat) => {
              const Icon = cat.icon;
              const isActive = activa === cat.id;
              return (
                <button key={cat.id} onClick={() => irACategoria(cat.id)} className={`bm-coaster flex flex-col items-center justify-center gap-1 rounded-full w-20 h-20 ${isActive ? "active" : ""}`}>
                  <Icon width={20} height={20} />
                  <span className="bm-heading text-[10px] uppercase tracking-tight leading-tight text-center px-1">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-10">
          {!cargando && !error && CATEGORIAS.map((cat, idx) => {
            const tieneProductos = productos.some((product) => product.categoria === cat.id);
            if (!tieneProductos) return null;
            const Icon = cat.icon;
            return (
              <section key={cat.id} ref={(element) => (refs.current[cat.id] = element)} className="scroll-mt-28 mb-14">
                <div className="flex items-center gap-3 mb-1">
                  <Icon width={22} height={22} style={{ color: "var(--accent)" }} />
                  <h2 className="bm-section-title text-2xl uppercase tracking-wide" style={{ color: "var(--cream)" }}>{cat.label}</h2>
                </div>
                {cat.subtitulo && <p className="bm-section-subtitle">{cat.subtitulo}</p>}
                <div className="bm-divider mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {productos.map((product) => product.categoria === cat.id && (
                    <article key={product.id} className="bm-card rounded-lg overflow-hidden flex">
                      <img src={product.imagen_url} alt={product.nombre} className="w-28 h-28 object-cover flex-shrink-0" />
                      <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="bm-heading text-base leading-tight" style={{ color: "var(--cream)" }}>{product.nombre}</h3>
                          <p className="text-sm mt-1 leading-snug" style={{ color: "var(--muted)" }}>{product.descripcion}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] uppercase tracking-wide bm-heading" style={{ color: "var(--accent-dark)" }}>{product.categoria}</span>
                          <span className="bm-price flex items-center gap-1 text-sm font-semibold pl-3 pr-2 py-1"><span className="bm-price-hole" />${formatPrecio(product.precio)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                {idx < CATEGORIAS.length - 1 && <div className="h-px" />}
              </section>
            );
          })}
        </main>

        <footer className="text-center py-8 text-xs" style={{ color: "var(--muted)" }}>
          <div className="bm-divider max-w-xs mx-auto mb-4" />
          Precios en pesos argentinos · Sujetos a cambio sin previo aviso
        </footer>
      </div>
    </div>
  );
}
