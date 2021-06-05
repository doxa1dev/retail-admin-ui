export class ShippingCost {
    numberOfInterval: number;
    weightShippingRule: any[];
    additionCostPerKg: number;
    freeIfExcess: number;

    constructor() {
        this.numberOfInterval = 0;
        this.weightShippingRule = [];
        this.additionCostPerKg = 0;
        this.freeIfExcess = 0;
    }
}

export class WeightShippingRule {
    from: number;
    to: number;
    shippingCost: number;

    constructor() {
        this.from = 0;
        this.to = 0;
        this.shippingCost = 0;
    }
}