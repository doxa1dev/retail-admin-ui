export const SINGLE_FULL_PAYMENT_GIFT = 'Full Payment Gift';
export const ONLINE_BANK_TRANSFER_PAYMENT_GIFT = 'Online Bank Transfer Payment Gift';

export interface GiftDisplay {
  id: string;
  name: string;
  quantity: number;
}

export function aggregateGifts(gifts: any[]): GiftDisplay[] {
  const giftDisplayArr: GiftDisplay[] = [];
  for (const gift of gifts) {
    const giftId = (gift.single_paymt_gift_product_id) ? gift.single_paymt_gift_product_id : gift.online_bank_transfer_gift_product_id;
    const giftObj = giftDisplayArr.find(obj => obj.id === giftId);
    if (!giftObj) {
      const giftName = (gift.single_paymt_gift_product_name) ? gift.single_paymt_gift_product_name : gift.online_bank_transfer_gift_product_name;
      const giftDisplay: GiftDisplay = {
        id: giftId,
        name: giftName,
        quantity: 1
      };
      giftDisplayArr.push(giftDisplay);
    }
    else {
      giftObj.quantity += 1;
    }
  }
  return giftDisplayArr;
}
