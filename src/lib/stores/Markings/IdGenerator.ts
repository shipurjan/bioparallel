export class IDGenerator {
    private currentId: number;

    constructor() {
        this.currentId = 0;
    }

    generateId() {
        this.currentId += 1;
        return this.currentId;
    }

    setId(value: number) {
        this.currentId = value;
    }
}
