import { externalButtons } from '../external-buttons';
import { headingHtml, descriptionHtml } from '../content/format';
import { readContent } from '../content/validate';
import rawES from '../../content/pages/contact/es.json';

import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';

const contentES = readContent(rawES, 'pages/contact/es');

export const contactPageData = {
	es: {
		key: 'contact',
		slug: contentES.slug,
		meta: { title: contentES.meta.title, description: contentES.meta.description },
		modules: [{
			type: 'contact-section',
			props: {
				intro: {
					eyebrow: { label: contentES.hero.eyebrow },
					heading: { html: headingHtml(contentES.hero.title), tag: 'h1' },
					description: { html: descriptionHtml(contentES.hero.description) },
				},
				reasonLabel: contentES.form.reasonLabel,
				reasons: [{ id: 'advertise', label: contentES.form.reasons.advertise.label }, { id: 'monetize', label: contentES.form.reasons.monetize.label }, { id: 'other', label: contentES.form.reasons.other.label }],
				fields: [
					{ name: 'name', label: contentES.form.fields.name.label, placeholder: contentES.form.fields.name.placeholder, required: true },
					{ name: 'email', label: contentES.form.fields.email.label, placeholder: contentES.form.fields.email.placeholder, required: true },
					{ name: 'phone', label: contentES.form.fields.phone.label, placeholder: contentES.form.fields.phone.placeholder },
					{ name: 'message', label: contentES.form.fields.message.label, placeholder: contentES.form.fields.message.placeholder, required: true },
				],
				submitLabel: contentES.form.submitLabel,
				success: {
					eyebrow: { label: contentES.success.eyebrow },
					heading: { html: headingHtml(contentES.success.title), tag: 'h2' },
					description: { html: descriptionHtml(contentES.success.description) },
				},
				homeLabel: contentES.form.homeLabel,
				resetLabel: contentES.form.resetLabel,
				directLabel: contentES.form.directLabel,
				email: contentES.form.email,
				emailHref: externalButtons.es.emailUrl,
				telegramHref: externalButtons.es.telegramUrl,
				telegramLabel: contentES.form.telegramLabel,
			},
		}],
	},
} satisfies Partial<Record<Locale, ModulesPageData<'contact'>>>;
