import sanitizeHtml from 'sanitize-html';

// Provider-neutral inline content. CMS adapters can reuse this policy.
export function sanitizeHeading(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: ['span', 'br'],
		allowedAttributes: {
			span: [{ name: 'data-tone', values: ['muted'] }],
		},
		transformTags: {
			span: (tagName, attributes): sanitizeHtml.Tag => ({
				tagName,
				attribs: attributes['data-tone'] === 'muted' ? { 'data-tone': 'muted' } : {},
			}),
		},
	});
}
