import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { IconReceipt2, IconCheck, IconX, IconEdit } from "@tabler/icons-react";
import Swal from "sweetalert2";
import "./ModalCrearGasto.css";
const TIPOS_GASTO = [
    "Alquiler",
    "Sueldos",
    "Insumos",
    "Servicios (Luz, Agua, Internet)",
    "Impuestos",
    "Mantenimiento",
    "Movilidad / Combustible",
    "Varios / Otros"
];
const ModalCrearGasto = ({ show, onHide, onGastoCreado, gastoAEditar = null, onGuardarGasto }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        monto: "",
        tipo: "",
        descripcion: "",
        fecha: new Date().toISOString().slice(0, 16) 
    });
    useEffect(() => {
        if (gastoAEditar) {
            setFormData({
                monto: gastoAEditar.monto || "",
                tipo: gastoAEditar.tipo || "",
                descripcion: gastoAEditar.descripcion || "",
                fecha: gastoAEditar.fecha ? new Date(gastoAEditar.fecha).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
            });
        } else {
            setFormData({
                monto: "",
                tipo: "",
                descripcion: "",
                fecha: new Date().toISOString().slice(0, 16)
            });
        }
    }, [gastoAEditar, show]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.monto || formData.monto <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Ingrese un monto válido mayor a 0.",
            });
            return;
        }
        if (!formData.tipo) {
            Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Seleccione un tipo de gasto.",
            });
            return;
        }
        try {
            setLoading(true);
            const dataAEnviar = {
                ...formData,
                monto: Number(formData.monto)
            };
            const response = await onGuardarGasto(dataAEnviar);
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: `Gasto ${gastoAEditar ? 'actualizado' : 'registrado'} correctamente.`,
                    timer: 2000,
                    showConfirmButton: false
                });
                setFormData({
                    monto: "",
                    tipo: "",
                    descripcion: "",
                    fecha: new Date().toISOString().slice(0, 16)
                });
                onGastoCreado(); 
            }
        } catch (error) {
            console.error(`Error al ${gastoAEditar ? 'actualizar' : 'registrar'} gasto:`, error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error || `Hubo un error al ${gastoAEditar ? 'actualizar' : 'registrar'} el gasto.`,
            });
        } finally {
            setLoading(false);
        }
    };
    const isEditing = !!gastoAEditar;
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="d-flex align-items-center fw-bold modal-gasto-title">
                    <div
                        className={`me-2 d-flex align-items-center justify-content-center ${isEditing ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'} modal-gasto-icon-container`}
                    >
                        {isEditing ? <IconEdit size={20} /> : <IconReceipt2 size={20} />}
                    </div>
                    {isEditing ? "Editar Gasto" : "Registrar Nuevo Gasto"}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="pt-3">
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium text-muted small">Monto (ARS) *</Form.Label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">$</span>
                            <Form.Control
                                type="number"
                                name="monto"
                                value={formData.monto}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                min="1"
                                step="1"
                                className="border-start-0 ps-0 modal-gasto-input-group"
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium text-muted small">Tipo de Gasto *</Form.Label>
                        <Form.Select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            required
                            className="shadow-sm"
                        >
                            <option value="">Seleccione una categoría...</option>
                            {TIPOS_GASTO.map((tipo, idx) => (
                                <option key={idx} value={tipo}>{tipo}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-medium text-muted small">Fecha</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="shadow-sm"
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label className="fw-medium text-muted small">Descripción (Opcional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Detalles sobre el gasto..."
                            className="shadow-sm"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button
                        variant="light"
                        onClick={onHide}
                        disabled={loading}
                        className="d-flex align-items-center"
                    >
                        <IconX size={18} className="me-1" />
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        type="submit"
                        disabled={loading}
                        className="d-flex align-items-center shadow-sm"
                    >
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <IconCheck size={18} className="me-1" />
                                Confirmar Gasto
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default ModalCrearGasto;
