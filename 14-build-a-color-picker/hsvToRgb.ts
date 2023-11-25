export const hsvToRgb = ({ h, s, v }) => {
    s /= 100;
    v /= 100;

    const i = ~~(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));
    const index = i % 6;

    const r = [v, q, p, p, t, v][index] * 255;
    const g = [t, v, v, q, p, p][index] * 255;
    const b = [p, p, t, v, v, q][index] * 255;
    return { r, g, b };
};
