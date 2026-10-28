import sanitizeHtml from 'sanitize-html';

export const richTextPolicy: sanitizeHtml.IOptions = {
	allowedTags: [
		'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
		'a', 'ul', 'ol', 'li', 'blockquote', 'span', 'sup', 'sub', 'code',
	],
	allowedAttributes: {
		a: ['href', 'title', { name: 'target', values: ['_blank', '_self'] }, 'rel'],
		ol: ['start'],
	},
	allowedSchemes: ['http', 'https', 'mailto', 'tel'],
	allowProtocolRelative: false,
	transformTags: {
		a: (tagName, attribs) => ({
			tagName,
			attribs: {
				...attribs,
				...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}),
			},
		}),
	},
};

export function sanitizeRichText(html: string): string {
	return sanitizeHtml(html, richTextPolicy);
}
