import { fromEvent } from "rxjs";

export const keyDown = fromEvent<KeyboardEvent>(document, "keydown");
