import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Euler, Vector3 } from 'three';
import view from '../src/components/molecules/World3D/world-3d-view.json' with { type: 'json' };
import locations from '../src/components/molecules/World3D/world-3d-locations.json' with { type: 'json' };

// Input: Natural Earth ne_110m_land.geojson (public domain).
// Usage: node scripts/generate-world-points.mjs /path/to/ne_110m_land.geojson
const source = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const polygons = source.features.flatMap(({ geometry }) =>
	geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates],
).map((rings) => ({
	rings,
	west: Math.min(...rings[0].map(([x]) => x)),
	east: Math.max(...rings[0].map(([x]) => x)),
	south: Math.min(...rings[0].map(([, y]) => y)),
	north: Math.max(...rings[0].map(([, y]) => y)),
}));

function insideRing(x, y, ring) {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const [xi, yi] = ring[i];
		const [xj, yj] = ring[j];
		if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
	}
	return inside;
}

const points = [];
const count = 60000;
for (let i = 0; i < count; i++) {
	// Sunflower distribution from Stripe's globe article.
	const phi = Math.acos(-1 + 2 * i / count);
	const theta = Math.sqrt(count * Math.PI) * phi;
	const latitude = 90 - phi * 180 / Math.PI;
	const longitude = ((theta * 180 / Math.PI + 180) % 360) - 180;
	if (!polygons.some(({ rings, west, east, south, north }) =>
		longitude >= west && longitude <= east && latitude >= south && latitude <= north &&
		insideRing(longitude, latitude, rings[0]) && !rings.slice(1).some((ring) => insideRing(longitude, latitude, ring)),
	)) continue;
	const lat = latitude * Math.PI / 180;
	const lon = longitude * Math.PI / 180;
	points.push([
		Math.cos(lat) * Math.sin(lon),
		Math.sin(lat),
		Math.cos(lat) * Math.cos(lon),
	].map((value) => Math.round(value * 100000) / 100000));
}

mkdirSync(new URL('../src/assets/pages/home/', import.meta.url), { recursive: true });
writeFileSync(new URL('../src/assets/pages/home/land-points.json', import.meta.url), JSON.stringify(points));

// The same geography supplies a lightweight static fallback, without WebGL.
const width = 1440;
const height = Math.round(width / view.aspect);
const pixelsPerUnit = width / view.width;
const rotation = new Euler(...view.rotation);
const paths = ['', '', '', ''];
points.forEach(([x, y, z]) => {
	const point = new Vector3(x, y, z).applyEuler(rotation);
	if (point.z < 0) return;
	const facing = point.z;
	paths[Math.min(3, Math.floor(facing * 4))] += `M${(width / 2 + point.x * pixelsPerUnit).toFixed(1)} ${((view.top - point.y) * pixelsPerUnit).toFixed(1)}h.01`;
});
const dots = paths.map((path, index) => `<path d="${path}" opacity="${0.3 + index * 0.2}"/>`).join('');
const markers = locations.flatMap(({ latitude, longitude }) => {
	const lat = latitude * Math.PI / 180;
	const lon = longitude * Math.PI / 180;
	const point = new Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)).multiplyScalar(1.006).applyEuler(rotation);
	if (point.z <= 0) return [];
	const x = width / 2 + point.x * pixelsPerUnit;
	const y = (view.top - point.y) * pixelsPerUnit;
	return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.006 * pixelsPerUnit).toFixed(1)}" fill="#9addff"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.016 * pixelsPerUnit).toFixed(1)}" fill="none" stroke="#80e9ff" opacity="0.6"/>`;
}).join('');
writeFileSync(new URL('../src/assets/pages/home/globe-fallback.svg', import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><radialGradient id="o"><stop stop-color="#263a70"/><stop offset="1" stop-color="#102147"/></radialGradient></defs><circle cx="${width / 2}" cy="${view.top * pixelsPerUnit}" r="${pixelsPerUnit}" fill="url(#o)"/><g fill="none" stroke="#a7b9f5" stroke-width="2.4" stroke-linecap="round">${dots}</g>${markers}</svg>`);
console.log(`Generated ${points.length} land points and static fallback.`);
