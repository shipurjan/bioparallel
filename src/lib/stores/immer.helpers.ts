import { Draft, produce } from "immer";
import { Callback, FeedbackSetter } from "../types/types";

/** A utility function to set a new state using Immer's `produce` function.
 *
 * Specifically made to be used in zustand stores
 */
export const makeImmerSetter =
    <State>(setter: FeedbackSetter<State>) =>
    (callback: (draft: Draft<State>) => void) => {
        setter(
            produce(draft => {
                callback(draft);
            })
        );
    };

/** Type of `set` function in zustand */
export type SetStateInternal<T> = {
    _(
        partial:
            | T
            | Partial<T>
            | {
                  _(state: T): T | Partial<T>;
              }["_"],
        replace?: boolean | undefined
    ): void;
}["_"];

const makeImmerShallowUpdater =
    <T>(set: SetStateInternal<T>) =>
    (callback: (draft: Draft<T>) => void) =>
        set(
            produce(state => {
                callback(state);
            })
        );

/** A utility function to create immer setters in zustand store */
export const makeImmerFeedbackSetter =
    <T extends object, S extends object, K extends keyof S>(
        set: SetStateInternal<T>,
        extractor: (obj: T | Draft<T>) => [S, K]
    ): FeedbackSetter<S[K]> =>
    (callback: Callback<S[K]>) => {
        makeImmerShallowUpdater(set)(state => {
            const [obj, key] = extractor(state);
            // eslint-disable-next-line security/detect-object-injection
            obj[key] = callback(obj[key]);
        });
    };
