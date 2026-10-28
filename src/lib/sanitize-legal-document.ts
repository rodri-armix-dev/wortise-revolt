import sanitizeHtml from 'sanitize-html';
import { richTextPolicy } from './sanitize-rich-text';

// A document has its own heading hierarchy; Description keeps its existing policy.
export function sanitizeLegalDocument(html: string): string {
	return sanitizeHtml(html, {
		...richTextPolicy,
		allowedTags: [...richTextPolicy.allowedTags as string[], 'h2', 'h3', 'h4', 'hr'],
	});
}
