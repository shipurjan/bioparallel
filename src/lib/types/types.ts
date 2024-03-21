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

export type ConstType<T> = T extends { [key: string]: infer U } ? U : never;
