export const commonVariables = {
  questionnaireOneVersion: 'V01.01',
  questionnaireTwoVersion: 'V01.01',
  pagingLimit: 20,

  trackingHosts: {
    'DHL eCommerce Malaysia': 'https://www.dhl.com/my-en/home/tracking/tracking-ecommerce.html?tracking-id=<TRACKING_ID>',
    'GDex Singapore': 'https://web3.gdexpress.com/official/iframe/etracking_v4.php?input=<TRACKING_ID>&choice=cnGdex',
    'ABX Express': 'https://www.tracking.my/abx/<TRACKING_ID>',
    'Asiaxpress': 'https://www.tracking.my/asiaxpress/<TRACKING_ID>',
    'QXPRESS': 'https://www.qxpress.net/Customer/PopupTraceParcels?TrackingNo=<TRACKING_ID>',
    'MXPRESS': 'https://gold.mxpress2u.net/gold/PublicShipmentTracking.aspx?cn=<TRACKING_ID>'
  },

  countryCodeToName: {
    SG: 'Singapore',
    MY: 'Malaysia'
  },

  countryCodeToStates: {
    SG: {
      SG: 'Singapore'
    },
    MY: {
      W: 'Kuala Lumpur',
      L: 'Labuan',
      F: 'Putrajaya',
      J: 'Johor',
      K: 'Kedah',
      D: 'Kelantan',
      M: 'Malacca',
      N: 'Negeri Sembilan',
      C: 'Pahang',
      A: 'Perak',
      R: 'Perlis',
      P: 'Penang',
      S: 'Sabah',
      Q: 'Sarawak',
      B: 'Selangor',
      T: 'Terengganu'
    }
  },

  MalaysiaBank: [
    {
      "bank_code": "AEON",
      "bank_name": "AEON",
      "full_desc": "AEON"
    },
    {
      "bank_code": "AFF",
      "bank_name": "Affin Bank",
      "full_desc": "AFFIN Bank"
    },
    {
      "bank_code": "ALLI",
      "bank_name": "Alliance",
      "full_desc": "Alliance Bank"
    },
    {
      "bank_code": "AMB",
      "bank_name": "AM BANK",
      "full_desc": "AM Bank"
    },
    {
      "bank_code": "ARJ",
      "bank_name": "Al Rajhi Bank",
      "full_desc": "Al Rajhi Bank"
    },
    {
      "bank_code": "BIMB",
      "bank_name": "Bank Islam Malaysia",
      "full_desc": "Bank Islam Malaysia Bhd"
    },
    {
      "bank_code": "BIS",
      "bank_name": "Bank Islam",
      "full_desc": "Bank Islam"
    },
    {
      "bank_code": "BSN",
      "bank_name": "Bank Simpanan National",
      "full_desc": "Bank Simpanan National Bhd"
    },
    {
      "bank_code": "CIMB",
      "bank_name": "CIMB",
      "full_desc": "CIMB Bank"
    },
    {
      "bank_code": "CITI",
      "bank_name": "CitiBank",
      "full_desc": "Citi Bank"
    },
    {
      "bank_code": "DEUT",
      "bank_name": "Deutche",
      "full_desc": "Deutche Bank"
    },
    {
      "bank_code": "EON",
      "bank_name": "EON Bank",
      "full_desc": "EON Bank"
    },
    {
      "bank_code": "HAPS",
      "bank_name": "Hap Seng Bank",
      "full_desc": "Hap Seng Bank"
    },
    {
      "bank_code": "HLB",
      "bank_name": "Hong Leong",
      "full_desc": "Hong Leong Bank"
    },
    {
      "bank_code": "HSBC",
      "bank_name": "HSBC",
      "full_desc": "Hong Kong & Shanghai Bank"
    },
    {
      "bank_code": "MAY",
      "bank_name": "MayBank",
      "full_desc": "MayBank"
    },
    {
      "bank_code": "MBF",
      "bank_name": "MBF",
      "full_desc": "MBF"
    },
    {
      "bank_code": "OCBC",
      "bank_name": "OCBC",
      "full_desc": "OCBC Bank"
    },
    {
      "bank_code": "OTH",
      "bank_name": "Others",
      "full_desc": "Other Bank"
    },
    {
      "bank_code": "PBB",
      "bank_name": "Public Bank",
      "full_desc": "Public Bank Bhd"
    },
    {
      "bank_code": "RHB",
      "bank_name": "RHB",
      "full_desc": "RHB Bank"
    },
    {
      "bank_code": "STC",
      "bank_name": "Stand Chart",
      "full_desc": "Standard  & Chatered"
    },
    {
      "bank_code": "UOB",
      "bank_name": "UOB",
      "full_desc": "UOB Bank"
    }
  ],

  SingaporeBank: [
    {
      "bank_code": "AEON",
      "bank_name": "AEON",
      "full_desc": "AEON"
    },
    {
      "bank_code": "AFF",
      "bank_name": "Affin Bank",
      "full_desc": "AFFIN Bank"
    },
    {
      "bank_code": "ALLI",
      "bank_name": "Alliance",
      "full_desc": "Alliance Bank"
    },
    {
      "bank_code": "AMB",
      "bank_name": "AM BANK",
      "full_desc": "AM Bank"
    },
    {
      "bank_code": "ARJ",
      "bank_name": "Al Rajhi Bank",
      "full_desc": "Al Rajhi Bank"
    },
    {
      "bank_code": "BIMB",
      "bank_name": "Bank Islam Malaysia",
      "full_desc": "Bank Islam Malaysia Bhd"
    },
    {
      "bank_code": "BIS",
      "bank_name": "Bank Islam",
      "full_desc": "Bank Islam"
    },
    {
      "bank_code": "BSN",
      "bank_name": "Bank Simpanan National",
      "full_desc": "Bank Simpanan National Bhd"
    },
    {
      "bank_code": "CIMB",
      "bank_name": "CIMB",
      "full_desc": "CIMB Bank"
    },
    {
      "bank_code": "CITI",
      "bank_name": "CitiBank",
      "full_desc": "Citi Bank"
    },
    {
      "bank_code": "DBS",
      "bank_name": "DBS Bank",
      "full_desc": "Development Bank of Singapore Limited"
    },
    {
      "bank_code": "DEUT",
      "bank_name": "Deutche",
      "full_desc": "Deutche Bank"
    },
    {
      "bank_code": "EON",
      "bank_name": "EON Bank",
      "full_desc": "EON Bank"
    },
    {
      "bank_code": "HAPS",
      "bank_name": "Hap Seng Bank",
      "full_desc": "Hap Seng Bank"
    },
    {
      "bank_code": "HLB",
      "bank_name": "Hong Leong",
      "full_desc": "Hong Leong Bank"
    },
    {
      "bank_code": "HSBC",
      "bank_name": "HSBC",
      "full_desc": "Hong Kong & Shanghai Bank"
    },
    {
      "bank_code": "MAY",
      "bank_name": "MayBank",
      "full_desc": "MayBank"
    },
    {
      "bank_code": "MBF",
      "bank_name": "MBF",
      "full_desc": "MBF"
    },
    {
      "bank_code": "OCBC",
      "bank_name": "OCBC",
      "full_desc": "OCBC Bank"
    },
    {
      "bank_code": "OTH",
      "bank_name": "Others",
      "full_desc": "Other Bank"
    },
    {
      "bank_code": "PBB",
      "bank_name": "Public Bank",
      "full_desc": "Public Bank Bhd"
    },
    {
      "bank_code": "POSB",
      "bank_name": "POSB Bank",
      "full_desc": "Post Office Savings Bank"
    },
    {
      "bank_code": "RHB",
      "bank_name": "RHB",
      "full_desc": "RHB Bank"
    },
    {
      "bank_code": "STC",
      "bank_name": "Stand Chart",
      "full_desc": "Standard  & Chatered"
    },
    {
      "bank_code": "UOB",
      "bank_name": "UOB",
      "full_desc": "UOB Bank"
    }
  ]
};
