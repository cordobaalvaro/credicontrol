import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./NotFound.css";
const NotFound = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const rol = user?.rol;
    const handleVolver = () => {
        if (rol === "admin") {
            navigate("/dashboard");
        } else if (rol === "cobrador") {
            navigate("/dashboard");
        } else {
            navigate("/");
        }
    };
    return (
        <div className="notfound-container">
            {}
            <div className="notfound-number">404</div>
            {}
            <div className="notfound-icon">ðŸ”</div>
            {}
            <h1 className="notfound-title">Página no encontrada</h1>
            {}
            <p className="notfound-description">
                La dirección que ingresaste no existe o fue movida.
                <br />
                Verificá la URL o volvé al inicio.
            </p>
            {}
            <button
                onClick={handleVolver}
                className="notfound-button"
            >
                â† Volver al inicio
            </button>
            {}
            <p className="notfound-footer">Sistema de Gestión Intranet</p>
        </div>
    );
};
export default NotFound;
