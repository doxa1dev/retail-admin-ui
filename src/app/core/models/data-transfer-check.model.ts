export class DataTransfer {
    public orderId: string;
    public createdTime: string;
    public paymentVerifiedTime: string;

    constructor() {
        this.orderId = "";
        this.createdTime = "";
        this.paymentVerifiedTime = "";
    }
}

export class DataTransferMemmember {
    public advisorId: number;
    public email: string;
    public createdTime: string;

    constructor(advisorId? : number, email? : string, createdTime? : string) {
        this.advisorId = advisorId;
        this.email = email;
        this.createdTime = createdTime;
    }
}

export enum STATUS {
    TO_SHIP = "TO_SHIP",
    TO_RECEIVE = "TO_RECEIVE",
    TO_HOST = "TO_HOST",
    TO_UNBOX = "TO_UNBOX",
    COMPLETED = "COMPLETED"
}