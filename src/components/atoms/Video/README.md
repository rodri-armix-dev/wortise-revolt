# Video

Video HTML nativo, independiente del proveedor de contenido. `src`, `label`, `width` y `height` son obligatorios; las dimensiones reservan la proporción antes de cargar. Acepta `poster`, `autoplay`, `loop`, `controls` y `muted`.

Por defecto reproduce silenciado, inline y en loop cuando al menos el 25% del video es visible. Pausa al salir del viewport o al ocultar la pestaña. Respeta la pausa manual y `prefers-reduced-motion`; los controles nativos permiten iniciar la reproducción. No usa el atributo HTML `autoplay`: IntersectionObserver decide cuándo comenzar. Sin JS u observer, conserva reproducción manual. `autoplay={false}` deja todo el control al usuario.

API visual: `--video-width`, `--video-height`, `--video-object-fit`, `--video-object-position`, `--video-radius`. El consumidor limita el ancho mediante un wrapper propio.

VideoSection recibe `video` y un `mobileVideo` opcional, ambos con las props inferidas de Video. Desde L muestra `video`; debajo de L muestra `mobileVideo` cuando existe. Los videos ocultos no reproducen ni precargan. Está registrado como módulo `video-section` en ModulesPage.

Las demos locales están en `src/data/video-demo.ts` y se muestran en `/es/ui/` durante el desarrollo del perfil full. Los videos editoriales se definen en `src/data/videos.ts`.
