# Dashboard del Cobrador

## Descripción

Dashboard personalizado para cobradores que muestra un resumen completo de su actividad diaria y semanal, integrado con el sistema existente de Tablas Semanales.

## Características

### 📊 Métricas Principales
- **Cobros del día**: Total de cobros realizados hoy
- **Monto recaudado**: Dinero cobrado en el día
- **Pendientes**: Cuotas por cobrar hoy
- **Meta diaria**: Porcentaje de cumplimiento vs objetivo

### 📈 Resumen Semanal
- **Total cobros**: Cantidad de cobros en la semana
- **Monto total**: Dinero recaudado en la semana
- **Promedio diario**: Promedio de cobros por día
- **Meta semanal**: Progreso vs objetivo semanal

### ⚠️ Alertas
- **Préstamos vencidos**: Clientes con cuotas vencidas
- **Por vencer**: Préstamos que vencerán en los próximos 3 días
- **Información de contacto**: Teléfonos para gestión

### 📅 Próximos a Cobrar
- **Lista semanal**: Préstamos con cuotas esta semana
- **Información detallada**: Cliente, monto, vencimiento
- **Acciones rápidas**: Botón para ir a Tabla Semanal

## Componentes

### Archivos Principales
- `DashboardCobrador.jsx` - Componente principal
- `DashboardCobrador.css` - Estilos personalizados
- `useDashboardCobrador.js` - Hook personalizado

### Hook Personalizado
El hook `useDashboardCobrador` proporciona:
- **Datos del dashboard**: `dashboardData`
- **Estados de carga**: `loading`, `error`
- **Acciones**: `refreshData()`, `updateMetric()`
- **Estados calculados**: `hasData`, `hasAlertas`, `metaDiariaCumplida`
- **Auto-refresh**: Actualización automática cada 5 minutos

## Integración con Backend

### Endpoints Utilizados
```javascript
GET /api/dashboard-cobrador/:cobradorId              - Dashboard completo
GET /api/dashboard-cobrador/:cobradorId/metricas-dia  - Métricas del día
GET /api/dashboard-cobrador/:cobradorId/resumen-semanal - Resumen semanal
GET /api/dashboard-cobrador/:cobradorId/proximos-cobrar - Próximos a cobrar
GET /api/dashboard-cobrador/:cobradorId/alertas      - Alertas
```

### Estructura de Respuesta
```javascript
{
  "status": 200,
  "data": {
    "cobrador": { /* información del cobrador */ },
    "metricasDia": { /* métricas del día */ },
    "resumenSemanal": { /* resumen semanal */ },
    "proximosACobrar": [/* lista de próximos a cobrar */],
    "alertas": {
      "prestamosVencidos": [/* préstamos vencidos */],
      "porVencer": [/* préstamos por vencer */],
      "totalAlertas": 3
    }
  }
}
```

## Uso

### Importación
```javascript
import DashboardCobrador from './DashboardCobrador'
```

### Requisitos
- **ID del cobrador**: Debe estar disponible en `localStorage.getItem('userId')`
- **Token de autenticación**: Configurado en el helper de axios
- **Permisos**: El usuario debe tener rol "cobrador"

### Personalización

#### Colores de Métricas
Las métricas cambian de color según su estado:
- **Meta diaria**: Verde (≥100%), Amarillo (≥50%), Rojo (<50%)
- **Meta semanal**: Similar a meta diaria
- **Alertas**: Rojo para vencidos, amarillo para por vencer

#### Responsive
- **Desktop**: Layout completo con todas las columnas
- **Móvil**: Cards apiladas, tabla scrollable
- **Tablet**: Adaptación intermedia

## Integración con Sistema Existente

### Relación con Tabla Semanal
- **No duplica funcionalidades**: Dashboard es solo visualización
- **Botones de navegación**: Redirige a Tabla Semanal para acciones
- **Datos consistentes**: Usa misma fuente de datos que Tabla Semanal

### Flujo de Trabajo
1. **Dashboard** → Vista rápida del estado actual
2. **Tabla Semanal** → Carga y gestión de cobros
3. **Alertas** → Gestión de clientes con problemas
4. **Próximos a Cobrar** → Planificación diaria

## Estilos

### Clases CSS Principales
- `.metric-card` - Cards de métricas
- `.summary-item` - Items de resumen
- `.alert-item` - Items de alertas
- `.cobrador-avatar` - Avatar del cobrador

### Variables de Color
Las métricas usan gradientes según su estado:
- **Primary**: Azul para información general
- **Success**: Verde para metas cumplidas
- **Warning**: Amarillo para progreso parcial
- **Danger**: Rojo para metas no cumplidas

## Manejo de Errores

### Estados de Error
- **Sin conexión**: Muestra alerta con SweetAlert
- **Sin datos**: Mensaje informativo
- **Error de API**: Notificación de error con opciones

### Auto-recuperación
- **Reintentar automático**: Cada 5 minutos
- **Refresh manual**: Botón de actualización
- **Silent refresh**: Actualiza sin mostrar loading

## Performance

### Optimizaciones
- **Hook personalizado**: Reutilización de lógica
- **Lazy loading**: Carga datos bajo demanda
- **Memoización**: Evita renders innecesarios
- **Auto-refresh**: Actualización periódica eficiente

### Cache
- **Local state**: Mantiene datos en memoria
- **Background refresh**: Actualiza sin interrumpir
- **Error boundary**: Manejo de errores graceful

## Futuras Mejoras

### Posibles Extensiones
- **Gráficos interactivos**: Chart.js o similar
- **Filtros de fecha**: Personalizar períodos
- **Exportación**: PDF/Excel de reportes
- **Notificaciones**: Push notifications
- **Modo offline**: Service Worker para cache

### Métricas Adicionales
- **Comparación histórica**: Vs mes anterior
- **Ranking**: Comparación con otros cobradores
- **Tendencias**: Proyecciones basadas en datos
- **Eficiencia**: Tiempo promedio por cobro
