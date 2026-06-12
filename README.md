# FORMAS Frontend

Sitio React/Vite de FORMAS.

## Ejecutar localmente

```powershell
npm install
npm run dev
```

El frontend se conecta al backend usando la variable:

```text
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Para desarrollo local, esa variable está en `.env.local`.

## Producción

En Vercel o el hosting del frontend, configurar:

```text
VITE_API_BASE_URL=https://TU_DOMINIO_BACKEND
```

No debe llevar `/api` al final. La aplicación ya agrega las rutas necesarias, por ejemplo `/api/products`.

## Rutas internas

`vercel.json` redirige todas las rutas al `index.html`, por eso funcionan enlaces directos como:

```text
/productos
/productos/forma-tv-180
/categorias/cocinas
/cuenta
```

## Compilar

```powershell
npm run build
```
