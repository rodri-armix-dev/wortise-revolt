# Verificación de módulos de Wortise

Usá esta checklist al empezar un módulo y antes de darlo por terminado. Marcá
los puntos que aplican y registrá las excepciones y los pendientes en la entrega.

## Diseño y composición

- [ ] Comparé las referencias de escritorio y móvil con los componentes,
  variantes y assets existentes. Identifiqué qué partes se reutilizan y qué
  decisiones de layout pertenecen al módulo.
- [ ] El organismo usa su clase BEM `__inner` junto con `global-inner`
  cuando el layout lo permite. El `inner` delega el centrado y los gutters al
  layout compartido y ajusta solo lo necesario con
  `--layout-content-max-width`, `--layout-gutter` o `--global-item-gap`.
- [ ] Cada componente hijo que requiere ajustes tiene un wrapper BEM del
  consumidor. En un módulo con `TextBlock`, seguí el patrón de
  [CTA](../src/components/organisms/CTA/cta.scss). El wrapper
  limita el ancho del bloque y configura por separado el de la descripción
  mediante `--text-block-description-max-width` y, cuando corresponde,
  `--text-block-description-margin-inline`.

## Tokens y responsive

- [ ] Los gaps usan el token más cercano de la
  [escala de espaciado](../src/styles/tokens/spacing.scss). Los paddings y
  márgenes reutilizan la escala cuando corresponde. Los anchos, alturas y
  posiciones decorativas responden a la geometría del módulo.
- [ ] `Heading` usa los [tamaños nombrados](heading-typography.md). El resto de
  la tipografía hereda la familia y los defaults globales cuando corresponden.
  Si un valor reproduce un estilo compartido, consume sus tokens semánticos de
  tamaño y altura de línea. Los elementos conservan su semántica y su peso.
- [ ] Los radios consumen [aliases semánticos](../src/styles/tokens/radius.scss)
  y los colores usan [roles existentes](../src/styles/tokens/colors.scss) cuando
  coinciden con su función. Los estados y valores específicos se definen en
  el componente que los usa.
- [ ] El layout parte de móvil, usa los rangos de
  [breakpoints.ts](../config/breakpoints.ts) y respeta `--layout-min-width`.
  Revisé saltos de línea, desbordes, recortes y la transición entre rangos.

## Código y comprobación

- [ ] Los props son tipados y el contenido editorial vive en la capa de datos.
  El SCSS está junto al componente, usa BEM y configura los hijos a través de
  su API visual. Los controles tienen nombre accesible, foco y estados acordes
  a su comportamiento.
- [ ] Si el cambio afecta rutas, verifiqué los perfiles de publicación, el
  registro de páginas, los enlaces internos y los selectores de idioma con
  traducciones disponibles y pendientes.
- [ ] Verifiqué el módulo en el servidor Astro existente con HMR. Comparé
  medidas calculadas, gutters y estados en móvil y escritorio, incluyendo el
  ancho mínimo y los breakpoints relevantes. Si se conoce el módulo siguiente,
  revisé también la separación entre ambos.
- [ ] Pasó `pnpm lint:scss <archivos>` para el SCSS modificado y
  `pnpm astro check` cuando cambió Astro o TypeScript. Ejecuté `pnpm build`
  cuando el cambio fue estructural o se pidió expresamente. Si cambia la
  publicación, comprobé la salida de los perfiles afectados.
