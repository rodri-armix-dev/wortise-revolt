# Prueba de contenido editorial en Markdown

Decisión del 2 de noviembre de 2026: probar archivos `.md` como formato de
contenido para los editores WYSIWYG, comenzando por el blog. El backend y el
editor visual todavía no están definidos. La interfaz de edición puede ser
visual; no necesita exigir que los redactores escriban Markdown manualmente.

El objetivo es permitir párrafos, encabezados, listas, énfasis, enlaces e imágenes
con una sintaxis sencilla. No se adopta MDX ni se requieren imports o código de
componentes en el contenido editorial.

## Componentes dentro del contenido

Para la prueba se propone un marcador sencillo que seleccione un bloque por ID:

```md
Además, editores y anunciantes consolidan su reputación.

[cta id="tips-app"]

## ¿Cómo puedes empezar?

Para empezar, evalúa tus potencialidades como publisher.
```

El marcador no es sintaxis nativa de Markdown o Astro. El parser del blog está
implementado en `src/lib/article-markdown.ts`. Los textos del CTA se editan en `src/content/pages/blog/es.json`; su configuración visual y el ID estable se resuelven en `src/data/blog/content.ts`.
Un futuro editor puede ofrecer «Insertar CTA» y generar el marcador visualmente.

El procesamiento debe reconocer únicamente los marcadores permitidos y resolver
sus IDs a componentes conocidos. Validación, resolución y sanitización pertenecen
a la capa de contenido; los componentes reciben props tipadas e independientes
del proveedor. No compilar contenido editorial como código ejecutable.

## Pendientes

- [x] Implementar y evaluar la prueba de `.md` en el blog, incluyendo texto,
  imágenes y un CTA intercalado, en desktop y mobile.
- [x] Definir el procesamiento de Markdown y marcadores, sanitización del HTML
  resultante y tratamiento explícito de IDs inexistentes.
- [ ] Comprobar que el editor WYSIWYG elegido conserva los marcadores y permite
  un ciclo de edición, guardado y reapertura sin perder contenido.
- [ ] Extender Markdown al resto de los campos de contenido enriquecido del sitio
  tras evaluar la prueba. Inventariar los actuales campos HTML de descripciones,
  introducciones y documentos legales, y migrarlos preservando contenido,
  semántica, enlaces, traducciones y apariencia.

El blog y los documentos legales usan `.md`. Los textos de las demás páginas se editan en JSON por página e idioma. Los contratos HTML
y sanitizadores actuales siguen vigentes hasta que se migre explícitamente cada consumidor. Heading
conserva su contrato de HTML inline; su revisión, si se necesita, debe ser una
decisión explícita y separada de los campos de texto enriquecido.

## Uso actual

Los archivos viven en `src/content/blog/es/`. Sus metadatos están en el bloque JSON inicial de cada artículo, junto al cuerpo Markdown. La publicación y la configuración visual se resuelven en `src/data/blog/index.ts`.
Los bloques especiales deben escribirse solos en su párrafo, separados por
líneas en blanco: `[cta id="tips-app"]` y
`[media id="programmatic-illustration"]`. Las referencias dentro de código o
citas se conservan como texto; un ID desconocido detiene el renderizado para
exponer el error editorial.

Se utiliza Marked en el build/servidor y se sanitiza el HTML resultante mediante
una política específica de artículos que reutiliza la protección de enlaces
compartida. No se envía el parser al navegador. `pnpm test:blog` verifica orden,
referencias Markdown, marcadores, IDs desconocidos y sanitización.

Las ilustraciones intercaladas usan los WebP transparentes del blog sobre sus
contenedores de color. La sintaxis Markdown de imágenes también se procesa,
con texto alternativo y carga diferida.

La [guía de edición](editing-content.md) documenta JSON, metadatos Markdown y recursos por página. Los documentos legales conservan su HTML original dentro de Markdown; los adaptadores convierten los textos JSON al HTML de los componentes y mantienen sus sanitizadores.
