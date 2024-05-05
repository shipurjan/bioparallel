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

    deleteId() {
        if (this.currentId > 0) {
            this.currentId -= 1;
        } else {
            console.log("Cannot delete. ID is already at minimum.");
        }
    }
}
