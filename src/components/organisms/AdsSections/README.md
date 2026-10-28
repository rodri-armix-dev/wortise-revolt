# AdsSections

El coordinador `ads-sections.ts` activa `ads-sections-sticky.ts` en S/M y
`ads-sections-pin.ts` en L/XL/XXL. Cada controlador administra su fijación y
sus animaciones de contenido. `ads-sections-motion.ts` contiene el movimiento
compartido de paneles y pantallas, la accesibilidad y las utilidades del DOM.

## Entrada y salida del mockup en S/M

En sticky, el contenedor del teléfono conserva su posición en el grid y un
wrapper interior anima la escala y el desplazamiento vertical. El mockup ampliado
parte del centro de la escena y termina entre las tarjetas al llegar a escala `1`.
CSS y JavaScript usan la misma altura `100svh`, descontando los dos insets de 8 px;
el centrado no cambia al expandirse o contraerse las barras de Safari.

En sticky, CSS define la escala inicial del mockup completo en `1.5`. Una sola
timeline de GSAP lo lleva a `1` con `play()` después de permanecer 200 ms en un
slide asentado y vuelve hacia `1.5` con `reverse()` cuando comienza una transición
o sale del recorrido activo. El tiempo de espera se cancela al pasar a otro
slide, salir o destruir el controlador; así el scroll rápido no dispara entradas
de slides intermedios. Al invertir el scroll continúa desde el progreso actual,
sin reiniciar el zoom. Las tarjetas superior e inferior comienzan su secuencia
cuando termina la reducción del mockup. Con movimiento reducido la escala es `1` y no se crea
la timeline del zoom. El modo pin y el fallback de poca altura no aplican esta
escala inicial.

## Bug pendiente de Safari: absorción de colores

En este proyecto se observó que Safari absorbe o extiende los colores de capas
con `position: sticky` o `position: fixed` cuando quedan a menos de **6 px**
del borde del viewport. Es una condición del bug observado, no una regla
general garantizada para todas las versiones de Safari.

Como protección usamos **8 px**, mediante `--ads-sections-inset` y
`var(--spacing-8)` en `ads-sections.scss`. Ese espacio se contempla en la altura
de la escena y en sus márgenes; en sticky también interviene en la posición y
en el cálculo de la altura del recorrido. No reducirlo a 6 px ni eliminarlo
como si fuera espaciado decorativo o código sobrante mientras se investiga
el bug.

También forman parte de las protecciones actuales:

- `backdrop-filter: opacity(1)` en los paneles y, mientras está activo
  `data-enhanced`, en la escena, los halos y el contenedor del teléfono.
  Así la protección alcanza también las capas que se fijan y permanece aplicada
  durante la entrada, las transiciones y la salida en ambos sentidos. No depende
  de un evento de scroll ni introduce cambios entre `fixed` y `absolute`.
- `data-offscreen`, actualizado por el coordinador y consumido por el SCSS,
  para ocultar las capas sticky cuando el componente ya salió por arriba.

Estas protecciones deben evaluarse juntas. Su presencia no implica que el bug
esté resuelto, y cualquier limpieza o cambio en ellas necesita revisar el ciclo
completo del componente en Safari.

Los 8 px describen la separación durante la fijación. Al entrar o salir, las
capas pueden atravesar el borde del viewport, también al volver desde el
contenido posterior. Por eso el margen se complementa con el filtro en cada
contenedor, en lugar de confiar únicamente en `data-offscreen`. La salida parcial junto a FooterCTA y la reentrada continúan pendientes de validación en Safari de iPhone, incluyendo transparencias y desenfoques.

## Preservar el diseño

Las correcciones deben mantener la apariencia y el contenido durante todo el recorrido. No agregar franjas, máscaras opacas u overlays que cubran los bordes del viewport. La validación visual debe realizarse en Safari de iPhone.

## Salto al cambiar entre fixed y absolute

También se observó que la estrategia de cambiar una capa de `position: fixed`
a `position: absolute` suele producir un salto al hacer scroll rápido. Tenerlo
en cuenta al evaluar alternativas para liberar la fijación o evitar la
absorción de colores de Safari: ese cambio de posición no debe darse por válido
solo porque funciona con scroll lento o con el panel detenido.

Si se utiliza esta estrategia, comprobar la continuidad visual al cruzar el
punto de cambio con scroll rápido en ambos sentidos, incluida la vuelta de
`absolute` a `fixed`. No debe haber saltos de posición, cambios bruscos de
altura ni desplazamientos del contenido al entrar o salir de la fijación.

## Revisión obligatoria del scroll

La revisión debe cubrir **entrada, transiciones entre todos los paneles y
salida**, tanto desplazándose de arriba hacia abajo como de abajo hacia arriba.
Comprobar únicamente un panel detenido o el centro del recorrido no alcanza.

| Etapa | Scroll de arriba hacia abajo | Scroll de abajo hacia arriba |
| --- | --- | --- |
| Entrada | Entrar desde el contenido anterior y comprobar el inicio de la fijación. | Volver desde el contenido posterior y comprobar la reentrada y recuperación de las capas. |
| Transiciones | Recorrer todos los cambios de panel en orden. | Recorrer todos los cambios de panel en orden inverso. |
| Salida | Superar el último panel y comprobar la liberación de la fijación. | Superar el primer panel y volver al contenido anterior. |

En las seis situaciones comprobar que Safari no absorba ni extienda los
colores, que se respete la protección de 8 px y que no aparezcan franjas,
parpadeos, capas persistentes ni contenido oculto al regresar. Repetir con
scroll lento, rápido y con pausas durante una transición, e invertir el sentido
antes de completar el recorrido.

Si hay cambios entre `fixed` y `absolute`, repetir los cruces de sus puntos de
activación y liberación con scroll rápido en ambos sentidos, buscando
específicamente el salto descrito arriba.

Cubrir sticky en S/M y pin en L/XL/XXL, con touch y sin touch. Incluir el cruce
M/L en ambos sentidos con un panel intermedio activo: debe conservarse el panel
y limpiarse el controlador anterior sin pins duplicados ni capas residuales.
Revisar además el modo de movimiento reducido y el fallback de poca altura.

Registrar la versión de Safari y del sistema, el dispositivo, el tamaño del
viewport, el tipo de entrada y la etapa y dirección donde se reproduce el bug.
Una prueba en otro motor o una simulación de touch no sustituye la comprobación
visual en Safari.
