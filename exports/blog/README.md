# Ilustraciones del blog · 4:3 transparentes

Página de Figma: [Blog · Imágenes 4:3](https://www.figma.com/design/xLJE0EirWbATe9KZ2nGYSX/Wortise----Handoff-28-10?page-id=2018%3A2245&node-id=2018-2246).

Los siete frames tienen 1680 × 1260px, sin relleno ni borde. Las ilustraciones
conservan la posición respecto del centro, tamaño relativo, rotación, opacidad,
filtros y recorte del nodo de referencia. La referencia es Más historias, excepto
cookies, que solo aparece en destacados. Se ajustó el lienzo a 4:3 y se escaló
todo el frame proporcionalmente. Los diseños originales permanecen intactos.

| Recurso | Referencia original | Frame final | Tratamiento |
| --- | --- | --- | --- |
| [ad-network.png](png/ad-network.png) | `1:5415` | `2018:2246` | Fondo eliminado |
| [ad-platforms.png](png/ad-platforms.png) | `1:5424` | `2018:2248` | Alfa original; opacidad 56% conservada |
| [programmatic-trends.png](png/programmatic-trends.png) | `1:5433` | `2018:2250` | Fondo eliminado |
| [ad-blocking.png](png/ad-blocking.png) | `1:5442` | `2018:2252` | Alfa original |
| [app-ads-txt.png](png/app-ads-txt.png) | `1:5451` | `2018:2254` | Fondo eliminado; recorte original conservado |
| [self-serve.png](png/self-serve.png) | `1:5460` | `2018:2256` | Alfa original; también usada por Programmatic Guaranteed |
| [cookies.png](png/cookies.png) | `1:5400` | `2018:2258` | Fondo eliminado |

## Incidencias resueltas

Cuatro originales eran opacos: Ad Network, tendencias, App-ads.txt y cookies.
Se utilizó la herramienta integrada de ImageGen para retirar sus fondos, sin
pedir rediseños. Los recortes se cargaron únicamente en los nuevos frames.

La descarga del render de Figma incorporaba el fondo gris de la página. Se
utilizó `exportAsync` nativo y se descargó su PNG original para conservar el alfa;
los nodos auxiliares de exportación se retiraron al terminar.

Los siete PNG se comprobaron a 1680 × 1260 con píxeles totalmente transparentes.
Los WebP de `src/assets/blog/` usan conversión sin pérdida y conservan el canal
alfa píxel a píxel. Para repetirla:

```sh
node scripts/convert-blog-images.mjs
```

## Prompt común de eliminación de fondo

Se usó una llamada de edición integrada por original, con transparencia activada
y el archivo original como referencia, siguiendo este prompt:

> BACKGROUND REMOVAL ONLY. Edit the attached existing Wortise blog illustration.
> Remove the entire opaque burgundy/black background to genuine transparent alpha,
> including empty spaces between the shapes. Preserve the exact original
> illustration geometry, perspective, number of elements, original pink colors,
> reflections, surface shading, relative positions, size and framing. Preserve a
> delicate soft pink glow around the object as semitransparent pixels, but remove
> the broad colored background haze and any rectangular panel. Do not redesign,
> redraw, crop, center differently, rotate, add text or add any new element. Keep
> the original image canvas aspect ratio and the object's position and size
> relative to that canvas. The result must be a clean isolated cutout of this
> exact object on transparency.
