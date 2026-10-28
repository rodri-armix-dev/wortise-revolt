import type * as Three from 'three';

// Straight edges fitted to the alpha silhouette of the 114 × 87 logo.
// Rounded raster corners are excluded from the fit; the bevel supplies that rounding.
const contours = [
	[[1.18, 3.5], [27.13, 3.5], [51.75, 55.32], [39.56, 81.72]],
	[[35.18, 3.5], [60.97, 3.5], [73.5, 30.05], [86.03, 3.5], [111.95, 3.5], [73.14, 81.37]],
];

export function createWortiseMarkGeometry(THREE: typeof Three) {
	const depth = 0.6;

	return contours.map((contour, index) => {
		const outline = contour.map(([x, y]) => new THREE.Vector2((x - 56.57) / 33, (42.61 - y) / 33));
		const shape = new THREE.Shape(outline);
		shape.closePath();
		const geometry = new THREE.ExtrudeGeometry(shape, {
			depth,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.02,
			bevelOffset: -0.02,
			bevelSegments: 5,
			steps: 1,
			curveSegments: 1,
		});
		// Both closed solids share front and back planes. The V is one concave extrusion.
		geometry.translate(0, 0, -depth / 2);

		// The central diagonal continues across the V: its inner edge meets the
		// outer right edge. This is a surface division, not another disconnected solid.
		let returnDivider: [Three.Vector2, Three.Vector2] | undefined;
		if (index === 1) {
			const start = outline[2].clone();
			const direction = start.clone().sub(outline[1]);
			const outer = outline[5].clone().sub(outline[4]);
			const along = outline[4].clone().sub(start).cross(outer) / direction.cross(outer);
			returnDivider = [start, start.clone().addScaledVector(direction, along)];
		}

		return { geometry, outline, returnDivider };
	});
}
