export class ProductShippingStatus {
  pieceId: string;
  trackingId: string;
  productName: string;
  quantity: any;
  status: string;
  updatedTime: string;

  constructor(pieceId: string, trackingId: string, productName: string, quantity: any, status: string, updatedTime: string) {
    this.pieceId = pieceId;
    this.trackingId = trackingId;
    this.productName = productName;
    this.quantity = quantity;
    this.status = status;
    this.updatedTime = updatedTime;
  }
}
