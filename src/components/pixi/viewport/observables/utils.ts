import { Observable, map } from "rxjs";

export const makeSwitchable = <T, const K extends string>(
    observable: Observable<T>,
    name: K
) => observable.pipe(map(value => ({ name, value })));
