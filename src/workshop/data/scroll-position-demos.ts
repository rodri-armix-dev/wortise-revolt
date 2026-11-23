export const scrollPositionDemos = [
	{
		mode: 'flow',
		title: 'Flujo normal',
		description: 'Usá flujo normal cuando quieras recorrer paneles independientes de arriba abajo. Cada panel viaja con la página: mientras A sale por arriba, B entra desde abajo.',
		result: 'Los cinco paneles pasaron con el scroll normal de la página.',
	},
	{
		mode: 'sticky-panels',
		title: 'Sticky por panel',
		description: 'Usalo cuando quieras que cada panel se quede entero durante un tramo extra de scroll. Cada uno se fija dentro de su propio contenedor y después sube con la página mientras entra el siguiente.',
		result: 'Cada panel se fijó y se liberó al llegar al límite de su propio contenedor.',
	},
	{
		mode: 'scroll-driven',
		title: 'CSS Scroll-driven',
		description: 'Usalo para controlar la pausa y el ritmo de entrada y salida con una línea de tiempo de CSS. Probá los mismos valores que en CSS sticky + JS para comparar el movimiento con un gesto rápido.',
		result: 'Al terminar el recorrido, la escena sticky vuelve a subir con la página.',
	},
	{
		mode: 'sticky',
		title: 'CSS sticky + JS',
		description: 'Usalo cuando quieras controlar por separado cuánto scroll queda quieto cada panel y a qué ritmo sale uno y entra el siguiente. Con Transición al 50 %, el cambio se completa en media pantalla de scroll. Al 200 %, ocupa dos pantallas. También podés elegir Corte directo.',
		result: 'El borde inferior de la escena llegó al final del contenedor y la escena volvió a subir.',
	},
	{
		mode: 'pin',
		title: 'GSAP pin',
		description: 'Usalo cuando necesites programar dónde se fija y dónde se libera la escena, o coordinar una secuencia más compleja. En esta demo, GSAP la libera después de E mientras todavía queda un tramo en la sección.',
		result: 'GSAP liberó la escena dentro de la sección. Después de E apareció el tramo que faltaba recorrer.',
	},
] as const;

export type ScrollPositionDemo = (typeof scrollPositionDemos)[number];

export const scrollPositionPanels = [
	{ id: 'a', title: 'Panel A', description: 'Inicio de la sección' },
	{ id: 'b', title: 'Panel B', description: 'Primer cambio de panel' },
	{ id: 'c', title: 'Panel C', description: 'Mitad del recorrido' },
	{ id: 'd', title: 'Panel D', description: 'Antes del último panel' },
	{ id: 'e', title: 'Panel E', description: 'Último panel' },
] as const;
