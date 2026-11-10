import contracts from './contracts.json';

type Contract = 'string' | { [key: string]: Contract };

export function validateContent(value: unknown, contract: Contract, path = 'content'): void {
	if (contract === 'string') {
		if (typeof value !== 'string') throw new Error(`${path}: se esperaba texto.`);
		const key = path.split('.').at(-1);
		const isUrl = /url$/i.test(key ?? '') || ['href', 'contactHref'].includes(key ?? '');
		if (!value.trim() && !isUrl && !['alt', 'imageAlt', 'slug'].includes(key ?? '')) throw new Error(`${path}: el texto es obligatorio.`);
		if (isUrl && value && !/^(https?:\/\/|mailto:|tel:|#)/.test(value)) {
			throw new Error(`${path}: destino inválido; usar https, mailto, tel o un ancla.`);
		}
		if (key === 'slug' && value && !/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(value)) throw new Error(`${path}: slug inválido.`);
		if (isUrl && value && !value.startsWith('#')) {
			try { new URL(value); } catch { throw new Error(`${path}: URL inválida.`); }
		}
		return;
	}
	if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${path}: se esperaba un objeto.`);
	const record = value as Record<string, unknown>;
	for (const key of Object.keys(record)) {
		if (!Object.hasOwn(contract, key)) throw new Error(`${path}.${key}: campo desconocido.`);
	}
	for (const [key, child] of Object.entries(contract)) validateContent(record[key], child, `${path}.${key}`);
}

export function readContent<T>(value: T, id: keyof typeof contracts): T {
	if (!Object.hasOwn(contracts, id)) throw new Error(`Contrato desconocido: ${id}`);
	validateContent(value, contracts[id] as Contract, id);
	return value;
}
