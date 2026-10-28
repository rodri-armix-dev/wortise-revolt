# Colores globales y locales

Resultado de la reducción de tokens: **10 semánticos y 7 primitivos**, conservando los valores visuales existentes.

Los colores locales están declarados en el CSS del componente, pero no tienen token global. Se cuentan valores únicos y declaraciones escritas en el código fuente, sin sumar estilos de hijos ni el número de instancias renderizadas. Se excluyen `transparent`, `currentColor` y colores de imágenes.

| Componente o página | Valores locales únicos | Declaraciones | Valores |
| --- | ---: | ---: | --- |
| Button | 7 | 12 | `#201015`, `#330b19`, `#392e39`, `#4f4f4f`, `#888`, `#b0003a`, `#d10e4e` |
| Copyright | 0 | 0 | — |
| Description | 1 | 1 | `#3d1a26` |
| Eyebrow | 0 | 0 | — |
| Heading | 0 | 0 | — |
| Icon | 0 | 0 | — |
| Image | 0 | 0 | — |
| Logo | 0 | 0 | — |
| FooterBrand | 0 | 0 | — |
| FooterMenu | 0 | 0 | — |
| HeaderActions | 0 | 0 | — |
| LangMenu | 1 | 2 | `#330b19` |
| LangSwitcher | 1 | 1 | `#b0003a` |
| LegalMenu | 0 | 0 | — |
| MainMenu | 1 | 1 | `#330b19` |
| MobileMenu | 0 | 0 | — |
| SocialLinks | 0 | 0 | — |
| TextBlock | 0 | 0 | — |
| AboutUsCover | 0 | 0 | — |
| Footer | 0 | 0 | — |
| FooterCTA | 0 | 0 | — |
| Header | 2 | 2 | `#392e39`, `#3d1a26` |
| Hero | 0 | 0 | — |
| ModulesPage | 0 | 0 | — |
| Página UI | 1 | 1 | `color-mix(in srgb, #fff 16%, transparent)` |

**Total: 20 declaraciones y 9 valores o expresiones distintos en conjunto.** Los totales únicos por componente no se suman para calcular el total global porque hay colores repetidos.

La integración `integrations/viewport-toolbar/app.ts` conserva aparte su `#fff`: un color local y una declaración, excluidos de los totales de producto.

## Reglas de uso

- Usar semánticos globales cuando corresponda su función compartida.
- Mantener colores particulares como literales en el componente; los estados de Button siguen perteneciendo a Button.
- Conservar únicamente primitivos referenciados por aliases globales.
- Revisar consistencia al completar secciones. La repetición de un valor no exige convertirlo en token.

## Verificación

- Referencias globales válidas; sin usos de los tokens eliminados.
- Equivalencia de estilos al resolver aliases antes y después en los 81 archivos fuente revisados, excluyendo el propio catálogo de colores.
- Sass Lint sin advertencias en los SCSS modificados y build correcto de las seis páginas.
- Colores calculados equivalentes en 437 elementos del catálogo UI, tanto en móvil como en escritorio, incluidos sus ejemplos de variantes, tamaños y estados de botones; también se compararon desplegables de navegación e idiomas.
- El blanco al 16% del separador de UI puede serializarse como `rgba(255, 255, 255, 0.16)` en lugar de `color(srgb 1 1 1 / 0.16)`; representa el mismo color.
- Foco de teclado comprobado: borde de 2px con `rgb(209, 14, 78)` y offset de 4px.
