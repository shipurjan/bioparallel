export type Prettify<T> = {
    [K in keyof T]: T[K];
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type CanvasUpdaterOptions =
    | {
          autoUpdate?: undefined | false;
      }
    | {
          autoUpdate: true;
          throttledUpdate?: boolean;
      };

export type Callback<Type> = (oldState: Type) => Type;

/** A type used in setters with a callback containing the old state.
 *
 * It works basically like React's `setState` function.
 */
export type FeedbackSetter<Type> = (callback: Callback<Type>) => void;
