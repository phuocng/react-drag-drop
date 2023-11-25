export const rgbToHex = ({ r, g, b, a }): string => {
    const [rr, gg, bb, aa] = [r, g, b, Math.round(a * 255)].map((v) => v.toString(16).padStart(2, "0"));
    return ["#", rr, gg, bb, aa === "ff" ? "" : aa].join("");
};
