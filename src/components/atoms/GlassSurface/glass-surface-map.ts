import { Buffer } from 'node:buffer';
import { crc32, deflateSync } from 'node:zlib';

const width = 96;
const height = 48;

function pngChunk(name: string, data: Buffer): Buffer {
	const payload = Buffer.concat([Buffer.from(name), data]);
	const chunk = Buffer.alloc(payload.length + 8);
	chunk.writeUInt32BE(data.length);
	payload.copy(chunk, 4);
	chunk.writeUInt32BE(crc32(payload), chunk.length - 4);
	return chunk;
}

export function createCapsuleMap(depth: number): string {
	const radius = height / 2;
	const halfStraight = (width - height) / 2;
	const rimWidth = Math.min(radius, 4 + depth);
	const stride = width * 3 + 1;
	const pixels = Buffer.alloc(stride * height);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const dx = x + .5 - width / 2;
			const dy = y + .5 - height / 2;
			const normalX = dx - Math.max(-halfStraight, Math.min(halfStraight, dx));
			const distance = Math.hypot(normalX, dy);
			const rim = (radius - distance) / rimWidth;
			// Pull from inside the lens at its rim. Leave the center and exterior neutral.
			const bend = rim > 0 && rim < 1 && distance ? -.46 * Math.sin(Math.PI * rim) / distance : 0;
			const offset = y * stride + x * 3 + 1;
			pixels[offset] = Math.round(255 * (.5 + normalX * bend));
			pixels[offset + 1] = Math.round(255 * (.5 + dy * bend));
			pixels[offset + 2] = 128;
		}
	}

	const header = Buffer.alloc(13);
	header.writeUInt32BE(width);
	header.writeUInt32BE(height, 4);
	header[8] = 8;
	header[9] = 2; // RGB
	const png = Buffer.concat([
		Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
		pngChunk('IHDR', header),
		pngChunk('IDAT', deflateSync(pixels)),
		pngChunk('IEND', Buffer.alloc(0)),
	]);

	return `data:image/png;base64,${png.toString('base64')}`;
}
