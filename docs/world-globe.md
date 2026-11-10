# Globe geography

`../src/assets/pages/home/land-points.json` and `../src/assets/pages/home/globe-fallback.svg` are generated from Natural Earth's
1:110m land polygons, released into the public domain:
https://www.naturalearthdata.com/about/terms-of-use/

Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

To regenerate after downloading that file:

```sh
node scripts/generate-world-points.mjs /path/to/ne_110m_land.geojson
```

The generator distributes 60,000 candidates around a sphere and retains land
points (including polygon holes), using the sunflower distribution described
in https://stripe.com/blog/globe. This is an independent implementation using
current Three.js APIs; no Stripe production assets or live transaction data
are included. The routes are illustrative. All assets are served locally.

The published WebGL framing and appearance use the approved defaults in
`World3D/world-3d-config.ts`. The camera window and crop are defined in
`World3D/world-3d-view.json`, which also supplies the static fallback rotation.
Regenerate the fallback after changing its view.
Startup resolves the initial configuration before constructing the scene (including
validated saved preview values in development). The editor reads that scene state
without reapplying it. The first visible canvas frame waits for the chosen texture,
material settings and initial Buenos Aires framing; the points surface and static
fallback do not flash during normal loading. Labels wait for the first projection.
The static fallback is reserved for initialization/context failure and no-JavaScript
visitors. A failed texture request still enables the interactive points fallback. Narrow layouts crop the
sides of the same composition; animated routes and pulses do not rotate it.
Mouse drags rotate the globe around its center using Pointer Events and pointer
capture. Manual rotation also works while paused or with reduced motion. Touch
pointers do not start dragging or capture: native scrolling and pinch zoom remain
available over the canvas. City arrows still focus and rotate the globe on touch
devices, including hybrid devices where mouse dragging stays available.
Release velocity produces damped inertia; holding still before releasing,
cancelled pointers, pause, and reduced motion suppress coasting. City focus
uses a 1.1-second eased quaternion transition along the shortest rotation path.
Dragging interrupts transitions immediately. The editor stores the final view
after coasting or focusing finishes, rather than persisting every frame.
The editor independently locks the displayed X inclination, Y rotation and Z
rotation coordinates during mouse/touch drag and inertia. Locked Euler values
are preserved from the start of the gesture. All three locks disable pointer
capture and allow native touch scrolling. Flags persist in local settings and
JSON exports; earlier horizontal/vertical flags migrate to Y/X respectively.
City focus and explicit orientation controls remain available independently.
The geometry has no nonuniform scale. The camera uses equal world units per
pixel on both axes; the lower part of the sphere lies below the visible window.
The organism owns the fluid window height and spacing, with a stable card area above the globe on mobile.

`world-3d-locations.json` defines Buenos Aires, Madrid, and California (anchored
in San Francisco). `src/data/world.ts` maps these stable IDs to serializable
editorial records; the Spanish home passes them to WorldSolutions. Madrid and
California team and response details are illustrative and need confirmation.
The scene receives coordinates through World3D props and projects them into the
organism's DOM overlay. Markers and pills hide behind the globe or outside the
camera window. The marker overlay clips its own overflow so points and pills
crossing the window edge cannot temporarily widen the page during rotation
(including WebKit). Contact cards remain outside that clipping layer.
Only the selected marker pulses, respecting reduced motion and
the editor's marker color, size and pulse settings. Arcs remain off by default;
the optional arc renderer still connects Buenos Aires and Madrid.

WorldSolutions owns city selection, cards, pill positioning and circular
previous/next navigation. Buenos Aires opens initially. Controls appear below the TextBlock in all layouts, centered on mobile and
aligned to the text on desktop. Navigation
wraps without autoplay and focuses each destination through the existing eased
rotation. Buenos Aires is open on first load; subsequent cards stay hidden during
rotation and open only when their focus transition finishes. Interrupted transitions
do not reopen a card, and rapid navigation reveals only the latest selection.
Cards enter with a 280 ms fade and 12 px upward lift; exits reverse the movement
over 180 ms before hiding. Exiting cards are immediately inert, interrupted
animations resume from their current visual state, and reduced motion skips both. Reduced-motion and offscreen focus settle immediately. Dragging
closes the card; its close button and Escape restore focus to the selected pill.
Contact cards use the local close icon. Contact destinations are optional;
while absent, the CTA shows a localized coming-soon message without sending or
opening a fabricated destination. Timezone labels use IANA zones at build time,
including daylight-saving offsets for the generated date. Rebuild after seasonal
clock changes to refresh those static labels.

In development, a pencil button on the globe opens a local editor with camera,
surface, dots, markers, animation, city focus, and JSON import/export controls.
Validated settings persist under `wortise:world-3d:v1`, separately from the
hero editor. Mouse/touch rotation is captured on release. Reset restores the
published defaults. The panel is dynamically loaded only in development; local
settings do not change source files or the production scene. To adopt a preview,
share the exported JSON and apply its values to the defaults deliberately.

`blackmarble.jpg` is the user-supplied 8192×4096 nighttime world image (about
921 KB), copied unchanged from `marble.jpg`. Its source/license is independent of
Natural Earth's public-domain geometry. It is the default surface; the editor's
Map selector switches between `blackmarble` and `points` and exposes image
brightness. The selector persists and is included in JSON exports; older v1
configs retain their existing values and receive the new surface defaults.

The texture loads locally only when selected, is tagged sRGB and cached for
switching. Longitude and latitude are mapped explicitly from the same axes as
the city markers (Greenwich at horizontal center, north at the image top).
Markers remain interactive HTML over the projected surface; arcs use separate geometry. The texture is released on teardown;
load failure keeps the points visible and the development editor reports it.
The generated static fallback remains the points rendering.

Marble's development editor exposes brightness, exposure, contrast, saturation,
gamma, tint with optional light preservation, shadow/highlight duotone, city-light
intensity and threshold, glow, and atmosphere color, intensity, and width. These
image controls are hidden for the points surface. Atmosphere controls work in
both surface modes, with an additional soft outer glow whose strength and
extent can be adjusted independently. Effects run in the material shader;
the original JPEG remains unchanged. Glow samples eight neighboring texture
positions only while enabled; it is a texture-space light halo rather than a
full-screen bloom pass. Atmosphere uses a separate spherical shell.

Color presets are Original, Wortise rosa, Bordó nocturno, Magenta luminoso, and
Rosa y luces cálidas. Each resets the full color-effect configuration before
applying its look, preserving camera framing, drag locks, and other scene
settings. Original restores neutral image settings. Existing saved previews
receive neutral defaults for the new effects; presets are opt-in and persist
through the same local settings and JSON import/export flow.

Wortise personalizado additionally saves the supplied full scene configuration,
including zoom 1.33 and its exact orientation. Unlike color-only presets, this
button restores the saved framing too. Its atmosphere glow uses the new shared
defaults; the supplied city-light glow remains disabled.

The approved defaults live in `world-3d-config.ts`, including the supplied pink
palette and zoom 1.33. The public city UI starts focused on Buenos Aires.
Development previews stored in the browser remain available through the panel;
Reset applies the published defaults.

Point sprite diameter now follows the globe's projected world units in the
orthographic camera, including container dimensions, zoom, and device pixel
ratio (with a one-device-pixel minimum). The dotSize multiplier remains local
configuration. A soft sprite halo expands the footprint without changing the
core diameter. The points-only preset “Puntos · brillo de la W” uses the hero's
published pink, warm white edge and halo palette, with adjustable point
intensity and glow. It preserves camera framing and Marble's approved defaults.
