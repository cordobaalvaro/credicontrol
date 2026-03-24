# CrediControl 💳

> Sistema completo de gestión de créditos y cobranzas — Monorepo (Frontend + Backend)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?logo=electron)](https://www.electronjs.org/)

---

## ¿Qué es CrediControl?

**CrediControl** es una aplicación desktop/web de gestión de créditos y cobranzas, diseñada para pequeñas financieras y prestamistas. Permite administrar clientes, préstamos, cobradores, zonas geográficas, tablas de cobro semanales y generar reportes en PDF — todo desde una interfaz moderna y responsiva.

La aplicación funciona como **app de escritorio (Electron)** con comunicación a un backend REST en Node.js y una base de datos en MongoDB Atlas.

---

## 🏗️ Arquitectura del Proyecto

```
credicontrol/
├── FRONTEND/          # React 19 + Vite + Electron (app de escritorio)
└── BACKEND/           # Node.js + Express + MongoDB (API REST)
```

El proyecto sigue una separación estricta de responsabilidades:
- El **FRONTEND** gestiona la experiencia de usuario y no contiene lógica de negocio crítica.
- El **BACKEND** es la autoridad de todas las reglas de negocio, validaciones y seguridad.

---

## ✨ Funcionalidades Principales

| Módulo | Descripción |
|--------|-------------|
| 🔐 **Autenticación** | JWT con Access Token + Refresh Token (cookie HttpOnly), roles Admin y Cobrador |
| 👥 **Clientes** | CRUD completo con validaciones (DNI, teléfono, dirección), tipos de cliente, documentos |
| 💰 **Préstamos** | Creación con planes configurables (semanal/quincenal/mensual), seguimiento de cuotas, estados (activo/cancelado/vencido/refinanciado) |
| 🗺️ **Zonas** | Gestión geográfica, asignación de cobradores, métricas por zona |
| 📋 **Tablas de cobro** | Organización semanal de cobros por cobrador, registro de pagos, exportación PDF |
| 📊 **Reportes** | Generación de PDF (comprobantes, resúmenes, tablas de amortización, registros de cobros) |
| 🔔 **Notificaciones** | Alertas automáticas para préstamos por vencer, cron de actualización nocturno |
| 📈 **Dashboard** | Métricas consolidadas para Admin, métricas de zona para Cobrador |
| 🧾 **Balance** | Registro de gastos del negocio y cálculo de ganancias |

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** + **Vite** — Build rápido con HMR
- **Electron** — Empaquetado como aplicación desktop
- **React Bootstrap 5** — UI components estilizados
- **React Router DOM 7** — Navegación SPA
- **Axios** — HTTP client con interceptores JWT automáticos
- **jsPDF + @react-pdf/renderer** — Generación de PDFs en cliente
- **SweetAlert2** — Notificaciones y confirmaciones

### Backend
- **Node.js 18+** + **Express 4** — API REST
- **MongoDB + Mongoose** — Base de datos NoSQL
- **JWT** (access + refresh tokens) — Autenticación segura
- **node-cron** — Actualización automática de estados de préstamos a medianoche
- **Cloudinary** — Almacenamiento de documentos de clientes
- **Render** — Plataforma de despliegue del backend

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- MongoDB Atlas (o local)
- Cuenta de Cloudinary (opcional, para documentos)

### 1. Clonar el repositorio

```bash
git clone https://github.com/cordobaalvaro/credicontrol.git
cd credicontrol
```

### 2. Configurar y levantar el Backend

```bash
cd BACKEND
npm install
# Crear .env con las variables necesarias (ver BACKEND/README.md)
npm run dev
```

### 3. Configurar y levantar el Frontend

```bash
cd FRONTEND
npm install
# Crear .env con VITE_API_BASE_URL=http://localhost:5000/api
npm run dev         # Web en localhost:5173
npm run electron-dev  # App de escritorio
```

---

## 📁 Documentación Detallada

- 📖 **[FRONTEND/README.md](./FRONTEND/README.md)** — Instalación, estructura, rutas, deploy en Vercel
- 📖 **[BACKEND/README.md](./BACKEND/README.md)** — Endpoints, variables de entorno, estructura MVC, deploy en Render

---

## 📸 Capturas de Pantalla

> *Próximamente — el sistema está en producción activa.*

---

## 👤 Autor

**Álvaro Córdoba**
- GitHub: [@cordobaalvaro](https://github.com/cordobaalvaro)
- LinkedIn: [linkedin.com/in/cordobaalvaro](https://www.linkedin.com/in/cordobaalvaro/)

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver [LICENSE](./LICENSE) para más detalles.

---

<p align="center">Desarrollado con ❤️ — CrediControl © 2025</p>
