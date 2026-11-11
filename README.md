# Wortise

## Edición de contenido

Consultá la [guía de textos e imágenes](docs/editing-content.md), el [inventario de recursos públicos](docs/assets/public.md) y el [mapa de reorganización](docs/content-migration.md).

Sitio estático en Astro. Usar pnpm.

La API de títulos y su escala de Figma están documentadas en
[Heading: estilos tipográficos](docs/heading-typography.md).

Los criterios reutilizables de movimiento, scroll, Observer, interrupciones y
compatibilidad están en [Criterios compartidos de animación](docs/animation-guidelines.md).

Los cuerpos de artículos y documentos legales usan `global-inner global-inner--reading`.
Esta variante conserva los gutters globales y limita el ancho mediante el token
`--layout-reading-max-width`, definido en `src/styles/tokens/layout.scss`.

## Contenido editorial: prueba con Markdown

Se acordó probar `.md` para el contenido de los editores WYSIWYG, comenzando por
el blog. Queda pendiente extenderlo al resto de los campos de contenido
enriquecido del sitio tras evaluar la prueba. El backend sigue sin definirse.
La decisión, el marcador propuesto para CTAs y los pendientes están en
[Contenido en Markdown](docs/markdown-content.md). La prueba del blog ya está
implementada; los contratos HTML existentes del resto del sitio siguen vigentes.

## Blog

El listado se publica en `/es/blog/` y los detalles en `/es/blog/{slug}/`, con
la ruta estática `[locale]/[...slug].astro`. Cada artículo se registra una vez
mediante `blogArticlePages` en el registro de páginas compartido. El menú, los
dos selectores de idioma y los enlaces usan ese registro. No hay traducciones
del blog publicadas ni páginas del blog en el perfil `launch`.

Los ocho cuerpos editoriales están en `src/content/blog/es/*.md`; metadatos,
orden del listado y registro de rutas viven en `src/data/blog/index.ts`.
Programmatic Guaranteed conserva el texto de Figma. Los otros siete artículos
son textos de demostración autorizados, identificados en su detalle y pendientes
de revisión editorial. Las tarjetas usan el contenido de su traducción publicada,
sin copiar español para idiomas ausentes.

`ArticleCard`, `BlogMedia`, `BlogTag`, `ArticleMeta` y `EditorialCTA` se reutilizan
en listado, detalle y lecturas relacionadas. Se muestran tres destacados en
desktop y un carrusel con indicadores en mobile. «Cargar más» revela los artículos
adicionales; sin JavaScript se muestran todos. Los contenedores de imagen usan
los ratios y colores documentados en [Imágenes del blog](docs/blog-images.md).

El artículo interpreta los marcadores `[cta id="tips-app"]` y
`[media id="programmatic-illustration"]` en el build. La guía descargable todavía
no tiene archivo: su botón queda deshabilitado. Compartir permite copiar el
enlace o abrir LinkedIn/Facebook con la URL actual.

La newsletter valida el email, pero aún no tiene un receptor conectado. Al intentar
suscribirse indica que la suscripción todavía no está disponible y conserva el email
ingresado; no envía ni guarda datos. Sin JavaScript queda deshabilitada.

Validar con `pnpm test:blog`, `pnpm test:publication`, `pnpm astro check`, Sass Lint
para los SCSS modificados y builds de ambos perfiles cuando cambie la estructura.

## Perfiles de publicación

| Comando | Resultado |
| --- | --- |
| `pnpm dev` | Desarrollo del sitio completo, con header y footer completos. |
| `pnpm dev:launch` | Desarrollo del lanzamiento, con HMR y estructura reducida. |
| `pnpm build` | Build completo en `dist/`. |
| `pnpm build:launch` | Build del lanzamiento en `dist/`. |
| `pnpm preview` / `pnpm preview:launch` | Previsualización del último build; no lo regenera. |

Se comparte un único servidor de desarrollo. Antes de cambiar de perfil, detener
la instancia actual de forma coordinada; no iniciar otra en un puerto diferente.

`config/publication.ts` selecciona `launch` con `--mode launch`; otros modos usan
`full`. Cada perfil define portada, páginas permitidas, variante del shell,
catálogo UI, bloque FooterCTA y limpieza de recursos. Header y Footer reciben la variante como prop.
La variante compacta conserva logo, idiomas y botón Contactar rojo en el header, y copyright y enlaces
legales publicados en el footer. Incluye el FooterCTA propio de la página cuando tiene contenido definido.

El registro de contenido sigue siendo `src/data/pages/index.ts`. Las funciones de
`src/i18n/routes.ts` aplican el perfil tanto a rutas generadas como a enlaces y
selectores de idioma. La clave `wortise-ads` conserva sus datos originales:
ocupa `/es/` en lanzamiento y `/es/wortise-ads/` en el perfil completo. `/` redirige
a la portada del idioma predeterminado fuera de Vercel; en Vercel aplica la detección
descrita en «Idioma automático en Vercel». En lanzamiento se publican Wortise Ads y las tres páginas legales en español, inglés y portugués.
Los legales usan sus rutas internas en ambos perfiles, resueltas desde el registro.
Contacto sigue enlazando al sitio original mediante `src/data/destinations.ts`;
su página local se conserva en el perfil completo.
No se generan traducciones inexistentes ni una segunda copia de Ads bajo su slug interno en lanzamiento.

## Header y covers

El header es transparente y se superpone desde `BaseLayout`, sin fijarse al scroll.
`--layout-header-height` en `src/styles/tokens/layout.scss` define su altura y el
espacio reservado por defecto en el contenido. Las rutas activan `headerOverlay`
cuando el primer módulo es `ads-cover`: ese cover recibe `--layout-header-overlap`
y extiende su fondo hasta el borde superior, conservando la posición del texto y
del contenido siguiente. Las demás páginas mantienen el espacio del header.
Los paneles de navegación conservan sus fondos y se muestran por encima del cover.

## Publicar legales

Las tres páginas legales están disponibles en español, inglés y portugués y contienen traducciones de los textos originales
del material editorial original: términos y condiciones, privacidad y términos del SDK. Usan el
template `src/components/templates/LegalPage/LegalPage.astro`, independiente de
`ModulesPage`, y sus datos viven en `src/data/pages/legal/`.

El contrato `LegalPageData` declara `template: 'legal'` y `content` con antetítulo,
título, introducción opcional y un único campo `html` para todo el documento.
Los `<hr>` separan apartados; `<h2>`, `<h3>` y `<h4>` definen su jerarquía. La
numeración se escribe en el contenido. No hay módulos ni repetidores. Las fechas
opcionales `updatedAt` y `effectiveAt` usan `YYYY-MM-DD`. Privacidad conserva la
actualización del 18 de marzo de 2024 y la vigencia del 2 de julio de 2018 del
original; los otros documentos no incluyen fechas en el material original. El template
localiza su presentación según el idioma. Se conserva la numeración del original,
incluidos los dos apartados 16 de Privacidad, y el copyright 2025 de Términos y SDK.

`sanitizeLegalDocument()` conserva la política compartida de enlaces y contenido
enriquecido, añadiendo únicamente esos encabezados y `<hr>`. Description mantiene
su política anterior. El template no muestra FooterCTA.

Para agregar otro documento:

1. Crear su contenido con clave estable, slug, metadatos y traducciones completas,
   siguiendo el contrato de páginas existente.
2. Registrarlo una vez en `src/data/pages/index.ts`.
3. Agregar `{ page: 'clave-registrada', labels: { es: 'Etiqueta' } }` a `legalPages`
   en `config/publication.ts`, con las etiquetas de los idiomas disponibles.

Esa lista habilita los legales en lanzamiento y resuelve los enlaces del footer
mediante el registro. No mantener otra tabla de URLs. Los documentos legales
necesitan su contenido aprobado antes de publicar la versión final.

## Recursos del lanzamiento

La integración `integrations/publication-assets/` elimina archivos sin referencias
al finalizar el build de lanzamiento. Recorre referencias transitivas desde HTML,
CSS, JavaScript y SVG, y conserva favicons, robots y sitemaps. El perfil completo
no aplica esta limpieza. Los módulos y las partes completas del shell se cargan
bajo demanda; Astro puede agrupar estilos compartidos en los mismos archivos CSS.

La limpieza reconoce nombres de archivos literales, también con subdirectorios y
query strings. Si se incorporan recursos cuyos nombres se construyen en ejecución,
deben conservarse explícitamente mediante el argumento `entries` de
`pruneUnusedAssets()` en la integración antes de habilitar ese módulo en lanzamiento.

## Validación

Ejecutar `pnpm test:publication`, `pnpm astro check`, Sass Lint para los SCSS modificados y ambos builds
cuando cambie la estructura. Revisar las rutas y recursos de `dist/` del perfil
que se vaya a publicar. Cada build reemplaza el resultado anterior.

## Contacto (demo)

Contacto se publica únicamente en español en `/es/contacto/` en el perfil `full` y omite FooterCTA. El perfil define el shell y el destino de
«Volver al inicio». Los enlaces de contacto respetan la publicación por idioma.

`ContactSection` contiene el formulario completo. Nombre, email y mensaje son
obligatorios; teléfono es opcional. **El envío es una simulación en todos los
modos:** muestra la confirmación del diseño sin solicitudes, almacenamiento ni
envío de mensajes. Antes de publicar públicamente debe conectarse un receptor
real y revisarse la confirmación. Telegram permanece deshabilitado hasta disponer
de su URL. Sin JavaScript se ofrece el canal de email y no se envían formularios.

Los SVG centrales están en `src/assets/pages/contact/`; brillo y órbita se mantienen
separados y el móvil usa su propia exportación. `src/assets/global/decorations/cover-glow-secondary.svg` es
el efecto superior compartido con AdsCover. No se agregaron animaciones.

## Herramientas de desarrollo

El catálogo `/es/ui/` y los editores visuales se habilitan únicamente durante el desarrollo. Los builds de ambos perfiles excluyen el catálogo, los paneles y los videos de prueba de `public/development/videos/`.

Para hosting estático convencional, publicar el contenido de `dist/`.

## Idioma automático en Vercel

Los builds conservan `dist/` y generan además `.vercel/output/` con el Build Output
API de Vercel. `vercel.json` usa `pnpm build` y desactiva la autodetección del
framework: no se necesita un adaptador SSR. Para publicar el lanzamiento, configurar
el Build Command de Vercel como `pnpm build:launch`. Desplegar el repositorio con
esa configuración; subir únicamente `dist/` omite la detección automática.

La integración `integrations/vercel-language/` se ejecuta después de la limpieza de
recursos y empaqueta las páginas estáticas junto con un middleware exclusivo de `/`.
Primero considera la cookie `wortise_locale`, luego `Accept-Language` por prioridad
y variantes regionales; si no hay coincidencia usa español. Una preferencia solo
se aplica si existe una portada publicada en ese build: el perfil completo tiene
español e inglés, y lanzamiento incluye también portugués. La disponibilidad se
deriva de las rutas generadas, sin otro registro de traducciones.

Ambos selectores guardan la elección manual durante un año con `SameSite=Lax`,
`Secure` bajo HTTPS y un `Path` ajustado al base del sitio. Sin JavaScript o con
cookies bloqueadas, sus enlaces siguen funcionando, pero no recuerdan la elección.
Las URLs con idioma explícito, las traducciones ausentes y las rutas desconocidas
conservan el comportamiento habitual. La redirección automática es temporal (307),
conserva los parámetros de consulta y no se almacena en caché compartida.

Fuera de Vercel, incluido el servidor de desarrollo, `/` conserva su redirección
estática al español. Las páginas siguen prerenderizadas; el middleware únicamente
selecciona a cuál enviar al visitante. También respeta `base` cuando se configura.

Validar cada salida con `pnpm test:vercel-language` después de `pnpm build`, o
`pnpm test:vercel-language --launch` después de `pnpm build:launch`. Para comprobar
un build con base, añadir `--base=/preview/`. Complementar con `pnpm astro check`
y `pnpm test:publication`.
