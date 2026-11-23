# Migrar animaciones GSAP a CSS scroll-driven

AdMonet es la referencia para las próximas migraciones. La página de prueba
es `/es/admonet-networks-scroll-driven-test/` y su entrada es
[admonet-networks-scroll-driven-test.astro](../../../pages/[locale]/admonet-networks-scroll-driven-test.astro).
La implementación original de [Desarrolladores](/es/desarrolladores/) sigue
disponible para comparar el recorrido, las curvas y los estados visuales.
[AdMonetNetworksDemo.astro](AdMonetNetworksDemo.astro) compone la introducción,
los cuatro formatos y el celular compartido.

## Cómo migrar cada animación

1. Abrir el original en GSAP y recorrerlo en escritorio y móvil. Anotar por
   elemento qué hace al entrar, durante la pausa, al salir y al invertir el
   scroll. Registrar sus desplazamientos, curvas, duraciones y puntos de
   sincronización. Usar Figma como referencia de diseño cuando corresponda.
2. Crear una ruta de prueba y un organismo en `workshop`. Reutilizar los
   componentes existentes y definir primero la geometría de la escena y su
   recorrido. Mantener las distancias de pausa y transición en propiedades CSS.
3. Elegir el reloj de cada movimiento. Mapear la fijación a `position: sticky`,
   el progreso de scroll a `view-timeline` y `animation-range`, y los loops
   o entradas de duración fija a `@keyframes` con reloj normal. Documentar si
   la entrada se reproduce una vez o se rearma, y si la reversa depende de la
   posición de scroll. Si un disparo original debe terminar después de que la
   persona suelta el scroll, verificar esa semántica en los navegadores
   objetivo antes de elegir cómo implementarlo.
4. Migrar una capa por vez. Empezar por la fijación y los textos. Después
   sincronizar imágenes, halos y elementos compartidos con la misma
   referencia de inicio y fin cuando corresponda. Usar los mixins responsive
   del proyecto y separar los estilos por responsabilidad.
5. Comparar la demo con el original. Frenar a mitad de la transición, invertir
   el gesto y volver desde la sección siguiente. Anotar qué se comprobó,
   en qué navegador y qué diferencias quedan pendientes. Consultar los
   [criterios de animación](../../../../docs/animation-guidelines.md) y la
   [verificación de módulos](../../../../docs/module-verification.md).

## Decisiones de AdMonet y dónde ajustar

| Archivo | Decisión de la demo |
| --- | --- |
| [ScrollTimingControls.astro](../../molecules/ScrollTimingControls/ScrollTimingControls.astro) | El configurador compartido permite ajustar móvil y escritorio por separado. La pausa inicial es de 70 % en S/M y 30 % desde L. La transición es de 100 % y el cambio de imagen empieza al 30 % de ese tramo. |
| [scroll-timeline.scss](scroll-timeline.scss) | Una línea de tiempo gobierna el recorrido y sus rangos de entrada, pausa y salida. La pausa y la transición se expresan en unidades del viewport pequeño. |
| [orbit-playback.ts](orbit-playback.ts) y [orbit-particles.scss](orbit-particles.scss) | `IntersectionObserver` inicia la entrada CSS de 1500 ms, que termina aunque se detenga el scroll. La convergencia al hub y la salida por arriba responden al scroll. Al volver desde los formatos, los logos retoman la flotación. Salir por arriba del todo prepara una nueva entrada. |
| [admonet-hub.scss](admonet-hub.scss) | La cápsula se ilumina en rosa cuando convergen los logos, se eleva y se desvanece al entrar el celular. En móvil queda translúcida para que se vean las partículas. |
| [format-panels.scss](format-panels.scss) | En escritorio los textos y el botón acompañan el flujo y quedan fijos durante la pausa. Video recompensado además se desvanece al entrar. En móvil los bloques cambian por opacidad con rangos separados y el primer título aparece más tarde. |
| [shared-phone.scss](shared-phone.scss) y [panel-lighting.scss](panel-lighting.scss) | El celular entra desde abajo con opacidad 1. El slide entre imágenes y el cambio de halo comparten curva `ease-in-out` e inicio al 30 % de la transición. En S y M las pantallas fuera de su tramo quedan ocultas y el glow se desvanece en el 12 % de cada extremo. |
| [format-panels.scss](format-panels.scss) y [mobile-phone-fit.ts](mobile-phone-fit.ts) | En S y M la grilla reserva el espacio de los textos más altos y asigna el resto a una fila común, con un ancho máximo de 220 px en S y 280 px en M para el celular. `ResizeObserver` comunica el alto y el centro de esa fila al mockup y al halo compartidos. Si falta soporte de `subgrid`, mide el espacio entre los textos. La animación usa CSS. |
| [iphone-safari.scss](iphone-safari.scss) | Solo en Safari de iPhone móvil, un anclaje sticky de 1 × 1 px sostiene la escena con el contenido visible fuera de la caja. La prueba dinámica usa `100dvh - 12px` con 6 px libres por borde. Ver [la explicación y las pruebas de Safari](../../../../docs/animation-guidelines.md#anclaje-sticky-de-admonet-en-safari-de-iphone). |
| [debug-outlines.scss](debug-outlines.scss) | Los outlines y las etiquetas se conservan para revisar el layout. Para mostrarlos, descomentar su `@use` en [admonet-networks-demo.scss](admonet-networks-demo.scss). |

Los valores de AdMonet son un punto de comparación. Para cada migración,
elegir la pausa, las curvas, los rangos y la geometría según su original.
Aplicar la excepción de Safari cuando el problema se reproduzca en esa
animación.

## Pruebas que explican las decisiones actuales

- **Altura variable del celular por formato.** La prueba se revirtió. Quedó una
  única altura por viewport basada en el espacio común entre los bloques de
  texto para que cambiar de formato no cambie el tamaño del celular.
- **Fijación mediante traslación ligada al scroll.** Quitó el tinte de las
  barras, pero perdió fluidez en el iPhone real. El anclaje sticky conservó
  ambas cosas en la prueba al llegar a «Glosario».
- **Firefox.** Se comprobaron los valores automáticos del selector, la
  proporción y separación del celular móvil, y su tamaño constante entre
  formatos al bajar y volver a subir.
- **Pendiente en iPhone.** Confirmar visualmente el último degradado superior
  e inferior de los halos durante todo el recorrido.

## Movimiento reducido

La demo sigue `prefers-reduced-motion`. Con la preferencia activada, la
introducción queda quieta y los cuatro formatos aparecen en el flujo normal,
cada uno con su texto, botón y mockup. Se ocultan el celular compartido y los
controles de recorrido. Cada bloque tiene una altura mínima de `100dvh` y
crece si el contenido necesita más espacio.

[reduced-motion.scss](reduced-motion.scss) contiene los estilos de esta vista.
Los mockups comparten los límites de escritorio de Home y Ads. El alto máximo
es el 68 % del viewport y el ancho se limita a 230, 270 o 380 px según el rango.
En móvil, [mobile-phone-fit.ts](mobile-phone-fit.ts)
calcula un tamaño común a partir del espacio que dejan los textos y CSS
conserva la proporción del celular.

Para forzar esta vista durante una revisión, poner
`$preview-reduced-motion: true` en [admonet-networks-demo.scss](admonet-networks-demo.scss).
Dejarlo en `false` para seguir la preferencia del sistema. Se verificaron
los cinco bloques y sus mockups en Firefox a 390, 768, 1024, 1440 y 1980 px.
