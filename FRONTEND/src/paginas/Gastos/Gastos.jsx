import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Card,
    Table,
    Spinner,
    Badge,
    Alert
} from "react-bootstrap";
import { IconPlus, IconTrash, IconReceipt2, IconCalendarStats, IconCurrencyDollar, IconEdit } from "@tabler/icons-react";
import Swal from "sweetalert2";
import ModalCrearGasto from "./components/ModalCrearGasto";
import useGastos from "../../hooks/useGastos";
import PageHeader from "../../componentes/layout/PageHeader";
import PageLoading from "../../componentes/ui/PageLoading";
import "./Gastos.css";
const formatearMonto = (monto) => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(monto);
};
const formatearFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString("es-AR", opciones);
};
const Gastos = () => {
    const {
        gastos, loading, error, filtroMes, setFiltroMes,
        borrarGasto, cargarGastos, crearGasto, editarGasto
    } = useGastos();
    const [showModal, setShowModal] = useState(false);
    const [gastoSeleccionado, setGastoSeleccionado] = useState(null);
    const handleNuevoGasto = () => {
        setGastoSeleccionado(null);
        setShowModal(true);
    };
    const handleEditarGasto = (gasto) => {
        setGastoSeleccionado(gasto);
        setShowModal(true);
    };
    const handleBorrarGasto = async (idGasto) => {
        const result = await Swal.fire({
            title: "¿Está seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
        if (!result.isConfirmed) {
            return;
        }
        try {
            const response = await borrarGasto(idGasto);
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Gasto eliminado exitosamente",
                    timer: 1500,
                    showConfirmButton: false
                });
                cargarGastos(); 
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error || "No se pudo eliminar el gasto",
            });
        }
    };
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    if (loading) {
        return <PageLoading message="Cargando gastos..." />;
    }
    return (
        <>
            <div className="mb-4">
                <PageHeader
                    title="Gestión de Gastos"
                    subtitle="Registre y administre los gastos generales del sistema"
                    iconClass="bi bi-wallet2"
                    showBackButton={true}
                    onBackClick={() => navigate(-1)}
                    rightContent={
                        <Button
                            variant="light"
                            className="d-inline-flex align-items-center py-2 px-4 fw-bold shadow-sm gastos-btn-nuevo"
                            onClick={handleNuevoGasto}
                        >
                            <IconPlus size={20} className="me-2" />
                            Registrar Nuevo Gasto
                        </Button>
                    }
                />
            </div>
            <Container fluid className="px-4 py-4">
                {}
                {}
                <Row className="mb-4">
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 gastos-card-total">
                            <Card.Body className="d-flex align-items-center">
                                <div className="me-3 p-3 bg-danger bg-opacity-10 rounded-circle text-danger">
                                    <IconCurrencyDollar size={24} />
                                </div>
                                <div>
                                    <h6 className="text-muted fw-semibold mb-1">Total Gastos (Filtrado)</h6>
                                    <h3 className="mb-0 fw-bold text-danger">{formatearMonto(totalGastos)}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 gastos-card-filtro">
                            <Card.Body className="d-flex align-items-center">
                                <div className="me-3 p-3 bg-primary bg-opacity-10 rounded-circle text-primary">
                                    <IconCalendarStats size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="text-muted fw-semibold mb-1">Filtrar por Mes</h6>
                                    <input
                                        type="month"
                                        className="form-control form-control-sm gastos-input-mes"
                                        value={filtroMes}
                                        onChange={(e) => setFiltroMes(e.target.value)}
                                    />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {}
                <Card className="border-0 shadow-sm gastos-table-card">
                    <Card.Header className="bg-white border-bottom-0 py-3">
                        <h5 className="mb-0 fw-semibold gastos-table-title">Detalle de Movimientos</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {error ? (
                            <Alert variant="danger" className="m-3 text-center">{error}</Alert>
                        ) : gastos.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <IconReceipt2 size={48} className="mb-3 opacity-50" />
                                <p>No hay gastos registrados para el período seleccionado.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 px-4 text-muted fw-medium border-0">Fecha</th>
                                            <th className="py-3 px-4 text-muted fw-medium border-0">Tipo</th>
                                            <th className="py-3 px-4 text-muted fw-medium border-0">Descripción</th>
                                            <th className="py-3 px-4 text-muted fw-medium border-0">Registrado Por</th>
                                            <th className="py-3 px-4 text-muted fw-medium border-0 text-end">Monto</th>
                                            <th className="py-3 px-4 text-muted fw-medium border-0 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gastos.map((gasto) => (
                                            <tr key={gasto._id}>
                                                <td className="py-3 px-4">
                                                    <span className="gastos-fecha">{formatearFecha(gasto.fecha)}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge bg="secondary" className="px-2 py-1 gastos-tipo-badge">
                                                        {gasto.tipo.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 gastos-descripcion-cell">
                                                    <span className="text-truncate d-inline-block w-100" title={gasto.descripcion}>
                                                        {gasto.descripcion || <span className="text-muted fst-italic">Sin descripción</span>}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-muted small">
                                                    {gasto.registradoPor ? gasto.registradoPor.nombre : "Sistema"}
                                                </td>
                                                <td className="py-3 px-4 text-end fw-bold text-danger">
                                                    {formatearMonto(gasto.monto)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="text-primary rounded-circle p-2 me-2"
                                                        onClick={() => handleEditarGasto(gasto)}
                                                        title="Editar Gasto"
                                                    >
                                                        <IconEdit size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="text-danger rounded-circle p-2"
                                                        onClick={() => handleBorrarGasto(gasto._id)}
                                                        title="Eliminar Gasto"
                                                    >
                                                        <IconTrash size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
                {}
                <ModalCrearGasto
                    show={showModal}
                    onHide={() => {
                        setShowModal(false);
                        setGastoSeleccionado(null);
                    }}
                    gastoAEditar={gastoSeleccionado}
                    onGuardarGasto={async (data) => {
                        if (gastoSeleccionado) {
                            return await editarGasto(gastoSeleccionado._id, data);
                        } else {
                            return await crearGasto(data);
                        }
                    }}
                    onGastoCreado={() => {
                        setShowModal(false);
                        setGastoSeleccionado(null);
                        cargarGastos();
                    }}
                />
            </Container>
        </>
    );
};
export default Gastos;
