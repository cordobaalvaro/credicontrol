import { useState, useEffect } from "react";
import { usuarioService } from "../../../services";
const useModalSeleccionarCobrador = ({ show, onHide, onSeleccionar }) => {
    const [cobradores, setCobradores] = useState([]);
    const [cobradorSeleccionado, setCobradorSeleccionado] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (show) {
            fetchCobradores();
        }
    }, [show]);
    const fetchCobradores = async () => {
        try {
            setLoading(true);
            const response = await usuarioService.getUsuarios();
            const soloCobradores = (Array.isArray(response.data) ? response.data : []).filter(
                (usuario) => usuario.rol === "cobrador"
            );
            setCobradores(soloCobradores);
        } catch (error) {
            console.error("Error al cargar cobradores:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSeleccionar = () => {
        if (cobradorSeleccionado) {
            const cobrador = cobradores.find((c) => c._id === cobradorSeleccionado);
            onSeleccionar(cobrador);
            onHide();
            setCobradorSeleccionado("");
        }
    };
    const handleClose = () => {
        onHide();
        setCobradorSeleccionado("");
    };
    return {
        cobradores,
        cobradorSeleccionado,
        setCobradorSeleccionado,
        loading,
        handleSeleccionar,
        handleClose,
    };
};
export default useModalSeleccionarCobrador;
