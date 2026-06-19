# FORMAS Frontend

Sitio público y panel administrativo de FORMAS, construido con React y Vite.

## Qué contiene

- Página pública: inicio, nosotros, proyectos, blog, contacto, productos, categorías y carrito.
- Panel admin en `/cuenta` para editar contenido, productos, categorías, imágenes, blog y cargas masivas.
- Catálogo PDF generado desde el navegador.
- Visor interno de fichas técnicas con PDF.js.

## Requisitos

- Node.js 20+
- npm

## Ejecutar localmente

```powershell
npm install
npm run dev
```

El frontend se conecta al backend con:

```text
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Para local puedes crear `.env.local` con esa variable. No agregues `/api` al final.

## Producción

En Vercel configura:

```text
VITE_API_BASE_URL=https://TU_BACKEND_RENDER_O_API
```

Ejemplo:

```text
VITE_API_BASE_URL=https://formas-backend-msro.onrender.com
```

`vercel.json` redirige las rutas internas a `index.html`, por eso funcionan enlaces directos como:

```text
/productos
/productos/forma-tv-180
/categorias/cocinas
/cuenta
```

## Scripts

```powershell
npm run dev
npm run build
npm run lint
```

## Archivos importantes

- `src/api/cmsApi.js`: conexión con el backend.
- `src/data/siteContent.js`: contenido base cuando el backend aún no devuelve datos.
- `src/pages/Cuenta.jsx`: panel administrativo.
- `src/components/PdfInlineViewer.jsx`: visor interno de fichas técnicas.
- `src/utils/catalogPdf.js`: catálogo PDF público.
- `src/styles/global.css`: estilos globales.

## Notas para mantenimiento

- Las imágenes se guardan en Cloudinary desde el backend.
- Las fichas técnicas PDF se sirven desde el backend y se renderizan en React con PDF.js.
- Los correos del newsletter se guardan en Neon mediante el backend.