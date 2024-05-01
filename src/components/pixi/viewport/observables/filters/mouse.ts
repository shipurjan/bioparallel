import { MOUSE_BUTTON, MOUSE_BUTTONS } from "@/lib/utils/const";
import { FederatedMouseEvent } from "pixi.js";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

export const primaryButton = <T extends FederatedMouseEvent>(
    observable: Observable<T>,
    plural = true
) =>
    observable.pipe(
        filter(event =>
            plural
                ? (event.buttons as MOUSE_BUTTONS) === MOUSE_BUTTONS.PRIMARY
                : (event.button as MOUSE_BUTTON) === MOUSE_BUTTON.PRIMARY
        )
    );
