export const capitalize = (str: string) => {
    const s = str.toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
};
