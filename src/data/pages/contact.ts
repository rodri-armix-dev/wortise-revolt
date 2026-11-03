import type { Locale } from '../../i18n/config';
import type { ModulesPageData } from './page.types';

export const contactPageData = {
	es: {
		key: 'contact',
		slug: 'contacto',
		meta: { title: 'Contacto | Wortise', description: 'Contanos qué querés hacer crecer. Contactá al equipo de Wortise.' },
		modules: [{
			type: 'contact-section',
			props: {
				intro: {
					eyebrow: { label: 'Contacta al equipo' },
					heading: { html: 'Abramos una nueva<br>oportunidad.', tag: 'h1' },
					description: { html: '<p>Contanos qué querés hacer crecer. La tecnología conecta el resto.</p>' },
				},
				reasonLabel: '¿Qué te trae por acá?',
				reasons: [{ id: 'advertise', label: 'Quiero anunciar' }, { id: 'monetize', label: 'Quiero monetizar' }, { id: 'other', label: 'Otro' }],
				fields: [
					{ name: 'name', label: 'Nombre', placeholder: 'Tu nombre', required: true },
					{ name: 'email', label: 'Email', placeholder: 'nombre@empresa.com', required: true },
					{ name: 'phone', label: 'Teléfono', placeholder: '+54 11 0000 0000' },
					{ name: 'message', label: 'Mensaje', placeholder: 'Contanos sobre tu proyecto, campaña o producto...', required: true },
				],
				submitLabel: 'Enviar mensaje',
				success: {
					eyebrow: { label: 'Éxito' },
					heading: { html: 'Tu mensaje fue enviado correctamente.', tag: 'h2' },
					description: { html: '<p>Lo revisamos y te responderemos a la brevedad. Mientras tanto, podés escribirnos por nuestros canales directos o enviar otra consulta.</p>' },
				},
				homeLabel: 'Volver al inicio',
				resetLabel: 'Enviar otro mensaje',
				directLabel: 'O escribinos directamente',
				email: 'hello@wortise.com',
				telegramLabel: 'Canal de Telegram',
			},
		}],
	},
} satisfies Partial<Record<Locale, ModulesPageData<'contact'>>>;
