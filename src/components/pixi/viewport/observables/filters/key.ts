import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export const keyName = <T extends KeyboardEvent>(
    observable: Observable<T>,
    keyName: string
) => observable.pipe(filter(event => event.key === keyName));
