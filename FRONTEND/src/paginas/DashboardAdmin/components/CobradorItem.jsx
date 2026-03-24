import { Badge, Dropdown } from "react-bootstrap";
import { IconUser, IconPhone, IconDots, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import "./CobradorItem.css";
const CobradorItem = ({ cobrador, onEditar, onEliminar }) => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return (
        <div className="list-item cobrador-item">
            <div className="list-item-icon primary">
                <IconUser />
            </div>
            <div className="list-item-content">
                <div className="list-item-title-row">
                    <h5 className="list-item-title">{cobrador.nombre}</h5>
                </div>
                <p className="list-item-subtitle">
                    <IconPhone size={14} className="cobrador-item .list-item-icon" />
                    {cobrador.telefono || "Sin teléfono"}
                </p>
            </div>
            <div className="list-item-info">
                <div className="list-item-info-item">
                    <span className="list-item-info-label">Usuario</span>
                    <span className="list-item-info-value">{cobrador.usuarioLogin || "-"}</span>
                </div>
                <div className="list-item-info-item">
                    <span className="list-item-info-label">Zona</span>
                    <span className="list-item-info-value">
                        {cobrador.zonaACargo && cobrador.zonaACargo.length > 0 ? (
                            <div className="d-flex flex-column gap-1">
                                {cobrador.zonaACargo.map((zona, index) => (
                                    <Badge
                                        key={zona._id}
                                        bg="success"
                                        className="cobrador-zona-badge"
                                    >
                                        {zona.nombre}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <Badge
                                bg="warning"
                                className="cobrador-no-zona-badge"
                            >
                                Sin Zona
                            </Badge>
                        )}
                    </span>
                </div>
            </div>
            <div className="list-item-actions">
                {isMobile ? (
                    <Dropdown drop="start">
                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-actions"
                            className="list-item-dropdown-toggle"
                        >
                            <IconDots size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditar(cobrador);
                                }}
                            >
                                <IconEdit className="me-2" size={16} />
                                Editar
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEliminar(cobrador);
                                }}
                            >
                                <IconTrash className="me-2" size={16} />
                                Eliminar
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                ) : (
                    <>
                        <button
                            className="list-item-action-btn btn-editar"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditar(cobrador);
                            }}
                            title="Editar cobrador"
                        >
                            <IconEdit />
                        </button>
                        <button
                            className="list-item-action-btn btn-eliminar"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEliminar(cobrador);
                            }}
                            title="Eliminar cobrador"
                        >
                            <IconTrash />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
export default CobradorItem;
