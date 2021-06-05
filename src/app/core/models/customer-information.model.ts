export class CustomerInformation {

  //Personal Information
  publicId: string
  nameAsInIC: string;
  nickName: string;
  preferredName: string;
  address: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  stateCode: string;
  countryCode: string;
  hasAccount: boolean;
  //Privacy
  email: string;
  phoneDialCode: string;
  phoneNumber: string;
  phoneNumberAndDialCode: string;
  //Advising Team
  myAdvisorId: string;

  advisorName: string;
  advisorId: string;
  advisorPhotoKey: string;

  recruiterName: string;
  recruiterId: string;
  recruiterPhotoKey: string;

  teamLeaderName: string;
  teamLeaderId: string;
  teamLeaderPhotoKey: string;

  branchManagerName: string;
  branchManagerId: string;
  branchManagerPhotoKey: string;

  //History
  customerUpdateHistory: any = [];

  is_active: boolean;
  is_registered: boolean;
  phone_dial_code: string;
  phone_number: string;
  phoneNumberTemp: string;
  id: string;

  // bank info;
  bank_code: string;
  bank_name: string;
  bank_account: string;
  postal_code: string;
  state_code: string;
  country_code: string;
}
