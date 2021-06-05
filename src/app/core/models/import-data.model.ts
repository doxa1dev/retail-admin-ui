export class DataImport {
    rank: number;
    entityId: number;
    branchMgrAdvisorID: number;
    mgrAdvisorID: number;
    advisorID: number;
    advName: string;
    nic: string;
    dob: string;
    nationalityCode: string;
    address1: string;
    address2: string;
    address3: string;
    postCode: string;
    stateCode: string;
    countryCode: string;
    phoneDialCode: string;
    mobilePhone: string;
    emailNew: string;
    gender: string;
    designation: string;
    recruiterAdvisorID: number;
    nickName: string;
    bankCode: string;
    bankAccNo: string;
    bankHolder: string;    
    bankHolderIC: string;
    messageError: string;
}

export const schema = {
            'RANK': {
                prop: 'rank',
            },
            'CUSTOMER FIELD': {
                prop: 'customerField',
                type: {
                    'EntityID': {
                        prop: 'entity_id',
                    },
                    'BranchMgrAdvisorID': {
                        prop: 'branch_manager_customer_id',
                    },
                    'MgrAdvisorID': {
                        prop: 'team_leader_customer_id',
                    },
                    'AdvisorID': {
                        prop: 'advisor_id_number',
                    },
                    'AdvName': {
                        prop: 'firt_name',
                    },
                    'NIC': {
                        prop: 'national_id',
                    },
                    'DOB': {
                        prop: 'day_of_birth',
                        type: Date
                    },
                    'NationalityCode': {
                        prop: 'nationality_code',
                    },
                    'PhoneDialCode': {
                        prop: 'phone_dial_code',
                    },
                    'MobilePhoneNew': {
                        prop: 'phone_number',
                    },
                    'EmailNew': {
                        prop: 'email',
                    },
                    'Gender': {
                        prop: 'gender',
                    },
                    'Designation': {
                        prop: 'designation',
                    },
                    'RecruiterAdvisorID': {
                        prop: 'recruiter_id',
                    },
                    'NickName': {
                        prop: 'preferred_name',
                    },
                    'BankCode': {
                        prop: 'bank_code',
                    },
                    'BankAccNo': {
                        prop: 'bank_account',
                        type: value  => {
                            return value.toString()
                        }
                    },
                    'BankHolder': {
                        prop: 'bank_holder',
                    },
                    'BankHolderIC': {
                        prop: 'bank_holder_ic',
                        type: value  => {
                            return value.toString()
                        }
                    },
                }
            
            },
            'ADDRESS V2': {
                prop:'addressV2',
                type: {
                    'Address1': {
                        prop: 'address_line1',
                    },
                    'Address2': {
                        prop: 'address_line2',
                    },
                    'Address3': {
                        prop: 'address_line3',
                    },
                    'PostCode': {
                        prop: 'postal_code',
                    },
                    'StateCode': {
                        prop: 'state_code',
                    },
                    'CountryCode': {
                        prop: 'country_code',
                    } 
                    
                }
            }
        }