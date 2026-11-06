# Retomar Wortise en otra computadora

Esta copia contiene el código y los recursos del working tree, incluidos los cambios
locales sin commit al momento del respaldo. Es un proyecto Astro estático; no requiere
Docker ni una base de datos. No hay conexión CMS configurada.

## Instalación

1. Descomprimir el ZIP y abrir la carpeta `wortise` en la terminal/editor.
2. Instalar Node.js 24.x y pnpm 12.15.0 (versiones de `package.json`).
   Si usás Corepack: `corepack enable` y `corepack prepare pnpm@12.15.0 --activate`.
   Si Corepack no está disponible, instalar pnpm 12.15.0 con el método oficial.
3. Ejecutar `pnpm install --frozen-lockfile`. Conservar `patches/`,
   `pnpm-workspace.yaml` y `pnpm-lock.yaml`: forman parte de la instalación.
4. Antes de iniciar Astro, comprobar si ya existe un servidor de este proyecto:
   revisar URL, puerto, proceso y respuesta HTTP. Compartir una sola instancia.
5. Si no hay una instancia, ejecutar `pnpm astro dev --background`.
   Abrir la URL que informa Astro. Para administrarlo:
   `pnpm astro dev status`, `pnpm astro dev logs`, `pnpm astro dev stop`.
   Un error EPERM del comando status no demuestra que el servidor esté detenido.

## Trabajo y validación

- Leer `AGENTS.md` y `README.md` antes de modificar el proyecto.
- `pnpm dev:launch` selecciona el perfil reducido; coordinar primero la detención
  del servidor actual. No iniciar otro perfil en un segundo puerto.
- `pnpm astro check` valida Astro/TypeScript.
- `pnpm lint:scss ruta/al/archivo.scss` valida SCSS modificado.
- `pnpm build` genera el sitio completo en `dist/`.
- `pnpm build:launch` genera el lanzamiento en `dist/`, reemplazando el build anterior.
- Scripts adicionales y limitaciones funcionales: consultar `README.md`.
- No publicar traducciones incompletas. La disponibilidad sale del registro de páginas.

## Contenido de la copia

Incluye fuentes, recursos locales, configuración, lockfile, documentación,
`AGENTS.md` y los scripts/documentación de staging en `.private/`.
Excluye `.git`, dependencias, cachés, builds, configuraciones del editor,
credenciales, archivos `.env` y respaldos históricos privados.
No conserva el historial Git: si necesitás colaborar con el repositorio original,
clonarlo por separado con tus propias credenciales y comparar/copiar los cambios.
No ejecutar `git init` esperando recuperar ese historial.

## Staging y accesos

Sitio completo: https://staging.armix.dev/wortise/
Lanzamiento: https://staging.armix.dev/wortiseads/
Instrucciones de publicación: `.private/docs/staging.md`.
El acceso SSH debe configurarse por separado con credenciales propias; esta copia
no contiene claves privadas ni contraseñas. No publicar la carpeta de fuentes como
sitio: para hosting estático se publica exclusivamente el contenido de `dist/`.
Los recursos tipográficos requieren licencia web adecuada antes de producción.
