import { defaultLocale, isLocale, type Locale } from './config';

export const uiText = {
	es: {
		requiredField: 'Este campo es obligatorio.',
		invalidEmail: 'Ingresá un email válido.',
		optionalField: 'opcional',
		contactJavascript: 'Activá JavaScript para probar el formulario o escribinos por email.',
		worldNavigation: 'Ciudades y equipos',
		previousCity: 'Ciudad anterior',
		nextCity: 'Ciudad siguiente',
		closeCity: 'Cerrar información de la ciudad',
		openCity: 'Ver equipo de {label}',
		contactTeam: 'Contactar al equipo',
		contactUnavailable: 'Contacto próximamente',

		mainNavigation: 'Navegación principal',
		mobileNavigation: 'Navegación mobile',
		openMenu: 'Abrir menú de navegación',
		closeMenu: 'Cerrar menú de navegación',
		selectLanguage: 'Seleccionar idioma',
		openLanguage: 'Abrir selector de idioma. Idioma actual: {label}',
		closeLanguage: 'Cerrar selector de idioma. Idioma actual: {label}',
		openSubmenu: 'Abrir submenú de {label}',
		closeSubmenu: 'Cerrar submenú de {label}',
		unavailableLanguage: '{label}, no disponible',
		login: 'Ingresar',
		legalNavigation: 'Navegación legal',
		legalUpdatedAt: 'Última actualización',
		legalEffectiveAt: 'Fecha de vigencia',
	},
	en: {
		requiredField: 'This field is required.',
		invalidEmail: 'Enter a valid email address.',
		optionalField: 'optional',
		contactJavascript: 'Enable JavaScript to try the form or contact us by email.',
		worldNavigation: 'Cities and teams',
		previousCity: 'Previous city',
		nextCity: 'Next city',
		closeCity: 'Close city information',
		openCity: 'View the team in {label}',
		contactTeam: 'Contact our team',
		contactUnavailable: 'Contact coming soon',

		mainNavigation: 'Main navigation',
		mobileNavigation: 'Mobile navigation',
		openMenu: 'Open navigation menu',
		closeMenu: 'Close navigation menu',
		selectLanguage: 'Select language',
		openLanguage: 'Open language selector. Current language: {label}',
		closeLanguage: 'Close language selector. Current language: {label}',
		openSubmenu: 'Open submenu for {label}',
		closeSubmenu: 'Close submenu for {label}',
		unavailableLanguage: '{label}, unavailable',
		login: 'Log in',
		legalNavigation: 'Legal navigation',
		legalUpdatedAt: 'Last updated',
		legalEffectiveAt: 'Effective date',
	},
	pt: {
		requiredField: 'Este campo é obrigatório.',
		invalidEmail: 'Digite um email válido.',
		optionalField: 'opcional',
		contactJavascript: 'Ative o JavaScript para testar o formulário ou escreva por email.',
		worldNavigation: 'Cidades e equipes',
		previousCity: 'Cidade anterior',
		nextCity: 'Próxima cidade',
		closeCity: 'Fechar informações da cidade',
		openCity: 'Ver equipe de {label}',
		contactTeam: 'Fale com nossa equipe',
		contactUnavailable: 'Contato em breve',

		mainNavigation: 'Navegação principal',
		mobileNavigation: 'Navegação móvel',
		openMenu: 'Abrir menu de navegação',
		closeMenu: 'Fechar menu de navegação',
		selectLanguage: 'Selecionar idioma',
		openLanguage: 'Abrir seletor de idioma. Idioma atual: {label}',
		closeLanguage: 'Fechar seletor de idioma. Idioma atual: {label}',
		openSubmenu: 'Abrir submenu de {label}',
		closeSubmenu: 'Fechar submenu de {label}',
		unavailableLanguage: '{label}, indisponível',
		login: 'Entrar',
		legalNavigation: 'Navegação legal',
		legalUpdatedAt: 'Última atualização',
		legalEffectiveAt: 'Data de vigência',
	},
} satisfies Record<Locale, Record<string, string>>;

type UiKey = keyof typeof uiText.es;
const checkedUiText: Record<Locale, Record<UiKey, string>> = uiText;

export function getUiText(locale: string | undefined) {
	return checkedUiText[isLocale(locale) ? locale : defaultLocale];
}

export function formatLabel(template: string, label: string): string {
	return template.replace('{label}', label);
}
