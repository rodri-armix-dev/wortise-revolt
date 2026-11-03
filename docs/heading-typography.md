# Heading: estilos de Figma

Fuente: [02 · Typography](https://www.figma.com/design/xLJE0EirWbATe9KZ2nGYSX/Wortise----Handoff-28-10?node-id=24-294).

`Heading` ofrece ocho estilos. Cada uno aplica conjuntamente tamaño e
interlineado; todos usan peso 400 por decisión del proyecto, incluidos Title XS
y SM, que en Figma figuran con peso 500. Conserva la familia Aeonik Pro del sitio.

| `size` | Tamaño | Interlineado |
|---|---:|---:|
| `title-xs` | 21 px | 26 px |
| `title-sm` | 24 px | 34 px |
| `title-md` | 32 px | 40 px |
| `title-lg` | 36 px | 40 px |
| `display-sm` | 40 px | 46 px |
| `display-md` | 48 px | 52 px |
| `display-lg` | 52 px | 58 px |
| `display-xl` | 60 px | 64 px |

Los valores se definen en `src/styles/tokens/typography.scss`: primero las
primitivas y después los alias `--font-size-{estilo}` y
`--line-height-{estilo}`. Solo Heading selecciona estos tokens; los consumidores
eligen un estilo mediante su prop, sin repetir medidas.

```astro
<Heading html="Un título" tag="h2" size="title-md" />
<Heading html="Nuestro blog" tag="h1" size={{ s: 'display-sm', l: 'display-xl' }} />
```

`size` acepta un nombre o un objeto responsive con `s` obligatorio. El valor
por defecto es `display-sm`. Es mobile first: `s` no genera media query y los
rangos omitidos conservan el estilo aplicable. Se usan los rangos y la prioridad
de `config/breakpoints.ts`, incluidos combinados y exclusivos; el orden de las
propiedades del objeto no altera la cascada. La etiqueta `tag` es independiente
del estilo visual.

La migración elimina `responsiveSize` de Heading y los nombres
`small`, `normal` y `large`. Se migraron los consumidores de todo el sitio:
24 → `title-sm`, 40 → `display-sm`, 64 → `display-xl` (60/64). El valor de 44 px
del listado del blog se corrigió a `display-md` (48/52), según Figma.
El Hero simple deja su tamaño fluido y utiliza la escala 40 → 52 → 60.

Las propiedades `--heading-font-size` y `--heading-line-height` se conservan
para excepciones justificadas, con prioridad sobre la variante. Los consumidores
actuales ya no las necesitan. Se conservan la sanitización, los colores y el
contenido de Heading. El catálogo `/es/ui/` muestra los ocho estilos y ejemplos
responsive. `Description` mantiene su API y estilos actuales.
