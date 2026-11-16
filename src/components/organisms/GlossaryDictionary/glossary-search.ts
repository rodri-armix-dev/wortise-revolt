const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function normalizeGlossaryText(text: string): string {
	return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
}

function highlightMatches(field: HTMLElement, query: string): boolean {
	const text = field.textContent ?? '';
	const searchableText = normalizeGlossaryText(text);
	let matchStart = query ? searchableText.indexOf(query) : -1;
	if (matchStart === -1) {
		if (field.childElementCount) field.textContent = text;
		return false;
	}

	// Map the normalized match back to the original text, including accents.
	const offsets = [];
	for (const { segment, index } of graphemes.segment(text)) {
		const end = index + segment.length;
		for (let unit = 0; unit < normalizeGlossaryText(segment).length; unit++) {
			offsets.push({ start: index, end });
		}
	}

	const highlighted = document.createDocumentFragment();
	let cursor = 0;
	while (matchStart !== -1) {
		const start = offsets[matchStart].start;
		const end = offsets[matchStart + query.length - 1].end;
		if (start >= cursor) {
			const mark = document.createElement('mark');
			mark.textContent = text.slice(start, end);
			highlighted.append(text.slice(cursor, start), mark);
			cursor = end;
		}
		matchStart = searchableText.indexOf(query, matchStart + query.length);
	}
	highlighted.append(text.slice(cursor));
	field.replaceChildren(highlighted);
	return true;
}

export function filterGlossaryGroup(group: HTMLElement, query: string): number {
	let count = 0;
	for (const term of group.querySelectorAll<HTMLElement>('[data-glossary-term]')) {
		const matches = Array.from(term.querySelectorAll<HTMLElement>('dt, dd'), (field) => highlightMatches(field, query));
		term.hidden = Boolean(query) && !matches.includes(true);
		if (!term.hidden) count++;
	}
	return count;
}
