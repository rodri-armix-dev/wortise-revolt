import { Marked } from 'marked';
import { sanitizeHeading } from '../../lib/sanitize-heading';
import { sanitizeRichText } from '../../lib/sanitize-rich-text';

const escapeHtml = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const markdown = new Marked({
	gfm: true,
	breaks: true,
	renderer: {
		br() { return '<br>'; },
		paragraph({ tokens }) { return `<p>${this.parser.parseInline(tokens)}</p>`; },
	},
});

// Asterisks preserve the existing muted emphasis; content never owns HTML styles.
export function headingHtml(text: string): string {
	return sanitizeHeading(escapeHtml(text).replace(/\*([^*]+)\*/g, '<span data-tone="muted">$1</span>').replaceAll('\n', '<br>'));
}

export function descriptionHtml(text: string): string {
	return sanitizeRichText(markdown.parse(escapeHtml(text), { async: false }).trim());
}
