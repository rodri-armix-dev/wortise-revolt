import type { ComponentProps } from 'astro/types';
import Footer from '../components/organisms/Footer/Footer.astro';
import brand from '../assets/footer/brand.png';
import instagram from '../assets/footer/instagram.svg';
import linkedin from '../assets/footer/linkedin.svg';
import facebook from '../assets/footer/facebook.svg';
import { langMenuData } from './navigation';
import type { Locale } from '../i18n/config';
import { uiText } from '../i18n/ui';

export const footerData = {
	es: {
		brand: {
			image: brand,
			tagline: { primary: 'Born in LATAM,', secondary: 'made for the world' },
			contact: { label: 'Contactar al equipo', href: '', variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: 'Soluciones', items: ['Para anunciantes', 'Para desarrolladores', 'Wortise Ads'].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: 'Explorar', items: ['Nosotros', 'Blog', 'Glosario', 'Documentación del SDK'].map((label, index) => ({ label, href: '', page: index === 0 ? 'about' as const : undefined })) },
			{ title: 'Plataforma', variant: 'actions', items: [
				{ label: 'Ingresar', href: '#ingresar', button: { variant: 'primary-special', size: 'large' } },
				{ label: 'Solicitar una demo', href: '', button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: 'Idioma', unavailableLabel: uiText.es.unavailableLanguage, currentCode: 'es', items: langMenuData },
		social: { title: 'Seguinos', items: [
			{ label: 'Instagram', href: '', icon: instagram },
			{ label: 'LinkedIn', href: '', icon: linkedin },
			{ label: 'Facebook', href: '', icon: facebook },
		] },
		legal: { label: uiText.es.legalNavigation, items: ['Términos del SDK', 'Términos y condiciones', 'Privacidad', 'Ayuda'].map((label) => ({ label, href: '' })) },
		copyright: { text: '© 2026 Wortise.inc' },
	},
	en: {
		brand: {
			image: brand,
			tagline: { primary: 'Born in LATAM,', secondary: 'made for the world' },
			contact: { label: 'Contact our team', href: '', variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: 'Solutions', items: ['For advertisers', 'For developers', 'Wortise Ads'].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: 'Explore', items: ['About us', 'Blog', 'Glossary', 'SDK documentation'].map((label, index) => ({ label, href: '', page: index === 0 ? 'about' as const : undefined })) },
			{ title: 'Platform', variant: 'actions', items: [
				{ label: 'Log in', href: '#ingresar', button: { variant: 'primary-special', size: 'large' } },
				{ label: 'Request a demo', href: '', button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: 'Language', unavailableLabel: uiText.en.unavailableLanguage, currentCode: 'en', items: langMenuData },
		social: { title: 'Follow us', items: [
			{ label: 'Instagram', href: '', icon: instagram },
			{ label: 'LinkedIn', href: '', icon: linkedin },
			{ label: 'Facebook', href: '', icon: facebook },
		] },
		legal: { label: uiText.en.legalNavigation, items: ['SDK terms', 'Terms and conditions', 'Privacy', 'Help'].map((label) => ({ label, href: '' })) },
		copyright: { text: '© 2026 Wortise.inc' },
	},
	pt: {
		brand: {
			image: brand,
			tagline: { primary: 'Born in LATAM,', secondary: 'made for the world' },
			contact: { label: 'Fale com nossa equipe', href: '', variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: 'Soluções', items: ['Para anunciantes', 'Para desenvolvedores', 'Wortise Ads'].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: 'Explorar', items: ['Sobre nós', 'Blog', 'Glossário', 'Documentação do SDK'].map((label, index) => ({ label, href: '', page: index === 0 ? 'about' as const : undefined })) },
			{ title: 'Plataforma', variant: 'actions', items: [
				{ label: 'Entrar', href: '#ingresar', button: { variant: 'primary-special', size: 'large' } },
				{ label: 'Solicitar uma demonstração', href: '', button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: 'Idioma', unavailableLabel: uiText.pt.unavailableLanguage, currentCode: 'pt', items: langMenuData },
		social: { title: 'Siga-nos', items: [
			{ label: 'Instagram', href: '', icon: instagram },
			{ label: 'LinkedIn', href: '', icon: linkedin },
			{ label: 'Facebook', href: '', icon: facebook },
		] },
		legal: { label: uiText.pt.legalNavigation, items: ['Termos do SDK', 'Termos e condições', 'Privacidade', 'Ajuda'].map((label) => ({ label, href: '' })) },
		copyright: { text: '© 2026 Wortise.inc' },
	},
} satisfies Record<Locale, Omit<ComponentProps<typeof Footer>, 'locale'>>;
