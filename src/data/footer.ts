import { externalButtons } from './external-buttons';
import { readContent } from './content/validate';
import rawES from '../content/global/footer/es.json';
import rawEN from '../content/global/footer/en.json';
import rawPT from '../content/global/footer/pt.json';

import type { ComponentProps } from 'astro/types';
import Footer from '../components/organisms/Footer/Footer.astro';
import brand from '../assets/global/branding/wortise-symbol.png';
import instagram from '../assets/global/footer/instagram.svg';
import linkedin from '../assets/global/footer/linkedin.svg';
import facebook from '../assets/global/footer/facebook.svg';
import { langMenuData } from './navigation';
import type { Locale } from '../i18n/config';
import { uiText } from '../i18n/ui';

const contentES = readContent(rawES, 'global/footer/es');
const contentEN = readContent(rawEN, 'global/footer/en');
const contentPT = readContent(rawPT, 'global/footer/pt');

export const footerData = {
	es: {
		brand: {
			image: brand,
			tagline: { primary: contentES.brand.tagline.primary, secondary: contentES.brand.tagline.secondary },
			contact: { label: contentES.brand.contact.label, href: externalButtons.es.contactUrl, variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: contentES.menus.solutions.title, items: [contentES.menus.solutions.items.advertisers, contentES.menus.solutions.items.developers, contentES.menus.solutions.items['wortise-ads']].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: contentES.menus.explore.title, items: [
				{ label: contentES.menus.explore.items.about, page: 'about', href: '' },
				{ label: contentES.menus.explore.items.blog, href: '' },
				{ label: contentES.menus.explore.items.glossary, page: 'glossary', href: '' },
				{ label: contentES.menus.explore.items['sdk-documentation'], href: externalButtons.es.sdkDocumentationUrl },
			] },
			{ title: contentES.menus.platform.title, variant: 'actions', items: [
				{ label: contentES.menus.platform.items.login.label, href: externalButtons.es.loginUrl, button: { variant: 'primary-special', size: 'large' } },
				{ label: contentES.menus.platform.items.demo.label, href: externalButtons.es.demoUrl, button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: contentES.languages.title, unavailableLabel: uiText.es.unavailableLanguage, currentCode: 'es', items: langMenuData },
		social: { title: contentES.social.title, items: [
			{ label: contentES.social.items.instagram.label, href: externalButtons.es.instagramUrl, icon: instagram },
			{ label: contentES.social.items.linkedin.label, href: externalButtons.es.linkedinUrl, icon: linkedin },
			{ label: contentES.social.items.facebook.label, href: externalButtons.es.facebookUrl, icon: facebook },
		] },
		legal: { label: uiText.es.legalNavigation, items: [contentES.legal.items['sdk-terms'], contentES.legal.items.terms, contentES.legal.items.privacy, contentES.legal.items.help].map((label, index) => ({ label, href: index === 3 ? externalButtons.es.helpUrl : '' })) },
		copyright: { text: contentES.copyright.text },
	},
	en: {
		brand: {
			image: brand,
			tagline: { primary: contentEN.brand.tagline.primary, secondary: contentEN.brand.tagline.secondary },
			contact: { label: contentEN.brand.contact.label, href: externalButtons.en.contactUrl, variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: contentEN.menus.solutions.title, items: [contentEN.menus.solutions.items.advertisers, contentEN.menus.solutions.items.developers, contentEN.menus.solutions.items['wortise-ads']].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: contentEN.menus.explore.title, items: [
				{ label: contentEN.menus.explore.items.about, page: 'about', href: '' },
				{ label: contentEN.menus.explore.items.blog, href: '' },
				{ label: contentEN.menus.explore.items.glossary, page: 'glossary', href: '' },
				{ label: contentEN.menus.explore.items['sdk-documentation'], href: externalButtons.en.sdkDocumentationUrl },
			] },
			{ title: contentEN.menus.platform.title, variant: 'actions', items: [
				{ label: contentEN.menus.platform.items.login.label, href: externalButtons.en.loginUrl, button: { variant: 'primary-special', size: 'large' } },
				{ label: contentEN.menus.platform.items.demo.label, href: externalButtons.en.demoUrl, button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: contentEN.languages.title, unavailableLabel: uiText.en.unavailableLanguage, currentCode: 'en', items: langMenuData },
		social: { title: contentEN.social.title, items: [
			{ label: contentEN.social.items.instagram.label, href: externalButtons.en.instagramUrl, icon: instagram },
			{ label: contentEN.social.items.linkedin.label, href: externalButtons.en.linkedinUrl, icon: linkedin },
			{ label: contentEN.social.items.facebook.label, href: externalButtons.en.facebookUrl, icon: facebook },
		] },
		legal: { label: uiText.en.legalNavigation, items: [contentEN.legal.items['sdk-terms'], contentEN.legal.items.terms, contentEN.legal.items.privacy, contentEN.legal.items.help].map((label, index) => ({ label, href: index === 3 ? externalButtons.en.helpUrl : '' })) },
		copyright: { text: contentEN.copyright.text },
	},
	pt: {
		brand: {
			image: brand,
			tagline: { primary: contentPT.brand.tagline.primary, secondary: contentPT.brand.tagline.secondary },
			contact: { label: contentPT.brand.contact.label, href: externalButtons.pt.contactUrl, variant: 'tertiary', icon: 'arrow-up-right' },
		},
		menus: [
			{ title: contentPT.menus.solutions.title, items: [contentPT.menus.solutions.items.advertisers, contentPT.menus.solutions.items.developers, contentPT.menus.solutions.items['wortise-ads']].map((label, index) => ({ label, href: '', page: index === 2 ? 'wortise-ads' as const : undefined })) },
			{ title: contentPT.menus.explore.title, items: [
				{ label: contentPT.menus.explore.items.about, page: 'about', href: '' },
				{ label: contentPT.menus.explore.items.blog, href: '' },
				{ label: contentPT.menus.explore.items.glossary, page: 'glossary', href: '' },
				{ label: contentPT.menus.explore.items['sdk-documentation'], href: externalButtons.pt.sdkDocumentationUrl },
			] },
			{ title: contentPT.menus.platform.title, variant: 'actions', items: [
				{ label: contentPT.menus.platform.items.login.label, href: externalButtons.pt.loginUrl, button: { variant: 'primary-special', size: 'large' } },
				{ label: contentPT.menus.platform.items.demo.label, href: externalButtons.pt.demoUrl, button: { variant: 'tertiary', icon: 'arrow-up-right' } },
			] },
		],
		languages: { title: contentPT.languages.title, unavailableLabel: uiText.pt.unavailableLanguage, currentCode: 'pt', items: langMenuData },
		social: { title: contentPT.social.title, items: [
			{ label: contentPT.social.items.instagram.label, href: externalButtons.pt.instagramUrl, icon: instagram },
			{ label: contentPT.social.items.linkedin.label, href: externalButtons.pt.linkedinUrl, icon: linkedin },
			{ label: contentPT.social.items.facebook.label, href: externalButtons.pt.facebookUrl, icon: facebook },
		] },
		legal: { label: uiText.pt.legalNavigation, items: [contentPT.legal.items['sdk-terms'], contentPT.legal.items.terms, contentPT.legal.items.privacy, contentPT.legal.items.help].map((label, index) => ({ label, href: index === 3 ? externalButtons.pt.helpUrl : '' })) },
		copyright: { text: contentPT.copyright.text },
	},
} satisfies Record<Locale, Omit<ComponentProps<typeof Footer>, 'locale'>>;
