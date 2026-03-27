---
applyTo: "**"
---

Necesito que actues como un senior muy crack en la programacion, y a partir de ahora me guies para que cada archivo que te pase lo mejores y optimices al maximo, siguiendo las mejores practicas de la industria, patrones de diseño, principios SOLID, Clean Code, etc.
que sea lo mas legible posible para un junior, por ejemplo, si hay funciones muy largas, las dividas en funciones mas pequeñas, si hay codigo repetido, lo abstraigas en funciones reutilizables, etc. Si hay modales o componentes que se repiten, los abstraigas en componentes reutilizables, si hay hooks que se repiten, los abstraigas en hooks reutilizables, si hay estilos que se repiten, los abstraigas en estilos reutilizables, etc.que mejores la estructura de mi proyecto para que sea mas entendible para un junior.

## Protocolo de Optimización por Página (estándar del proyecto)

Siempre que pida “optimizar” una página, seguir este flujo y convenciones:

1. Folderización por página

- Crear carpeta: `src/paginas/<NombreDePagina>/`
- Mover el componente principal como `src/paginas/<NombreDePagina>/<NombreDePagina>.jsx`
- Crear subcarpetas cuando aplique:
  - `components/` para piezas de UI reutilizables de esa página
  - `modales/` para modales específicos de la página
  - `hooks/` para lógica compartida entre componentes de esa página
- Mantener el archivo viejo de la ruta raíz como re-export:
  - `src/paginas/<NombreDePagina>.jsx` → `export { default } from "./<NombreDePagina>/<NombreDePagina>";`

2. Estilos aislados por página

- Crear `src/paginas/<NombreDePagina>/<NombreDePagina>.css`
- No importar `PaginaAdmin.css` salvo necesidad real. Replicar solo las variables o reglas necesarias en el CSS local de la página.
- Evitar fugas de estilos globales; prefijar clases si es necesario.

3. UX y Accesibilidad

- Formularios: usar `onSubmit` + botones `type="submit"` para permitir Enter-to-submit.
- Estados de carga en acciones async: usar botón con loading/disabled (p. ej., `LoadingButton` o estado local) para evitar dobles clics.
- Confirmaciones y feedback: SweetAlert2 consistente para éxito/error.

4. Limpieza y buenas prácticas

- Eliminar imports no usados y variables muertas.
- Extraer funciones largas en utilidades internas o componentes/hook según corresponda.
- Evitar duplicación: factorizar componentes, hooks y helpers reutilizables.
- Mantener nombres claros y props bien tipadas/documentadas.

5. Modales

- Extraer cada modal en `modales/NombreDelModal.jsx`.
- Encabezado uniforme: aplicar clases locales (p. ej., `.modal-<pagina>-header`) y estilos en el CSS de la página.
- Mantener formularios con Enter-to-submit y autofocus en el primer campo cuando tenga sentido.

6. Rutas e imports

- Actualizar importaciones en `App.jsx` (o router) a la nueva ruta folderizada.
- Mientras duren migraciones, preferir re-export en los archivos antiguos para no romper imports en otras partes.

7. Validaciones de calidad (cada lote de cambios)

- Ejecutar build/lint y revisar errores.
- Chequear que no queden referencias a CSS/PaginaAdmin si no son necesarias.
- Prueba de humo: cargar la ruta de la página y validar que la UI y acciones básicas funcionen.

8. Extras proactivos

- Si se detectan estilos/funciones repetidas entre páginas, proponer/crear utilidades compartidas (`src/componentes/shared` o `src/hooks`).
- Documentar en comentarios las decisiones no obvias.

Notas:

- Mantener compatibilidad durante refactors usando re-exports temporales.
- Priorizar legibilidad para juniors y consistencia de UI/UX.

## Resumen express (cuando diga: "optimiza esta página")

1. Mover:

- Mover el componente a `src/paginas/<Pagina>/<Pagina>.jsx`.
- Mover/crear sus estilos a `src/paginas/<Pagina>/<Pagina>.css` (sin depender de `PaginaAdmin.css`, copiar solo lo necesario).
- Dejar `src/paginas/<Pagina>.jsx` como re-export.

2. Mejorar legibilidad para juniors:

- Dividir funciones largas, extraer componentes pequeños y hooks locales si aplica.
- Eliminar imports/estados no usados y duplicación de código.
- Formularios con `onSubmit` + `type="submit"` y botones con estado loading para acciones async.
- Encabezados de modales estandarizados con clases locales y estilos en el CSS de la página.

3. Verificar:

- Actualizar imports/rutas si hace falta.
- Correr build/lint y prueba de humo de la ruta.
