# Criterios compartidos de animación

Lista de revisión para diseñar, implementar y verificar animaciones del sitio.
Responder las preguntas aplicables con el comportamiento elegido y cómo se verificará. Este documento
define responsabilidades reutilizables; no describe una API global ya implementada.
Las secciones actuales tienen controladores propios. Reutilizar comportamientos
existentes cuando encajen y mantener sus valores concretos en el componente dueño.

Separar el movimiento visual del controlador que decide cuándo reproducirlo.
Cambiar entre scroll nativo y navegación por diapositivas no debería exigir rehacer
las entradas y salidas. No todas las categorías aplican a todas las secciones.

## 1. ¿Qué fases necesita la animación?

- **Entrada:** lleva el elemento desde su estado inicial hasta su posición de lectura.
- **Espera:** mantiene el contenido disponible; puede ser estática o tener movimiento
  continuo, como un balanceo o partículas.
- **Salida:** prepara el cambio de contenido o abandona la escena.

Definir el estado final de cada fase, también al volver hacia atrás. Una espera de
lectura no es necesariamente una animación ni obliga a bloquear la navegación.

## 2. ¿Qué tiempos deben poder ajustarse?

Separar duración, demora antes de comenzar, pausa entre fases y aparición escalonada
de elementos. Mantener constantes con nombres claros para los valores ajustables.

Indicar si una pausa pertenece a la línea de tiempo y se acelera junto con ella,
o si debe conservar una duración real mínima. Evitar esperas pendientes que se
ejecuten después de que el usuario haya abandonado el panel.

## 3. ¿Qué propiedades cambian durante el movimiento?

Los recursos comunes son desplazamiento, escala, giro y opacidad. Sus distancias,
orígenes y amplitudes pertenecen al diseño de cada sección.

Preferir transformaciones y opacidad cuando expresen el efecto. Si una animación
modifica dimensiones reales, considerar sus efectos sobre las mediciones y el
resto del contenido. No animar la geometría del elemento fijado por ScrollTrigger;
animar su contenido interior.

## 4. ¿Cómo acelera, frena y se asienta cada movimiento?

Definir cómo acelera, desacelera y se asienta cada movimiento. El suavizado también
aplica al seguimiento del cursor y a los cambios de velocidad.

Evitar saltos al pasar de una entrada al reposo o de una interacción al retorno.
Las rotaciones deben volver por un recorrido coherente, sin vueltas accidentales.

## 5. ¿Cómo se coordinan las fases y los elementos compartidos?

Coordinar la salida del panel anterior con la entrada del siguiente. Definir si
ocurren en secuencia o con superposición y cuánto dura esa superposición.

Los elementos compartidos —por ejemplo, el marco del celular, sus pantallas y la
iluminación— pertenecen a la transición de la sección. Deben conservar continuidad
entre paneles, sin duplicarse ni reiniciarse innecesariamente.

## 6. ¿Cómo se determina el progreso de la animación?

Distinguir tres modalidades:

- **Por tiempo:** una acción inicia una animación con duración propia.
- **Ligada al scroll:** la posición de scroll determina el progreso de la animación.
- **Por diapositivas:** un gesto solicita avanzar o retroceder; la transición tiene
  su propia duración.

Elegir una modalidad principal para cada recorrido. Una sección puede combinarla
con efectos de reposo o interacciones locales, definiendo cuál tiene prioridad.

## 7. ¿Qué mecanismo controla la interacción y cómo se fija la escena?

Elegir el mecanismo según la señal que necesita la animación.

| Necesidad | Mecanismo que conviene evaluar |
| --- | --- |
| Detectar cuándo un elemento entra o sale de pantalla | `IntersectionObserver`. |
| Vincular el progreso o los umbrales de la animación a la posición del scroll | GSAP `ScrollTrigger`. |
| Interpretar la rueda, el trackpad o un gesto táctil como avance o retroceso | GSAP `Observer`. |
| Mantener la escena visible dentro de su contenedor | CSS `position: sticky`. |
| Fijar la escena durante un tramo calculado por GSAP | `pin` de ScrollTrigger. Revisar inicio, final y espacio reservado. |
| Reproducir por tiempo tras una acción o al cargar | CSS o una línea de tiempo de GSAP, según la coordinación necesaria. |

Estos mecanismos se pueden combinar. Una sección puede usar sticky para fijar
la escena y ScrollTrigger para medir el recorrido. Otra puede usar pin para
fijarla y Observer para elegir el panel. Si solo importa la visibilidad, revisar
si alcanza con IntersectionObserver y una animación por tiempo.

Verificar qué mecanismo recibe la entrada, cuál fija la escena y cuál actualiza
la animación. Si dos mecanismos actúan sobre el mismo scroll, comprobar quién
tiene el control al entrar, durante el recorrido y al salir.

La estrategia actual de las secciones de paneles usa pin en desktop y sticky en
S/M. Es una decisión del proyecto por los problemas encontrados, no una limitación
universal de pin en dispositivos móviles.

`anticipatePin` es una opción de ScrollTrigger para anticipar la fijación; no se
aplica a CSS sticky. Definir inicio, final, espacio reservado, altura útil y
liberación de la sección independientemente del movimiento de los paneles.

Para diapositivas dentro de una sección fijada, separar la detección de intención
del bloqueo del desplazamiento. Mantener estable la posición de scroll durante
los cambios de panel y liberar ambos controles en los extremos. Contemplar la
entrada desde arriba y la reentrada desde abajo.

**Caso verificado en AdMonet desktop.** Al alternar entre paneles hacia arriba y
hacia abajo, el desplazamiento residual podía mover la escena por un instante y
dejar visible la sección siguiente. Corregir la posición de forma instantánea y
mantener un margen de 32 px dentro del recorrido del pin redujo el salto.

El ajuste que resolvió el salto en la prueba del usuario fue bloquear también
el desplazamiento nativo del documento mientras el Observer de bloqueo está
activo. Se aplica `overflow-y: hidden` al documento y se reserva el espacio de
la barra con `scrollbar-gutter: stable`. Al desactivar el bloqueo, se restauran
los estilos anteriores para recuperar el scroll normal. Revisar la salida por
ambos extremos y la reentrada desde abajo al reutilizar este patrón.

El comportamiento base puede ignorar nuevas solicitudes mientras reproduce una
transición y volver a responder cuando termina. Exigir que termine completamente
un gesto puede sentirse bloqueado con la inercia del Magic Mouse o del trackpad.
Un desplazamiento continuo puede avanzar varios paneles, uno tras otro; esto no
equivale a garantizar un único panel por gesto.

Usar el teclado como vía equivalente. Validar con dispositivos reales: eventos
simulados de rueda no reproducen por completo la inercia del sistema operativo.

## 8. ¿Cómo responde la animación a la velocidad del gesto?

Separar velocidad normal, aceleración por gesto rápido y aceleración para alcanzar
un destino pendiente. No representan el mismo comportamiento.

Aplicar cambios suaves y un máximo legible. Se pueden limitar especialmente las
transiciones que necesitan más tiempo, como el cierre del panel 0 de AdMonet.
Al cesar el gesto, devolver suavemente la velocidad a su valor normal.

Cuando se comparen resoluciones, normalizar la velocidad de scroll por la altura
de la escena. La navegación con teclado debe tener una duración predecible.

**AdMonet.** En desktop, la reproducción normal usa 1,15 segundos por unidad de
la línea de tiempo. Observer calcula la aceleración a partir de la velocidad
vertical del gesto, dividida por la altura de la escena. El máximo es 2,2× y
baja a 1,5× en la transición del panel 0 para conservar la lectura de su cierre.
Al terminar el gesto, la velocidad vuelve suavemente a 1×. En mobile, la
posición del scroll elige el panel y la distancia restante en la línea de tiempo
determina la duración de la transición, con un mínimo y un máximo.

## 9. ¿Qué ocurre si llega otra acción durante la animación?

Elegir explícitamente qué ocurre si llega otra acción antes de terminar:

| Política | Comportamiento |
| --- | --- |
| Ignorar mientras anima | Completa la transición y descarta las nuevas solicitudes. |
| Guardar el último destino | Completa la transición actual y atiende el último destino solicitado. |
| Redirigir | Continúa desde el estado visual actual hacia otro destino. |
| Invertir | Reproduce la misma transición hacia atrás desde su progreso actual. |
| Resolver inmediatamente | Coloca el contenido directamente en un estado definido. |

Distinguir acciones en la misma dirección de las que invierten el recorrido.
Una nueva solicitud puede ajustar la velocidad sin cancelar la animación.
Definir también prioridades: por ejemplo, el scroll manual puede cancelar un
desplazamiento iniciado con teclado y el arrastre puede reemplazar el reposo.

No imponer una única política a paneles, efectos de hover y objetos arrastrables.
Cancelar demoras, interpolaciones y solicitudes que ya no correspondan.

## 10. ¿Qué acciones disparan la animación?

Los disparadores reutilizables incluyen carga, entrada en pantalla, scroll hacia
abajo, scroll hacia arriba, hover, clic, toque, arrastre y selección de un elemento.

En una secuencia de paneles, el scroll hacia abajo avanza al panel siguiente y
el scroll hacia arriba vuelve al anterior. Si ya hay una transición en curso,
la política de interrupción define cómo responder al cambio de dirección.

Definir si el efecto ocurre una vez, se repite al regresar o se mantiene mientras
hay interacción. En dispositivos táctiles, distinguir toque de arrastre para no
disparar acciones accidentales. No asumir que ancho de pantalla y tipo de entrada
son equivalentes.

## 11. ¿Qué estado se conserva al cambiar el contexto?

Conservar, cuando corresponda, panel activo, progreso, destino y estado de los
elementos al redimensionar, cambiar orientación o recalcular la fijación.

Medir desde una estructura estable y evitar recalcular continuamente a causa de
las propias transformaciones. Los enlaces con ancla deben poder abrir un panel
directamente. Al cambiar de estrategia responsive, decidir qué estado equivalente
restaurar, en lugar de reiniciar siempre al primer panel.

## 12. ¿Cuándo se reproduce, se pausa o se libera la animación?

Pausar efectos continuos y renderizados costosos fuera de pantalla o cuando la
pestaña queda oculta. Decidir si al volver se continúa o se reinicia la entrada.

Al desmontar o actualizar el componente, liberar listeners, observers, timers,
frames y recursos gráficos. La visibilidad también debe controlar qué contenido
puede recibir interacción, no solamente qué se dibuja.

## 13. ¿Cómo se usa con teclado y con movimiento reducido?

Respetar `prefers-reduced-motion` con una presentación legible y utilizable.
Ofrecer navegación por teclado sin interceptar la escritura ni las acciones de
enlaces, botones y campos de formulario.

Los controles de paneles ocultos no deben recibir foco o clics. Coordinar `inert`,
`aria-hidden` y el estado visual; opacidad cero por sí sola no los deshabilita.
La navegación por diapositivas debe permitir abandonar la sección.

## 14. ¿Cómo se presenta el contenido si la animación no puede ejecutarse?

Conservar contenido y funciones si no hay JavaScript, falla WebGL o falta altura
para fijar la escena. No establecer mínimos basados únicamente en el ancho.

Antes de desactivar una secuencia por altura, evaluar si pueden adaptarse el gap
interno y la geometría sin recortar textos. Si no alcanza, mostrar los paneles en
el flujo normal. Esa vista debe conservar imágenes y mockups completos.

## 15. ¿Qué ajustes y pruebas requiere cada navegador?

Mantener las excepciones de navegador separadas de los espacios editoriales.
Los ajustes actuales incluyen un margen de **8px** para ciertos recorridos móviles
y un tratamiento de capas sticky fuera de pantalla en WebKit.

No aplicar esos ajustes a todas las secciones automáticamente. Verificar Safari
con sus barras expandidas y contraídas, además de Firefox y Chromium. Revisar el
recorrido con mouse, Magic Mouse, trackpad, teclado y entrada táctil según alcance.

### Anclaje sticky de AdMonet en Safari de iPhone

Safari podía extender el color de la escena a sus barras y conservar el tinte
al llegar al footer. En el iPhone, el efecto se reprodujo con cada capa sticky
por separado, tanto con la escena visual como con los textos. La variante que
simulaba la fijación mediante una animación de scroll eliminó el tinte, pero
perdió fluidez en el dispositivo.

La demo usa un único anclaje transparente de **1 × 1 px** con
`position: sticky`. La escena y los textos conservan su tamaño dentro de él.
El anclaje deja que se pinten fuera de su caja mediante el valor por defecto
`overflow: visible`. Aplicar `overflow: hidden` o `overflow: clip` al
anclaje recortaría el contenido. El margen inferior del anclaje compensa el
alto de la escena menos 1 px para que se libere al final del recorrido previsto.

Durante la fijación, la demo prueba `100dvh - 12px` y reserva **6 px en cada
borde** del viewport dinámico. Es el umbral observado en el
[registro de AdsSections](../src/components/organisms/AdsSections/README.md#bug-pendiente-de-safari-absorción-de-colores).

El ajuste vive en [iphone-safari.scss](../src/components/organisms/AdMonetNetworksDemo/iphone-safari.scss)
y se aplica solo a Safari de iPhone en el rango móvil. En la prueba en iPhone
con 8 px por borde, el scroll volvió a sentirse fluido y «Glosario» se veía
desenfocado detrás del reloj al llegar al footer. Queda por repetir la entrada y
la salida con 6 px y altura dinámica, en ambos sentidos y con las barras abiertas y contraídas.

Home, AdMonet y Ads comparten la geometría del anclaje en el workshop. Home y
Ads reservan 8 px por borde, y AdMonet reserva 6 px. Las tres escenas usan una
máscara vertical que desvanece solo la luz en el 12 % superior e inferior.
Queda pendiente comparar Ads con 8 y 6 px en un iPhone real, con las barras
abiertas y contraídas, antes de decidir si conviene reducir su margen.

En S y M, los tres demos reservan las filas de título y contenido según los
bloques más altos de sus paneles. El celular usa la fila central y mantiene
su proporción, con un ancho máximo de 220 px en S. En M, el máximo es de 280 px
en Home y AdMonet y de 240 px en Ads. Las tarjetas de Ads usan una columna
centrada de hasta 414 px. Las escenas se animan desde
560 px de altura de viewport. Con menos altura, los paneles quedan en flujo.

## Referencias del proyecto

- [Guía para migrar de GSAP a CSS scroll-driven con AdMonet como referencia](../src/components/organisms/AdMonetNetworksDemo/README.md).

- Paneles de Ads: `src/components/organisms/AdsSections/ads-sections.ts` y sus
  controladores `ads-sections-pin.ts` y `ads-sections-sticky.ts`.
- Paneles de desarrolladores: `src/components/organisms/AdMonetNetworks/admonet-sequence.ts`.
- Hero del home: `src/components/molecules/HeroVisual/hero-visual-3d.ts`.
- Globo del home: [documentación del globo](world-globe.md).
- Nuevas secciones: [verificación de módulos](module-verification.md).

Para una sección nueva, registrar qué categorías utiliza, su política de
interrupción y las resoluciones y dispositivos verificados. Compartir mecanismos
cuando exista una necesidad real; mantener las decisiones visuales específicas
en la sección que las necesita.
