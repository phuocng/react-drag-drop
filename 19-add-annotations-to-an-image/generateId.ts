export const generateId = (length: number): string =>
    Array(length)
        .fill('')
        .map((v) => Math.random().toString(36).charAt(2))
        .join('');
