import { externalButtons } from './external-buttons';
import { readContent } from './content/validate';
import rawES from '../content/pages/home/es.json';

import coordinates from '../components/molecules/World3D/world-3d-locations.json';

const contentES = readContent(rawES, 'pages/home/es');

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
	'buenos-aires': { city: contentES.world.locations['buenos-aires'].city, country: contentES.world.locations['buenos-aires'].country, countryCode: contentES.world.locations['buenos-aires'].countryCode, team: contentES.world.locations['buenos-aires'].team, languages: contentES.world.locations['buenos-aires'].languages, timeZone: 'America/Argentina/Buenos_Aires', response: contentES.world.locations['buenos-aires'].response },
	madrid: { city: contentES.world.locations.madrid.city, country: contentES.world.locations.madrid.country, countryCode: contentES.world.locations.madrid.countryCode, team: contentES.world.locations.madrid.team, languages: contentES.world.locations.madrid.languages, timeZone: 'Europe/Madrid', response: contentES.world.locations.madrid.response },
	california: { city: contentES.world.locations.california.city, country: contentES.world.locations.california.country, countryCode: contentES.world.locations.california.countryCode, team: contentES.world.locations.california.team, languages: contentES.world.locations.california.languages, timeZone: 'America/Los_Angeles', response: contentES.world.locations.california.response },
};

export const worldLocations: WorldLocation[] = coordinates.map((location) => {
	const content = details[location.id as keyof typeof details];
	if (!content) throw new Error(`Missing world location content: ${location.id}`);
	return { ...location, ...content, contactHref: externalButtons.es.worldContacts[location.id as keyof typeof externalButtons.es.worldContacts].url || undefined };
});
