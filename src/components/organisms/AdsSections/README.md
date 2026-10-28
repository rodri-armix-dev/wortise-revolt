# AdsSections

El coordinador `ads-sections.ts` activa `ads-sections-sticky.ts` en S/M y
`ads-sections-pin.ts` en L/XL/XXL. Cada controlador administra su fijación y
sus animaciones de contenido. `ads-sections-motion.ts` contiene el movimiento
compartido de paneles y pantallas, la accesibilidad y las utilidades del DOM.

## Stack y movimiento desktop

En L/XL/XXL, las secciones originales forman una columna flex dentro de la escena
fijada. Cada sección conserva su único h2, etiqueta, descripción y CTA; no se
clonan ni se trasladan títulos fuera de su sección. Los textos editoriales siguen
en el HTML y en el árbol accesible. Solo los controles invisibles quedan fuera
del tabulado.

El scroll selecciona la etapa, sin controlar el progreso de sus animaciones.
El primer glow ya está en su posición junto al teléfono desde la entrada de la
sección, sin una etapa vacía ni una animación de entrada independiente. La primera
entrada de tarjetas se dispara con `top 25%`, antes del pin `top top`, comenzando
directamente con la izquierda y conservando los desfases de derecha y anotaciones
de Figma. Las siguientes se activan dentro del recorrido fijado. Cada
etapa usa una distancia base de 1.6 alturas de escena, ajustada por
`scrollDistanceMultiplier = 0.75` (1.2 alturas efectivas). El recorrido total,
los anchors y el teclado usan esa misma distancia ajustada.

`ads-sections-desktop-data.ts` conserva los segundos, valores y curvas exportados
de Figma, incluyendo las muestras de trayectorias con rebote. El adaptador
`ads-sections-desktop-motion.ts` los reproduce con GSAP, excluyendo las pausas de
presentación y el loop de 90 segundos. Los desplazamientos de tarjetas se
proporcionan a su ancho de referencia de 367 px, las anotaciones al teléfono de
329 px y los glows a la altura de 860 px del frame XL. No se sustituyen los assets
ni se altera el layout estático para aplicar los tracks.

Las salidas comprimen la tarjeta izquierda y animan por separado título,
contenido, anotaciones y glow. La entrada siguiente se solapa con esa salida:
1.765202 s para Proyección y 0.88 s para Diseño creativo. La pantalla del teléfono
forma parte de esa timeline temporal; continúa aunque el scroll se detenga.
El primer fondo del teléfono permanece detrás de las pantallas entrantes.

CSS resuelve el flujo del stack; JS mide alturas, selecciona la etapa y reproduce
las timelines. Agregar items extiende el recorrido automáticamente. Las etapas
posteriores a las tres de Figma reutilizan la última entrada y la salida revisada
de Proyección. La anotación local adicional de audiencia no tiene un track en
Figma y aparece con su etapa sin inventar una trayectoria independiente.

La aceleración combina anticipación por velocidad y atraso real. Se mide la
velocidad en alturas de escena por segundo: hasta 1 se conserva la velocidad
normal; entre 1 y 4 aumenta progresivamente la anticipación hasta 3x. Solo se
aplica si el scroll y la animación van en el mismo sentido. Una pausa de 250 ms
retira esa anticipación con una rampa suave, conservando el atraso pendiente.

Si se solicita otra etapa mientras corre una timeline, esta conserva su progreso
y acelera suavemente para terminar. Solo se retiene el último destino solicitado; al
completar, la entrada pendiente también se acelera hasta alcanzarlo. El objetivo
inicial es medio segundo por secuencia, con un máximo de 8x y una rampa de 120 ms.
Con scroll lento y sin solicitudes pendientes se mantienen los tiempos originales
de Figma. Se toma la mayor aceleración entre ambas señales, con límite de 8x;
no se multiplican entre sí ni se alteran las curvas o el orden de los keyframes.
La velocidad resultante se ajusta por `animationSpeedMultiplier = 1.25`, tanto
al avanzar como en reversa: las duraciones efectivas se dividen por 1.25. Este
multiplicador de animación es independiente del multiplicador de scroll.
Volver al destino que ya se está animando cancela el avance pendiente. Resize,
HMR y destrucción cancelan también el ajuste de velocidad. Al subir se recorre
la misma timeline en reversa: se contrae y desaparece la etapa superior mientras
la anterior recupera su título, contenido, anotaciones, pantalla y glow. Si la
timeline ya no está disponible (por ejemplo, después de resize o un anchor), se
reconstruye entre los mismos estados y se reproduce desde su final hacia atrás.
Las solicitudes pendientes aceleran también la reversa, conservando su dirección;
solo se retiene el último destino. Invertir el scroll durante una transición
continúa desde su progreso actual cuando sus extremos coinciden. Resize, HMR y cambio de breakpoint revierten las timelines y limpian
estilos y triggers. La medición ignora la altura animada del intro para evitar
reconstrucciones durante la contracción.

Antes de fijar, se comprueban todas las alturas acumuladas del stack y las
descripciones. Si alguna no cabe con los márgenes existentes, o se solicita
movimiento reducido, se conserva la lectura normal sin pin. S/M mantiene su
controlador sticky y sus animaciones actuales.

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
