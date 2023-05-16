export class BaseOutput {
    id: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}