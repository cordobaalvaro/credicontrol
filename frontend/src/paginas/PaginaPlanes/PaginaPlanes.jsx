import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";
import PageHeader from "../../componentes/layout/PageHeader";
import "./PaginaPlanes.css";
import usePlanes from "../../hooks/usePlanes";
import ModalSeleccionarCobrador from "../../componentes/modales/ModalSeleccionarCobrador";
import {
  IconPlus,
  IconRowInsertTop,
  IconRowInsertBottom,
  IconDeviceFloppy,
  IconRefresh,
  IconFileTypePdf,
  IconTable,
  IconChevronRight,
  IconTool,
  IconSelector,
} from "@tabler/icons-react"
import PageLoading from "../../componentes/ui/PageLoading";
const PaginaPlanes = () => {
  const [tablaSeleccionada, setTablaSeleccionada] = useState(
    new URLSearchParams(window.location.search).get("tabla") || "tabla-semanal"
  );
  const {
    isAdmin,
    montos,
    planes,
    loading,
    message,
    contentMaxWidth,
    containerRef,
    addRow,
    addRowTop,
    removeRow,
    addPlan,
    removePlan,
    onMontoChange,
    onSemanasChange,
    onMontoPlanChange,
    blockInvalidNumberKeys,
    saveTable,
    updateTable,
    loadLatest,
    fmtMoney,
    exportPDF,
    showModalCobrador,
    setShowModalCobrador,
    handleSeleccionarCobrador,
    generarTablas,
  } = usePlanes();
  const tablasDisponibles = [
    { value: "tabla-semanal", label: "Tabla Semanal" },
    { value: "tabla-quincenal", label: "Tabla Quincenal" },
    { value: "tabla-mensual", label: "Tabla Mensual" },
  ];
  const cambiarTabla = (nuevaTabla) => {
    setTablaSeleccionada(nuevaTabla);
    const newUrl = new URL(window.location);
    newUrl.searchParams.set("tabla", nuevaTabla);
    window.history.pushState({}, "", newUrl);
    window.location.reload(); 
  };
  const getPeriodoLabel = () => {
    switch (tablaSeleccionada) {
      case "tabla-semanal":
        return "Sem";
      case "tabla-quincenal":
        return "Quin";
      case "tabla-mensual":
        return "Men";
      default:
        return "Sem";
    }
  };
  if (loading && planes.length === 0) {
    return <PageLoading message="Cargando planes..." />;
  }
  return (
    <div className="admin-container">
      <PageHeader
        iconClass="bi bi-table"
        title="Planes"
        subtitle="Configurá los montos y semanas por plan. Guardá y recuperá versiones cuando quieras."
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      <Container fluid>
        <div
          className={`tabla-content ${contentMaxWidth ? 'tabla-content-custom' : ''}`}
        >
          {}
          <div className="planes-selector-bar">
            <div className="planes-selector-group">
              <span className="planes-selector-label">
                <IconSelector size={16} />
                Tabla Actual
              </span>
              <Form.Select
                value={tablaSeleccionada}
                onChange={(e) => cambiarTabla(e.target.value)}
                className="planes-selector-select"
                disabled={loading}
              >
                {tablasDisponibles.map((tabla) => (
                  <option key={tabla.value} value={tabla.value}>
                    {tabla.label}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
          <div className="planes-control-bar">
            <div className="planes-control-group">
              {isAdmin && <span className="planes-control-label">Acciones de Tabla</span>}
              <div className="planes-control-buttons">
                {isAdmin && (
                  <>
                    <button type="button" className="planes-btn planes-btn--primary" onClick={addPlan}>
                      <IconPlus size={18} />
                      <span>Plan</span>
                    </button>
                    <button type="button" className="planes-btn planes-btn--secondary" onClick={addRowTop}>
                      <IconRowInsertTop size={18} />
                      <span>Fila arriba</span>
                    </button>
                    <button type="button" className="planes-btn planes-btn--secondary" onClick={addRow}>
                      <IconRowInsertBottom size={18} />
                      <span>Fila abajo</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="planes-control-group">
              <span className="planes-control-label">Guardar</span>
              <div className="planes-control-buttons">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      className="planes-btn planes-btn--success"
                      onClick={saveTable}
                      disabled={loading}
                    >
                      <IconDeviceFloppy size={18} />
                      <span>Nuevo</span>
                    </button>
                    <button
                      type="button"
                      className="planes-btn planes-btn--success"
                      onClick={updateTable}
                      disabled={loading}
                    >
                      <IconDeviceFloppy size={18} />
                      <span>Cambios</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="planes-btn planes-btn--outline"
                  onClick={loadLatest}
                  disabled={loading}
                >
                  <IconRefresh size={18} />
                  <span>Cargar último</span>
                </button>
                <button
                  type="button"
                  className="planes-btn planes-btn--danger-outline"
                  onClick={exportPDF}
                  disabled={loading}
                >
                  <IconFileTypePdf size={18} />
                  <span>PDF</span>
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    className="planes-btn planes-btn--warning"
                    onClick={generarTablas}
                    disabled={loading}
                  >
                    <IconTool size={18} />
                    <span>Generar Tablas</span>
                  </button>
                )}
              </div>
            </div>
            <div className="planes-info-badge">
              <IconTable size={16} />
              <span>
                {planes.length} {planes.length === 1 ? "Plan" : "Planes"}
              </span>
              <IconChevronRight size={14} />
              <span>
                {montos.length} {montos.length === 1 ? "Fila" : "Filas"}
              </span>
            </div>
          </div>
          <div className="planes-table-card">
            {message ? (
              <div className="tabla-status">{message}</div>
            ) : null}
            <div ref={containerRef} className="tabla-scroll">
              <table className="tabla-grid" cellPadding="6">
                <thead>
                  <tr>
                    <th rowSpan={2}>Monto</th>
                    {planes.map((pl, idx) => (
                      <th key={idx} colSpan={2} className="tabla-plan-head">
                        <div className="plan-header-container">
                          <input
                            value={pl.nombre}
                            onChange={(e) =>
                              setPlanes((prev) =>
                                prev.map((p, i) =>
                                  i === idx ? { ...p, nombre: e.target.value } : p
                                )
                              )
                            }
                            readOnly={!isAdmin}
                          />
                          {isAdmin && (
                            <button
                              type="button"
                              className="tabla-btn tabla-btn--danger"
                              onClick={() => removePlan(idx)}
                              title="Eliminar plan"
                            >
                              âœ•
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                    {isAdmin && <th rowSpan={2}>Acciones</th>}
                  </tr>
                  <tr className="tabla-subhead">
                    {planes.map((_, idx) => (
                      <React.Fragment key={idx}>
                        <th>{getPeriodoLabel()}</th>
                        <th>Monto</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {montos.map((valor, rIdx) => (
                    <tr key={rIdx}>
                      <td>
                        <input
                          type="number"
                          value={valor}
                          onChange={(e) => onMontoChange(rIdx, e.target.value)}
                          placeholder={fmtMoney(valor)}
                          min={0}
                          step={1}
                          onKeyDown={blockInvalidNumberKeys}
                          className="tabla-input tabla-input--right"
                          readOnly={!isAdmin}
                        />
                      </td>
                      {planes.map((pl, pIdx) => (
                        <React.Fragment key={`${pIdx}-${rIdx}`}>
                          <td>
                            <input
                              type="number"
                              value={pl.filas[rIdx]?.semanas ?? 0}
                              onChange={(e) =>
                                onSemanasChange(pIdx, rIdx, e.target.value)
                              }
                              min={0}
                              step={1}
                              onKeyDown={blockInvalidNumberKeys}
                              className="tabla-input tabla-input--center"
                              readOnly={!isAdmin}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={pl.filas[rIdx]?.monto ?? 0}
                              onChange={(e) =>
                                onMontoPlanChange(pIdx, rIdx, e.target.value)
                              }
                              placeholder={fmtMoney(pl.filas[rIdx]?.monto ?? 0)}
                              min={0}
                              step={1}
                              onKeyDown={blockInvalidNumberKeys}
                              className="tabla-input tabla-input--right"
                              readOnly={!isAdmin}
                            />
                          </td>
                        </React.Fragment>
                      ))}
                      {isAdmin && (
                        <td className="tabla-actions-cell">
                          <button
                            type="button"
                            className="tabla-btn tabla-btn--danger"
                            onClick={() => removeRow(rIdx)}
                          >
                            Eliminar fila
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {montos.length === 0 && (
                    <tr>
                      <td
                        colSpan={1 + planes.length * 2 + (isAdmin ? 1 : 0)}
                        className="tabla-empty-message"
                      >
                        Sin filas. Agrega una para empezar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
      {}
      <ModalSeleccionarCobrador
        show={showModalCobrador}
        onHide={() => setShowModalCobrador(false)}
        onSeleccionar={handleSeleccionarCobrador}
      />
    </div>
  );
};
export default PaginaPlanes;
