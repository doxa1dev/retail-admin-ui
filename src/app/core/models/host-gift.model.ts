export class Redemption {
    public orderId: string;
    public recognitionDate: string;
    public expiryDate: string;
    public customerName: string;
    public advisorName: string;
    public advisorId: string;
    public redemptionStatus: string;
    public redemptionOrder: string;
    public redemptionDate: string;

    constructor() {
        this.orderId = "";
        this.recognitionDate = "";
        this.expiryDate = "";
        this.customerName = "";
        this.advisorName = "";
        this.advisorId = "";
        this.redemptionStatus = "";
        this.redemptionOrder = "";
        this.redemptionDate = "";
    }
}

export class ActiveSettingItem {
    public id: number = 0;
    public public_id: string;
    public active_at: Date = new Date();
    public expired_at: Date = new Date();
    public status: STATUS;
    public hostGift: any;

    constructor(active_at?: Date, expired_at?: Date, status?: STATUS, hostGift?: any, id?: number, public_id?: string) {
        this.id = id;
        this.active_at = active_at;
        this.expired_at = expired_at;
        this.status = status;
        this.hostGift = hostGift;
        this.public_id = public_id;
    }
}

export class ActiveSetting {
    public arrId: number[] = [];
    public public_id: string;
    public active_at: Date = new Date();
    public expired_at: Date = new Date();
    public status: STATUS;
    public arrHostGift: any[];

    constructor(active_at?: Date, expired_at?: Date, status?: STATUS, hostGift?: any[], id?: number[], public_id?: string) {
        this.arrId = id;
        this.active_at = active_at;
        this.expired_at = expired_at;
        this.status = status;
        this.arrHostGift = hostGift;
        this.public_id = public_id;
    }
}

export enum STATUS {
    UPCOMING = "UPCOMING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED"
}