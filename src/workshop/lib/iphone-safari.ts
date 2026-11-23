export function isIPhoneSafari(userAgent: string): boolean {
	return /iPhone/.test(userAgent) && /Version\/[\d.]+.*Safari\//.test(userAgent);
}
