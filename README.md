# CrediControl - Solución Integral de Creditos

Este repositorio contiene la plataforma **CrediControl**, un sistema avanzado para la gestión de créditos, préstamos y cobranzas diseñado para PYMES financieras. 

El proyecto está estructurado de manera modular, separando el ecosistema de servicios (Backend) de la interfaz de usuario (Frontend).

## 📂 Estructura del Proyecto

- **/backend**: API REST desarrollada con Node.js, Express y MongoDB (Mongoose). Maneja la lógica de negocio, autenticación JWT, procesos programados (cron) y comunicación con la base de datos.
- **/frontend**: Aplicación SPA moderna desarrollada con React 19 y Vite. Ofrece dashboards interactivos para Administradores y Cobradores, con generación de reportes PDF dinámicos y notificaciones en tiempo real.

## 🚀 Inicio Rápido

### Requisitos previos
- Node.js 18+
- Instancia de MongoDB (Local o Atlas)

### Configuración
Cada carpeta cuenta con su propio archivo `README.md` detallado con instrucciones de instalación y variables de entorno (`.env`).

1. **Instalar dependencias**:
   Ejecutar `npm install` tanto en la carpeta `backend/` como en `frontend/`.

2. **Ejecución**:
   - Backend: `npm run dev` desde la carpeta backend.
   - Frontend: `npm run dev` desde la carpeta frontend.

## 🛠️ Tecnologías Principales
- **Base de Datos**: MongoDB
- **Backend**: Node.js, Express, JWT, Mongoose
- **Frontend**: React 19, Vite, Bootstrap, Axios, Day.js
- **Utilidades**: jsPDF, React-PDF, Handsontable, SweetAlert2

---
*Desarrollado para la gestión profesional y escalable de cobranzas.*
