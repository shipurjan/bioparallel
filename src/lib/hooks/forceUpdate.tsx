import { useReducer } from "react";

export const useUpdater = () => {
    // eslint-disable-next-line no-bitwise
    const [, updater] = useReducer(x => x ^ 1, 0);
    return updater;
};
