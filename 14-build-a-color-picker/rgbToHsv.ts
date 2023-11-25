export const rgbToHsv = ({ r, g, b }) => {
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);

    if (d === 0) {
        return {
            h: 0,
            s: max ? (d / max) : 0,
            v: max,
        };
    }
    let h = 0;
    switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
        case g:
            h = 2 + (b - r) / d;
            break;
        case b:
            h = 4 + (r - g) / d;
            break;
    }
    return {
        h: h * 60,
        s: max ? (d / max) : 0,
        v: max,
    };
};
