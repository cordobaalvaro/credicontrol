# CrediControl — Backend

> API REST para el sistema de gestión de créditos, desarrollada con Node.js + Express + MongoDB.

---

## 🛠️ Stack

| Tecnología | Uso |
|---|---|
| Node.js 18+ | Runtime |
| Express 4 | Framework HTTP |
| MongoDB + Mongoose | Base de datos + ODM |
| JWT (jsonwebtoken) | Autenticación Access + Refresh Token |
| node-cron | Tareas programadas (actualización de préstamos) |
| Cloudinary | Almacenamiento de documentos de clientes |
| Render | Plataforma de despliegue |

---

## 🚀 Instalación

```bash
cd backend
npm install
```

Crear archivo `.env`:

```env
PORT=5000
MONGO_ACCESS=mongodb+srv://<usuario>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# JWT
JWT_ACCESS_SECRET=tu_access_secret
JWT_REFRESH_SECRET=tu_refresh_secret
ACCESS_TOKEN_TTL=10m
REFRESH_TOKEN_TTL=7d
REFRESH_COOKIE_NAME=rtoken

# Cloudinary (opcional, para documentos de clientes)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Cron de actualización de préstamos (opcional, por defecto: medianoche)
PRESTAMOS_CRON=0 0 * * *

NODE_ENV=production   # activa Secure + SameSite=None en cookies
```

```bash
npm run dev    # Desarrollo (nodemon)
npm start      # Producción
```

---

## 🏗️ Arquitectura

El backend sigue una **arquitectura MVC en capas estrictas**:

```
backend/
├── index.js              # Entry point (Express + middlewares globales)
└── src/
    ├── routes/           # Definición de endpoints + middlewares aplicados
    ├── controllers/      # Manejo de request/response → delegan a services
    ├── services/         # TODA la lógica de negocio y reglas del dominio
    ├── models/           # Esquemas Mongoose (estructura + validaciones básicas)
    ├── middlewares/      # auth, checkRol, errorHandler, validaciones transversales
    ├── helpers/          # Utilidades (API client para PDFs, etc.)
    ├── db/               # Conexión a MongoDB
    └── utils/            # Cron jobs, helpers internos
```

**Principios de diseño:**
- `routes` no contienen lógica → solo conectan endpoints con controllers
- `controllers` no contienen reglas de negocio → solo delegan a services
- `services` son la única fuente de verdad de las reglas del negocio
- Todo input se valida en backend independientemente del frontend

---

## 📡 Endpoints

Prefijo base: `/api`

| Recurso | Rutas |
|---------|-------|
| **Auth** | `POST /auth/login` · `POST /auth/refresh` · `POST /auth/logout` |
| **Usuarios** | CRUD `/usuarios` — gestión de cobradores y admins |
| **Clientes** | CRUD `/clientes` — con resumen, búsqueda y filtros |
| **Préstamos** | CRUD `/prestamos` — gestión de estados, cuotas, refinanciados |
| **Zonas** | CRUD `/zona` — asignación de cobradores, clientes por zona |
| **Cobros** | `/cobros` — registro y consulta de pagos |
| **Tablas semanales** | `/tablasSemanales` — organización de cobros semanales |
| **Notificaciones** | `/notificaciones` — alertas automáticas por préstamos próximos a vencer |
| **Documentos** | `/documentosClientes` — subida y consulta (Cloudinary) |
| **PDFs** | `/pdf` — generación de reportes server-side |
| **Planes** | `/planes` — configuración de planes de pago personalizados |
| **Gastos** | `/gastos` — registro de egresos del negocio |

---

## 🔐 Autenticación

Flujo **Access Token + Refresh Token**:

1. `POST /api/auth/login` → devuelve `{ token }` (Access Token en body) + setea cookie HttpOnly con Refresh Token.
2. El cliente envía el Access Token en cada request: `Authorization: Bearer <token>`
3. Al expirar, el frontend llama a `POST /api/auth/refresh` → rota el Refresh Token y devuelve nuevo Access Token.
4. `POST /api/auth/logout` → invalida y limpia la cookie.

Middlewares de seguridad:
- `auth` → verifica JWT y adjunta el usuario al request
- `checkRol('admin')` / `checkRol('cobrador')` → control de acceso por rol

---

## ⏰ Cron Job

El archivo `src/utils/prestamos.cron.js` actualiza automáticamente el estado de los préstamos vencidos. Se ejecuta por defecto a **medianoche diaria** (`0 0 * * *`), configurable via `PRESTAMOS_CRON`.

---

## 🌐 Deploy en Render

1. Crear un **Web Service** en [render.com](https://render.com)
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Node version: 18+
5. Agregar todas las variables de entorno del `.env`

---

## 📄 Licencia

MIT — CrediControl © 2025
