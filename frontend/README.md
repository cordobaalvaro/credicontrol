# CrediControl — Frontend

> Aplicación web para gestión de créditos, desarrollada con React 19 + Vite.

---

## 🛠️ Stack

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool + HMR |
| React Router DOM | 7 | Navegación SPA |
| React Bootstrap | 2 + Bootstrap 5 | Componentes UI |
| Axios | 1.x | HTTP client con interceptores JWT |
| SweetAlert2 | 11 | Alertas y confirmaciones |
| jsPDF + jsPDF-AutoTable | 3.x | Generación de PDFs en cliente |
| @react-pdf/renderer | 4 | PDFs con JSX |
| Handsontable | 16 | Tablas editables |

---

## 📦 Instalación

```bash
cd frontend
npm install
```

Crear archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Scripts

```bash
npm run dev            # Servidor web en http://localhost:5173
npm run build          # Build de producción
npm run preview        # Preview del build
npm run lint           # Linting con ESLint
```

---

## 🏗️ Estructura

```
src/
├── componentes/          # Componentes reutilizables
│   ├── layout/           # PageHeader, navbar
│   ├── modales/          # Modales compartidos
│   ├── pdf/              # Generadores de PDF
│   └── ui/               # Botones, loaders, etc.
├── context/              # AuthContext (estado global de sesión)
├── helpers/              # axios.helpers.js (interceptores JWT), branding
├── hooks/                # Todos los custom hooks (lógica reutilizable)
├── paginas/              # Vistas principales
│   ├── Login.jsx
│   ├── DashboardAdmin/
│   ├── DashboardCobrador/
│   ├── PaginaZona/
│   ├── PaginaCliente/
│   ├── DetallePrestamo/
│   ├── VerTodosLosClientes/
│   ├── VerTodosLosPrestamos/
│   ├── TablasSemanalesClientes/
│   ├── TablasSemanalesCobrador/
│   └── PaginaPlanes/
├── services/             # Llamadas HTTP (auth, clientes, prestamos, etc.)
├── validators/           # Validaciones compartidas de formularios
└── AppRouter.jsx         # Definición de rutas y protección por rol
```

---

## 👥 Roles de Usuario

### Admin
- Dashboard con métricas globales y por zona
- CRUD de clientes, préstamos, cobradores y zonas
- Gestión de tablas de cobro y planes de pago
- Reportes PDF profesionales
- Sistema de notificaciones automáticas

### Cobrador
- Dashboard con métricas de su zona asignada
- Vista de clientes de su zona
- Gestión de tablas de cobro de su área
- Registro de cobros y generación de reportes

---

## 🔐 Autenticación

- **Access Token** (JWT, corta duración) → almacenado en memoria, enviado en `Authorization: Bearer`.
- **Refresh Token** → cookie HttpOnly, rotado automáticamente.
- Los interceptores de Axios manejan automáticamente el refresh y el logout por expiración.
- Rutas protegidas por el componente `RequireAuth` con verificación de rol.

---

## 📱 Rutas Principales

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Login |
| `/dashboard` | Ambos | Dashboard (varía según rol administrativo o cobrador) |
| `/todos-los-clientes` | Admin | Listado completo de clientes |
| `/todos-los-prestamos` | Admin | Listado completo de préstamos |
| `/tablas` | Admin | Tablas de cobro globales |
| `/planes` | Admin | Configuración de planes de pago |
| `/ver-clientes` | Cobrador | Clientes asignados |
| `/zona/:id` | Ambos | Detalle de zona |
| `/cliente/:id` | Ambos | Detalle de cliente |
| `/prestamo/:id` | Ambos | Detalle de préstamo |

---

## 🌐 Deploy en Vercel

El proyecto incluye `vercel.json` configurado para SPA:

1. Conectar repo en [vercel.com](https://vercel.com)
2. Configurar variable de entorno `VITE_API_BASE_URL`
3. Vercel detecta Vite automáticamente y genera el build en `/dist`

---

## 📄 Licencia

Propiedad Intelectual de **Álvaro Córdoba** — Queda prohibida la venta o uso comercial sin autorización. Ver [LICENSE](../LICENSE) para más detalles.
