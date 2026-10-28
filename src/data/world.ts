import coordinates from '../components/molecules/World3D/world-3d-locations.json';

export interface WorldLocation {
	id: string;
	latitude: number;
	longitude: number;
	city: string;
	country: string;
	countryCode: string;
	team: string;
	languages: string;
	timeZone: string;
	response: string;
	contactHref?: string;
}

// Editorial sample content. Madrid and California details require confirmation.
// California uses San Francisco as its geographic anchor. No contact destinations exist yet.
const details = {
	'buenos-aires': { city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', team: 'Equipo comercial · LATAM', languages: 'Español', timeZone: 'America/Argentina/Buenos_Aires', response: 'Respuesta habitual: 1 día hábil' },
	madrid: { city: 'Madrid', country: 'España', countryCode: 'ES', team: 'Equipo comercial · Europa', languages: 'Español · Inglés', timeZone: 'Europe/Madrid', response: 'Respuesta habitual: 1 día hábil' },
	california: { city: 'California', country: 'Estados Unidos', countryCode: 'US', team: 'Alianzas estratégicas · Norteamérica', languages: 'Inglés · Español', timeZone: 'America/Los_Angeles', response: 'Respuesta habitual: 2 días hábiles' },
};

export const worldLocations: WorldLocation[] = coordinates.map((location) => {
	const content = details[location.id as keyof typeof details];
	if (!content) throw new Error(`Missing world location content: ${location.id}`);
	return { ...location, ...content };
});
