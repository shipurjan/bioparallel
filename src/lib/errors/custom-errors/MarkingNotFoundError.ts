export class MarkingNotFoundError extends Error {
    constructor() {
        const message = "Marking not found";
        super(message);
        this.name = "MarkingNotFoundError";
    }
}
