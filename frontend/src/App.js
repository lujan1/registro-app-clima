import { useState, useEffect } from "react";
import "./App.css";
import StarBackground from "./StarBackground";
import ForecastCarousel from "./ForecastCarousel";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  // Estados para autenticación
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" o "register"
  const [authForm, setAuthForm] = useState({ nombre: "", email: "", password: "" });
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  // API_BASE cambia según si estás en localhost o en producción
  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "";

  // Obtener clima actual
  const getWeather = async (e) => {
    e && e.preventDefault();
    if (!city.trim()) return setError("Ingresa una ciudad válida");

    setError(null);
    setWeather(null);
    setForecast([]);

    try {
      const res = await fetch(
        `${API_BASE}/clima/${encodeURIComponent(city)}?lang=es`
      );
      const data = await res.json();
      if (!res.ok || !data.ciudad) {
        setError(data.error || "Ciudad no encontrada");
        return;
      }
      setWeather(data);
      // luego pedir pronóstico
      fetchForecast(city);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el backend");
    }
  };

  // Pronóstico 24h
  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(
        `${API_BASE}/pronostico/${encodeURIComponent(cityName)}?lang=es`
      );
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setError(data.error || "No se pudo obtener pronóstico");
        return;
      }
      setForecast(data);
    } catch (err) {
      console.error("Error pronóstico:", err);
      setError("Error al obtener pronóstico");
    }
  };

  // Funciones de autenticación
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const endpoint = authMode === "register" ? "/api/users/register" : "/api/users/login";

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || data.message || "Error en autenticación");
        return;
      }

      setAuthSuccess(data.message || "Operación exitosa");
      if (authMode === "login") {
        setUser(data.user);
        setAuthForm({ nombre: "", email: "", password: "" });
        setAuthError(null);
        setAuthSuccess(null);
      } else {
        // Registro exitoso, cambiar a login
        setAuthMode("login");
        setAuthForm({ nombre: "", email: "", password: "" });
        setAuthError(null);
        setAuthSuccess(null);
      }
    } catch (err) {
      console.error(err);
      setAuthError("Error al conectar con el servidor");
    }
  };

  const logout = () => {
    setUser(null);
    setAuthMode("login");
    setAuthForm({ nombre: "", email: "", password: "" });
    setAuthError(null);
    setAuthSuccess(null);
  };

  // Reloj según timezone del clima actual
  useEffect(() => {
    if (weather && weather.timezone !== undefined) {
      const updateClock = () => {
        const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
        const local = new Date(utc + (weather.timezone || 0) * 1000);
        setTime(local.toLocaleTimeString());
        setDate(
          local.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
      };
      updateClock();
      const id = setInterval(updateClock, 1000);
      return () => clearInterval(id);
    }
  }, [weather]);

  return (
    <div className="app-shell">
      <StarBackground />
      <div className="ui-card">
        <header className="ui-header">
          <h1 className="brand">APP CLIMA</h1>
          {user ? (
            <div className="user-info">
              <span>👤 {user.nombre} ({user.email})</span>
              <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
            </div>
          ) : (
            <div className="auth-section">
              <button onClick={() => setAuthMode("login")} className={authMode === "login" ? "active" : ""}>Iniciar Sesión</button>
              <button onClick={() => setAuthMode("register")} className={authMode === "register" ? "active" : ""}>Registrarse</button>
            </div>
          )}
          <form onSubmit={getWeather} className="search-row">
            <input
              className="search-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: London"
            />
            <button className="search-btn" type="submit">
              Buscar
            </button>
          </form>
        </header>

        {!user && (
          <section className="auth-form-section">
            <h2>{authMode === "login" ? "Iniciar Sesión" : "Registrarse"}</h2>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Nombre"
                  value={authForm.nombre}
                  onChange={(e) => setAuthForm({ ...authForm, nombre: e.target.value })}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
              <button type="submit" className="auth-submit-btn">
                {authMode === "login" ? "Iniciar Sesión" : "Registrarse"}
              </button>
            </form>
            {authError && <div className="auth-error">{authError}</div>}
            {authSuccess && <div className="auth-success">{authSuccess}</div>}
          </section>
        )}

        {error && <div className="error-bar">{error}</div>}

        {weather && (
          <section className="current-section">
            <div className="current-left">
              <h2 className="city-name">{weather.ciudad}</h2>
              <div className="meta-row">
                <div className="clock">🕒 {time}</div>
                <div className="date">📅 {date}</div>
              </div>
              <div className="temp-large">{weather.temperatura}°C</div>
              <div className="desc-large">{weather.clima}</div>
              <div className="wind">💨 {weather.viento} m/s</div>
            </div>
            <div className="current-right">
              <div className="big-advice">{generateAdvice(weather.clima)}</div>
            </div>
          </section>
        )}

        {forecast && forecast.length > 0 && (
          <section className="forecast-section">
            <h3 className="section-title">Pronóstico (24h)</h3>
            <ForecastCarousel data={forecast} />
          </section>
        )}

        <footer className="ui-footer">Backend: {API_BASE}</footer>
      </div>
    </div>
  );
}

// Generador de consejos según clima
function generateAdvice(climaDesc = "") {
  const d = climaDesc.toLowerCase();
  if (d.includes("rain") || d.includes("lluv")) {
    return "☔ Parece que lloverá — lleva sombrilla y cuida tus planes. ¡Disfruta con estilo incluso bajo la lluvia!";
  }
  if (d.includes("storm") || d.includes("torment") || d.includes("thunder")) {
    return "⚡ Tormenta en camino — evita zonas abiertas y resguarda objetos sueltos. Seguridad primero.";
  }
  if (d.includes("snow") || d.includes("nieve")) {
    return "❄ Nieve probable — abrígate y disfruta del paisaje helado.";
  }
  if (d.includes("clear") || d.includes("despejad")) {
    return "☀ Día soleado — protector solar y gafas recomendadas.";
  }
  if (d.includes("cloud") || d.includes("nubes")) {
    return "☁ Nublado — un día perfecto para café y música.";
  }
  if (d.includes("mist") || d.includes("fog") || d.includes("niebla")) {
    return "🌫 Visibilidad reducida — maneja con precaución.";
  }
  return "🌈 Mantente preparado y disfruta del día.";
}

export default App;
