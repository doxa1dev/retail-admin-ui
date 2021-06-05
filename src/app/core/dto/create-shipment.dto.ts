export class CreateShipmentDto {
  orderId: number;
  etShippingAgentId: string;
  entityId: string;
  agentCode: string;
  isIntegratedShipper: boolean;
  shipmentIdArr: string[];
  pickupAddressId: string;
  pickupDateTime: string;
  isCustomShipmentGroups: boolean;
  numOfShipmentGroups: number;
  shipmentGroups: any;
}
