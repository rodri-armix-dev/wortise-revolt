# Editar el contenido

Cada página tiene un archivo por idioma en `src/content/pages/`:

| Página | Carpeta |
| --- | --- |
| Inicio | `home/` |
| Nosotros | `about/` |
| Desarrolladores | `developers/` |
| Wortise Ads | `wortise-ads/` |
| Contacto | `contact/` |
| Blog | `blog/` |

Abrí `es.json` para español, `en.json` para inglés o `pt.json` para portugués. Cambiá el texto entre comillas y guardá. Por ejemplo:

```json
{
  "hero": {
    "title": "Conectamos marcas con personas",
    "description": "Conocé lo que podemos hacer juntos.",
    "button": "Contactar al equipo"
  }
}
```

Las secciones siguen el orden de la página. `hero` es la portada, `title` el título, `description` la descripción, `button` el texto del botón e `imageAlt` la descripción de una imagen. `meta` contiene los textos para buscadores.

Conservá los nombres de los campos, las comillas y las comas. En los textos, `\n` indica un salto de línea; `*texto*` conserva el énfasis de un título y `**texto**` pone una frase en negrita dentro de una descripción. No necesitás escribir HTML.

El menú, el footer y los textos comunes están en `src/content/global/`. Los enlaces externos se cambian en `global/buttons/es.json`, `en.json` o `pt.json`. Los artículos están en `src/content/blog/` y los documentos legales en `src/content/legal/`, ambos en Markdown.

Para imágenes, abrí la carpeta de la página en `src/assets/pages/`. Reemplazá el archivo manteniendo el nombre y formato.

Revisá el resultado en móvil y escritorio antes de publicar.
