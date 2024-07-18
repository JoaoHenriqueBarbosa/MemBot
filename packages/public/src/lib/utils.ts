import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function ucFirst(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
}

export function formatCurrency(amount: number, lang: string): string {
    const locale = lang === 'ptBR' ? 'pt-BR' : 'en-US';
    const currency = lang === 'ptBR' ? 'BRL' : 'USD';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency
    }).format(amount)
}

export function adaptativeHumanByteReader(bytes: number): string {
    if (isNaN(bytes) || bytes < 0) {
        return "0 B";
    }

    let result: number;
    let suffix: string;

    if (bytes < 1024) {
        result = bytes;
        suffix = "B";
    } else if (bytes < 1024 ** 2) {
        result = (bytes / 1024);
        suffix = "KB";
    } else if (bytes < 1024 ** 3) {
        result = (bytes / (1024 ** 2));
        suffix = "MB";
    } else {
        result = (bytes / (1024 ** 3));
        suffix = "GB";
    }

    // Verificar se o resultado é NaN
    if (isNaN(result)) {
        return "0 B";
    }

    return `${result.toFixed(2)} ${suffix}`;
}
