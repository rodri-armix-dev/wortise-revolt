# Imágenes del blog

## Recursos actuales

`BlogMedia` es el contenedor visual de las imágenes del blog. En esta instancia
se prepararon fondos, bordes opcionales y proporciones. Las páginas del blog
utilizan siete ilustraciones WebP transparentes de 1680 × 1260px (4:3), exportadas
desde la página de recursos de Figma. Las ilustraciones publicadas están en `src/assets/blog/articles/`. Los originales se conservan fuera del contenido publicado.

`tone` selecciona una superficie mantenida en el componente. Cada superficie
define conjuntamente fondo y color de borde. `bordered`
activa el borde de 1px; por defecto no se muestra. El fondo sigue visible aunque
todavía no haya imagen. Los consumidores conservan la responsabilidad del ancho
y de la distribución exterior.

| Superficie | Fondo | Borde |
| --- | --- | --- |
| `neutral` | Degradado gris oscuro | Gris al 42% |
| `pink` | Bordó plano `#280913` | Rosa al 42% |
| `blue` | Degradado oscuro hacia azul | Azul al 42% |
| `violet` | Degradado oscuro hacia violeta | Azul al 42% |
| `surface` | Fondo compartido de tarjeta | Borde editorial sutil |
| `surface-accent` | Fondo compartido de tarjeta | Rosa al 42% |
| `cover` | Degradado de portada de artículo | Azul al 42% |

No hay variantes por sección en BlogMedia. Las tarjetas destacadas omiten el
borde interior y usan los tonos neutral, surface y blue. `featuredTone` en los
datos permite que una publicación use una superficie diferente al destacarse;
la portada principal conserva su degradado propio. El borde exterior de la
tarjeta se mantiene separado.

En Más historias, las seis imágenes usan pink, violet, surface-accent, neutral,
surface y violet respectivamente. El wrapper de ArticleCard aplica la sombra
negra de Figma únicamente a las historias desktop; no añade props de sombra.

Las variantes se seleccionan mediante nombres serializables. Un futuro adaptador
de CMS deberá validar los valores externos antes de pasarlos al componente;
no se guardan CSS, clases ni valores de proveedor en el contenido.

## Proporciones acordadas

| Ubicación | Mobile | Desktop desde L |
| --- | --- | --- |
| Destacadas y Más historias | 16:9 | 4:3 |
| Portada de artículo | 4:3 | 16:9 |
| Imagen dentro del artículo | 16:9 | 16:9 |

`aspectRatio` define la proporción base y `responsiveAspectRatio` sus cambios
por los rangos compartidos del proyecto. No depende del orden del objeto.

```astro
<BlogMedia tone="blue" bordered aspectRatio="16/9" responsiveAspectRatio={{ l: '4/3' }} />
```

`image` recibe los props del átomo Image. BlogMedia lo presenta mediante un
wrapper propio con `object-fit: contain`, conservando el lienzo transparente
completo incluso en 16:9. Las tarjetas usan alt vacío porque el enlace ya contiene
el título; portada y cuerpo conservan el texto alternativo de los datos. La
portada carga eager con prioridad alta y las demás imágenes usan carga diferida.
El slot se conserva como alternativa cuando no se proporciona una imagen.

Los ejemplos están en el catálogo de desarrollo `/es/ui/#blog-media-title`.

## Consulta pendiente para el diseñador

- [ ] Confirmar si los diferentes anchos y proporciones de las áreas de imagen
  entre destacados, historias y detalle son intencionales, y qué debe mantenerse
  al normalizar los ratios. Referencias de Figma: destacados desktop
  379,33 × 320px; historias desktop 483 × 350px; tarjetas mobile 328 × 181px;
  portada de artículo desktop 1120 × 460px y mobile 362 × 250px; imagen dentro
  del artículo desktop 820 × 400px.
- [ ] Confirmar el ancho del bloque de texto dentro de las tarjetas destacadas:
  Figma usa 354px para el texto frente a 379,33px para el área de imagen, aunque
  las tres tarjetas exteriores tienen el mismo ancho de 421,33px. Consultar si
  esa diferencia debe mantenerse con títulos de distinta longitud.

Estas consultas no cambian por ahora los ratios normalizados acordados ni la
implementación. Las diferencias de altura y el centrado vertical de los
destacados se revisan por separado; no implican anchos distintos entre las tres
tarjetas exteriores.
