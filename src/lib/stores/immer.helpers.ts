import { Draft, produce } from "immer";

export type ProduceCallback<T> = (callback: (draft: Draft<T>) => void) => void;
export const produceCallback = <T>(callback: (draft: Draft<T>) => void) =>
    produce(state => {
        callback(state);
    });

export type Immer<T> = T & {
    set: ProduceCallback<T>;
};
export type ActionProduceCallback<S, T> = (
    prop: S | Draft<S>,
    draft: T | Draft<T>
) => S | Draft<S>;
