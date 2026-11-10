# Reorganización de contenido y recursos

La reorganización conserva los textos, rutas, traducciones publicadas y configuración visual. Los originales y recursos retirados se conservan localmente en `.private/assets/`, fuera de Git y de la publicación. El equipo debe respaldar esa carpeta por separado si necesita compartir originales.

El contenido editable usa nombres directos en inglés (`hero.title`, `hero.description`, `hero.button`), sin HTML. Los textos comunes están en `src/content/global/`. Consultá la [guía breve](editing-content.md).

Los destinos externos de botones se centralizan por idioma en `src/content/global/buttons/`. El demo del footer usa el mismo destino que los demás botones de demo. Las anclas provisionales de vacantes e ingreso se conservan hasta contar con destinos aprobados.

## Resultado

- 21 documentos JSON editables, ocho artículos con metadatos y cuerpo juntos, y nueve documentos legales en Markdown.
- 22 conversiones WebP sin pérdida, verificadas comparando los píxeles RGBA decodificados; ahorro de 898,476 bytes (877.4 KiB). Las imágenes que no reducían peso o alteraban píxeles conservaron su formato.
- Un solo símbolo compartido sustituye al duplicado exacto usado en inicio y footer (580.671 bytes de duplicación en fuentes).
- Once imágenes sin referencias y el teléfono original sin uso quedaron archivados; los PNG de exportación del blog también se conservaron localmente.
- Los videos mantienen sus archivos y peso; los videos de demostración se excluyen de ambos builds.

## Validación

- Build completo: 27 rutas, idénticas al inventario previo. Comparación del texto visible y los atributos alt, aria-label, placeholder y title: sin diferencias.
- Lanzamiento: 13 rutas; también se comprobó el build bajo `/preview/`.
- 1.298 enlaces y recursos locales del build completo, más 374 del lanzamiento bajo subruta, resuelven a archivos o páginas existentes.
- Navegador: 99 combinaciones sobre 11 rutas. Anchos 360, 575, 576, 1023, 1024, 1379, 1380, 1979 y 1980 px, tomados del mínimo soportado y de los límites de los rangos compartidos. Sin imágenes rotas, desbordes horizontales ni excepciones de JavaScript. Capturas de las páginas principales en S y XL.
- Pasaron contratos de contenido, publicación, idiomas, Markdown, sanitización de títulos, Astro Check y Sass Lint de los estilos modificados.
- Se corrigieron dos expectativas antiguas de publicación: Crear usuario ya apuntaba a `ads.wortise.com` antes de la migración. El enlace de contacto del footer conserva su destino.
- Los builds mantienen el aviso previo sobre un chunk JavaScript mayor de 500 kB. No se modificó la estrategia de carga.

## Pendientes editoriales y límites

Se conservan los contenidos de demostración del blog, las vacantes con destinos temporales, los datos ilustrativos de Madrid y California y las traducciones incompletas que ya estaban pendientes. No se crearon nuevas traducciones ni se activaron destinos deshabilitados. La estructura visual y los saltos editoriales existentes se mantuvieron deliberadamente. La licencia web de Aeonik Pro sigue requiriendo confirmación antes de producción.

La revisión en navegador cubre recursos y geometría responsive; no sustituye una aprobación editorial de contenidos ni una comparación de cada fotograma de animación. Los nuevos textos o imágenes deben revisarse después de cada reemplazo.

## Mapa de imágenes, fuentes y recursos

| Ruta anterior | Ruta actual o archivo local | Resultado |
| --- | --- | --- |
| `src/assets/ad-formats/interstitial-screen.png` | `src/assets/pages/developers/interstitial-ad-screen.webp` | WebP sin pérdida |
| `src/assets/ad-formats/native-screen.png` | `src/assets/pages/developers/native-ad-screen.webp` | WebP sin pérdida |
| `src/assets/ad-formats/offerwall-screen.png` | `src/assets/pages/developers/offerwall-ad-screen.webp` | WebP sin pérdida |
| `src/assets/ad-formats/rewarded-screen.png` | `src/assets/pages/developers/rewarded-ad-screen.webp` | WebP sin pérdida |
| `src/assets/admonet/desktop-glow.svg` | `.private/assets/unused/admonet/desktop-glow.svg` | Archivado local |
| `src/assets/admonet/desktop-orbit-core.svg` | `src/assets/pages/developers/desktop-orbit-core.svg` | Movido |
| `src/assets/admonet/desktop-orbit-inner.svg` | `src/assets/pages/developers/desktop-orbit-inner.svg` | Movido |
| `src/assets/admonet/desktop-orbit-middle.svg` | `src/assets/pages/developers/desktop-orbit-middle.svg` | Movido |
| `src/assets/admonet/desktop-orbit-outer.svg` | `src/assets/pages/developers/desktop-orbit-outer.svg` | Movido |
| `src/assets/admonet/mobile-glow.svg` | `.private/assets/unused/admonet/mobile-glow.svg` | Archivado local |
| `src/assets/admonet/particles/admob-mark.png` | `src/assets/pages/developers/admob-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/admob-texture.png` | `src/assets/pages/developers/admob-texture.png` | Movido |
| `src/assets/admonet/particles/app-network-mark.png` | `src/assets/pages/developers/app-network-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/google-ad-manager-mark.png` | `src/assets/pages/developers/google-ad-manager-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/google-ad-manager-texture.png` | `src/assets/pages/developers/google-ad-manager-texture.png` | Movido |
| `src/assets/admonet/particles/gradient-ring-mark.png` | `src/assets/pages/developers/gradient-ring-mark.png` | Movido |
| `src/assets/admonet/particles/gradient-ring-texture.png` | `src/assets/pages/developers/gradient-ring-texture.png` | Movido |
| `src/assets/admonet/particles/ironsource-mark.png` | `src/assets/pages/developers/ironsource-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/ironsource-texture.png` | `src/assets/pages/developers/ironsource-texture.png` | Movido |
| `src/assets/admonet/particles/liftoff-mark.png` | `src/assets/pages/developers/liftoff-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/liftoff-texture.png` | `src/assets/pages/developers/liftoff-texture.png` | Movido |
| `src/assets/admonet/particles/meta-mark.png` | `src/assets/pages/developers/meta-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/mintegral-texture.png` | `src/assets/pages/developers/mintegral-texture.png` | Movido |
| `src/assets/admonet/particles/pangle-texture.png` | `src/assets/pages/developers/pangle-texture.png` | Movido |
| `src/assets/admonet/particles/red-mark.png` | `src/assets/pages/developers/red-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/teal-mark.png` | `src/assets/pages/developers/teal-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/unity-mark.png` | `src/assets/pages/developers/unity-mark.webp` | WebP sin pérdida |
| `src/assets/admonet/particles/unity-texture.png` | `src/assets/pages/developers/unity-texture.png` | Movido |
| `src/assets/ads/cover-glow-mobile.svg` | `src/assets/pages/wortise-ads/cover-glow-mobile.svg` | Movido |
| `src/assets/ads/cover-glow.svg` | `src/assets/pages/wortise-ads/cover-glow.svg` | Movido |
| `src/assets/ads/sections/creative-screen.webp` | `src/assets/pages/wortise-ads/creative-dashboard.webp` | Movido |
| `src/assets/ads/sections/creative.png` | `.private/assets/unused/ads/sections/creative.png` | Archivado local |
| `src/assets/ads/sections/efficiency-screen.webp` | `src/assets/pages/wortise-ads/efficiency-dashboard.webp` | Movido |
| `src/assets/ads/sections/efficiency.png` | `.private/assets/unused/ads/sections/efficiency.png` | Archivado local |
| `src/assets/ads/sections/projection-screen.webp` | `src/assets/pages/wortise-ads/projection-dashboard.webp` | Movido |
| `src/assets/ads/sections/projection.png` | `.private/assets/unused/ads/sections/projection.png` | Archivado local |
| `src/assets/ads/sections/reporting-screen.webp` | `src/assets/pages/wortise-ads/reporting-dashboard.webp` | Movido |
| `src/assets/ads/sections/reporting.png` | `.private/assets/unused/ads/sections/reporting.png` | Archivado local |
| `src/assets/ads/wortise-ads-logo-transparent.png` | `src/assets/pages/wortise-ads/wortise-ads-logo-transparent.png` | Movido |
| `src/assets/ads/wortise-ads-logo@2x.png` | `.private/assets/unused/ads/wortise-ads-logo@2x.png` | Archivado local |
| `src/assets/audience/advertisers-screen.webp` | `src/assets/pages/home/advertisers-screen.webp` | Movido |
| `src/assets/audience/developers-app-preview.png` | `.private/assets/unused/audience/developers-app-preview.png` | Archivado local |
| `src/assets/audience/developers-screen.webp` | `src/assets/pages/home/developers-screen.webp` | Movido |
| `src/assets/audience/wortise-ads-app-preview.png` | `.private/assets/unused/audience/wortise-ads-app-preview.png` | Archivado local |
| `src/assets/audience/wortise-ads-screen.webp` | `src/assets/pages/home/wortise-ads-screen.webp` | Movido |
| `src/assets/blog/ad-blocking.webp` | `src/assets/blog/articles/ad-blocking.webp` | Movido |
| `src/assets/blog/ad-network.webp` | `src/assets/blog/articles/ad-network.webp` | Movido |
| `src/assets/blog/ad-platforms.webp` | `src/assets/blog/articles/ad-platforms.webp` | Movido |
| `src/assets/blog/app-ads-txt.webp` | `src/assets/blog/articles/app-ads-txt.webp` | Movido |
| `src/assets/blog/authors/sergio.png` | `src/assets/blog/authors/sergio.webp` | WebP sin pérdida |
| `src/assets/blog/cookies.webp` | `src/assets/blog/articles/cookies.webp` | Movido |
| `src/assets/blog/programmatic-trends.webp` | `src/assets/blog/articles/programmatic-trends.webp` | Movido |
| `src/assets/blog/self-serve.webp` | `src/assets/blog/articles/self-serve.webp` | Movido |
| `src/assets/brands/apple.png` | `src/assets/pages/home/apple.webp` | WebP sin pérdida |
| `src/assets/brands/hbo.png` | `src/assets/pages/home/hbo.webp` | WebP sin pérdida |
| `src/assets/brands/mcdonalds.png` | `src/assets/pages/home/mcdonalds.webp` | WebP sin pérdida |
| `src/assets/brands/spotify.png` | `src/assets/pages/home/spotify.webp` | WebP sin pérdida |
| `src/assets/brands/toyota.png` | `src/assets/pages/home/toyota.webp` | WebP sin pérdida |
| `src/assets/brands/visa.png` | `src/assets/pages/home/visa.webp` | WebP sin pérdida |
| `src/assets/certifications/google-authorized-buyer-partner.png` | `src/assets/certifications/google-authorized-buyer-partner.png` | Movido |
| `src/assets/certifications/google-partner-certified-channel.png` | `src/assets/certifications/google-partner-certified-channel.png` | Movido |
| `src/assets/contact/glow-desktop.svg` | `src/assets/pages/contact/glow-desktop.svg` | Movido |
| `src/assets/contact/glow-mobile.svg` | `src/assets/pages/contact/glow-mobile.svg` | Movido |
| `src/assets/contact/orbit.svg` | `src/assets/pages/contact/orbit.svg` | Movido |
| `src/assets/decorations/cover-glow-secondary.svg` | `src/assets/global/decorations/cover-glow-secondary.svg` | Movido |
| `src/assets/fonts/aeonik-pro/aeonik-pro-bold.woff2` | `src/assets/global/fonts/aeonik-pro/aeonik-pro-bold.woff2` | Movido |
| `src/assets/fonts/aeonik-pro/aeonik-pro-light.woff2` | `src/assets/global/fonts/aeonik-pro/aeonik-pro-light.woff2` | Movido |
| `src/assets/fonts/aeonik-pro/aeonik-pro-medium.woff2` | `src/assets/global/fonts/aeonik-pro/aeonik-pro-medium.woff2` | Movido |
| `src/assets/fonts/aeonik-pro/aeonik-pro-regular.woff2` | `src/assets/global/fonts/aeonik-pro/aeonik-pro-regular.woff2` | Movido |
| `src/assets/footer/background.png` | `.private/assets/unused/footer/background.png` | Archivado local |
| `src/assets/footer/brand.png` | `src/assets/global/branding/wortise-symbol.png` | Movido |
| `src/assets/footer/facebook.svg` | `src/assets/global/footer/facebook.svg` | Movido |
| `src/assets/footer/footer-cta-background.jpg` | `src/assets/global/footer/footer-cta-background.jpg` | Movido |
| `src/assets/footer/instagram.svg` | `src/assets/global/footer/instagram.svg` | Movido |
| `src/assets/footer/linkedin.svg` | `src/assets/global/footer/linkedin.svg` | Movido |
| `src/assets/footer/symbol.png` | `.private/assets/unused/footer/symbol.png` | Archivado local |
| `src/assets/gallery/about-1.jpg` | `src/assets/pages/about/team-desk.jpg` | Movido |
| `src/assets/gallery/about-2.jpg` | `src/assets/pages/about/team-lounge.jpg` | Movido |
| `src/assets/gallery/about-3.jpg` | `src/assets/pages/about/team-conversation.jpg` | Movido |
| `src/assets/gallery/about-4.jpg` | `src/assets/pages/about/team-table-football.jpg` | Movido |
| `src/assets/gallery/about-5.jpg` | `src/assets/pages/about/team-workspace.jpg` | Movido |
| `src/assets/gallery/about-6.jpg` | `src/assets/pages/about/team-laptop.jpg` | Movido |
| `src/assets/gallery/home-1.jpg` | `src/assets/pages/home/team-conversation.jpg` | Movido |
| `src/assets/gallery/home-2.jpg` | `src/assets/pages/home/team-lounge.jpg` | Movido |
| `src/assets/gallery/home-3.jpg` | `src/assets/pages/home/team-planning.jpg` | Movido |
| `src/assets/gallery/home-4.jpg` | `src/assets/pages/home/team-table-football.jpg` | Movido |
| `src/assets/gallery/home-5.jpg` | `src/assets/pages/home/team-collaboration.jpg` | Movido |
| `src/assets/gallery/home-6.jpg` | `src/assets/pages/home/team-workspace.jpg` | Movido |
| `src/assets/gallery/home-7.jpg` | `src/assets/pages/home/team-laptop.jpg` | Movido |
| `src/assets/gallery/home-8.jpg` | `src/assets/pages/home/team-desk.jpg` | Movido |
| `src/assets/gallery/home-9.jpg` | `src/assets/pages/home/team-meeting.jpg` | Movido |
| `src/assets/home/glow.svg` | `src/assets/pages/home/glow.svg` | Movido |
| `src/assets/home/wortise-w.png` | `src/assets/global/branding/wortise-symbol.png` | Movido |
| `src/assets/icons/ads-assisted.svg` | `src/assets/global/icons/ads-assisted.svg` | Movido |
| `src/assets/icons/ads-audience.svg` | `src/assets/global/icons/ads-audience.svg` | Movido |
| `src/assets/icons/ads-design.svg` | `src/assets/global/icons/ads-design.svg` | Movido |
| `src/assets/icons/ads-impact.svg` | `src/assets/global/icons/ads-impact.svg` | Movido |
| `src/assets/icons/ads-manual.svg` | `src/assets/global/icons/ads-manual.svg` | Movido |
| `src/assets/icons/ads-views.svg` | `src/assets/global/icons/ads-views.svg` | Movido |
| `src/assets/icons/facebook.svg` | `src/assets/global/icons/facebook.svg` | Movido |
| `src/assets/icons/linkedin.svg` | `src/assets/global/icons/linkedin.svg` | Movido |
| `src/assets/icons/whatsapp.svg` | `src/assets/global/icons/whatsapp.svg` | Movido |
| `src/assets/images/about-us-cover.png` | `src/assets/pages/about/team-cover.webp` | WebP sin pérdida |
| `src/assets/kpis/kpi-l.jpg` | `src/assets/global/statistics/statistics-desktop.jpg` | Movido |
| `src/assets/kpis/kpi-s.jpg` | `src/assets/global/statistics/statistics-mobile.jpg` | Movido |
| `src/assets/logo.png` | `src/assets/global/branding/wortise-logo.webp` | WebP sin pérdida |
| `src/assets/video/video-placeholder.svg` | `src/assets/global/video/video-placeholder.svg` | Movido |
| `src/assets/world/README.md` | `docs/world-globe.md` | Movido |
| `src/assets/world/blackmarble.jpg` | `src/assets/pages/home/earth-night-texture.jpg` | Movido |
| `src/assets/world/contact-close.svg` | `src/assets/pages/home/contact-close.svg` | Movido |
| `src/assets/world/globe-fallback.svg` | `src/assets/pages/home/globe-fallback.svg` | Movido |
| `src/assets/world/land-points.json` | `src/assets/pages/home/land-points.json` | Movido |

## Mapa de recursos públicos

| Ruta anterior | Ruta actual |
| --- | --- |
| `public/videos/wortise/wortise-en.mp4` | `public/pages/wortise-ads/presentation-en.mp4` |
| `public/videos/wortise/wortise-pt.mp4` | `public/pages/wortise-ads/presentation-pt.mp4` |
| `public/videos/wortise/wortise-es.mp4` | `public/pages/wortise-ads/presentation-es.mp4` |
| `public/videos/demo/portrait-9x16.mp4` | `public/development/videos/portrait-9x16.mp4` |
| `public/videos/demo/landscape-16x9.mp4` | `public/development/videos/landscape-16x9.mp4` |
| `public/phone-mockup/device-768.webp` | `public/global/phone-mockup/device-768.webp` |
| `public/phone-mockup/device-384.webp` | `public/global/phone-mockup/device-384.webp` |
| `public/phone-mockup/camera.webp` | `public/global/phone-mockup/camera.webp` |

El archivo original `public/phone-mockup/device.webp` se conserva en `.private/assets/unused/public/phone-mockup/`. Los recursos archivados no deben volver a publicarse sin comprobar su uso.
