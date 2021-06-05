export class Request {
    public id: string = "";
    public requestId: string = "";
    public requestDate: string = "";
    public demoDate: string = "";
    public status: string = "";
    public advisorName: string = "";
    public advisorId: string = "";
    public hostName: string = "";
    public phoneNumber: string = "";
    public redemptionOrder: string = "";
    public redemptionDate: string = "";

    constructor(
        id: string = "",
        requestId: string = "", requestDate: string = "", demoDate: string = "",
        status: string = "", advisorName: string = "", advisorId: string = "",
        hostName: string = "", phoneNumber: string = "", redemptionOrder: string = "",
        redemptionDate: string = ""
    ) {
        this.id = id;
        this.requestId = requestId;
        this.requestDate = requestDate;
        this.demoDate = demoDate;
        this.status = status;
        this.advisorName = advisorName;
        this.advisorId = advisorId;
        this.hostName = hostName;
        this.phoneNumber = phoneNumber;
        this.redemptionOrder = redemptionOrder;
        this.redemptionDate = redemptionDate;
    }
}

export class RequestDetail {
    public requestId: string = "";
    public advisorName: string = "";
    public advisorId: string = "";
    public hostName: string = "";
    public hostPhoneNumber: string = "";
    public demoDate: string = "";
    public demoLocation: string = "";
    public guestInfoArray: GuestInformation[] = [];
    public requestImage: string = "assets/DoxaImages/image-default.png";
    public comment: string = "";
    public status: string = "";

    constructor(
        requestId: string = "",
        advisorName: string = "", advisorId: string = "",
        hostName: string = "", hostPhoneNumber: string = "",
        demoDate: string = "", demoLocation: string = "",
        guestInfoArray: GuestInformation[] = [],
        requestImage: string = "assets/DoxaImages/image-default.png",
        comment: string = "", status: string = ""
    ) {
        this.requestId = requestId;
        this.demoDate = demoDate;
        this.demoLocation = demoLocation;
        this.advisorName = advisorName;
        this.advisorId = advisorId;
        this.hostName = hostName;
        this.hostPhoneNumber = hostPhoneNumber;
        this.guestInfoArray = guestInfoArray;
        this.requestImage = requestImage;
        this.comment = comment;
        this.status = status;
    }
}

export class GuestInformation {
    public guestName: string = "";
    public phoneNumber: string = "";

    constructor(guestName: string = "", phoneNumber: string = "") {
        this.guestName = guestName;
        this.phoneNumber = phoneNumber;
    }
}

export class GuestTracker {
    public name: string = "";
    public phoneNumber: string = "";
    public requestId: string = "";
    public requestDate: string = "";
    public demoDate: string = "";
    public advisorName: string = "";
    public advisorId: string = "";
    public hostName: string = "";

    constructor() {
        this.name = "";
        this.phoneNumber = "";
        this.requestId = "";
        this.requestDate = "";
        this.demoDate = "";
        this.advisorName = "";
        this.advisorId = "";
        this.hostName = "";
    }
}

export enum STATUS {
    NOT_YES = "NOT_YES",
    REJECTED = "REJECTED",
    REDEEMED = "REDEEMED",
    PENDING = "PENDING",
    EXPIRED = "EXPIRED"
}