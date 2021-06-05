class ReasonForNotUnboxAndNotHost {
  value: string;
  label: string
}

export const REASONS_FOR_ADVISOR_TO_NOT_UNBOX: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1',
    label: `Customer can\'t allocate time.`
  }, {
    value: '2',
    label: `Customer prefers to do it on his or her own.`
  }, {
    value: '3',
    label: `Customer concerns about his or her privacy.`
  }
];

export const REASONS_FOR_CUSTOMER_TO_NOT_UNBOX: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1',
    label: `I can\'t allocate time.`
  }, {
    value: '2',
    label: `I prefer to do it on my own.`
  }, {
    value: '3',
    label: `I am concerned about my privacy.` 
  }
];

export const REASONS_FOR_ADVISOR_TO_NOT_HOST: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1',
    label: `Customer doesn\'t intend to share on his or her purchase.`,
  }, {
    value: '2',
    label: `Customer has no time to host.`,
  }, {
    value: '3',
    label: `Customer is concern about his or her privacy.`
  }
]

export const REASONS_FOR_CUSTOMER_TO_NOT_HOST: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1',
    label: `I don\'t intend to share on my purchase.`,
  }, {
    value: '2',
    label: `I have no time to host.`,
  }, {
    value: '3',
    label: `I am concerned about my privacy.`
  }
]

export const ACTIVITY_TYPE_ADVISOR: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1a',
    label: `Cooking Experience`,
  }
]

export const ACTIVITY_TYPE_TEAM_LEADER: Array<ReasonForNotUnboxAndNotHost> = [
 {
    value: '1l',
    label: `Cooking Experience`,
  }, {
    value: '2l',
    label: `Training`
  }, {
    value: '3l',
    label: `Meeting`
  }
]

export const ACTIVITY_TYPE_BRANCH_MANAGER: Array<ReasonForNotUnboxAndNotHost> = [
  {
    value: '1m',
    label: `Cooking Experience`,
  }, {
    value: '2m',
    label: `Training`,
  }, {
    value: '3m',
    label: `Meeting`
  }
];

export const ACTIVITY_PRIVACY_TYPE : Array<ReasonForNotUnboxAndNotHost> = [
  {
    value : 'BRANCH',
    label : `Visible to Branch`
  },
  
  {
    value : 'TEAM',
    label : `Visible to Team`
  },
  {
    value : 'PRIVATE',
    label : `Private`
  },
  {
    value : 'PUBLIC',
    label : `Public`
  },

]
class Sale
{
  value: string;
  label: string
}
export const SALESLIST: Array<Sale> = [
  {
    value : '0',
    label : 'Buy NAEP package'
  },
  {
    value: '1',
    label: 'Sell 1st Thermomix'
  },
  {
    value: '2',
    label: 'Sell 2nd Thermomix'
  },
  {
    value: '3',
    label: 'Sell 3rd Thermomix'
  },
  {
    value: '4',
    label: 'Sell 4th Thermomix'
  },
  {
    value: '5',
    label: 'Sell 5th Thermomix'
  },
  {
    value: '6',
    label: 'Sell 6th Thermomix'
  }
]

//Questionnaire one
class Question {
  id : number;
  text: string;
}


export const USER_TYPE: Array<Question> = [
  { id: 1, text: "Host" },
  { id: 2, text: "Guest" }
]

export const P2_Q1: Array<Question> = [
  { id: 1, text: "Easy" },
  { id: 2, text: "Healthy" },
  { id: 3, text: "Fast" },
  { id: 4, text: "Economical" },
  { id: 5, text: "Avoiding Additives" }
]

export const P2_Q2: Array<Question> = [
  { id: 1, text: "Convenient" },
  { id: 2, text: "Inconvenient" },
  { id: 3, text: "Variety of Choices" },
  { id: 4, text: "Costly" },
  { id: 5, text: "Unhealthy" },
  { id: 6, text: "Others" }
]

export const P2_Q3: Array<Question> = [
  { id: 1, text: "Sauces" },
  { id: 2, text: "Bread" },
  { id: 3, text: "Jams" },
  { id: 4, text: "Soups" },
  { id: 5, text: "Yoghurt" },
  { id: 6, text: "Ice Creams" },
  { id: 7, text: "Juices" },
  { id: 8, text: "Pizzas" },
  { id: 9, text: "Cakes" }
]

export const P2_Q4: Array<Question> = [
  { id: 1, text: "Daily" },
  { id: 2, text: "Rarely" },
  { id: 3, text: "1 to 3 Days" },
  { id: 4, text: "4 to 6 Days" }
]

export const P2_Q5: Array<Question> = [
  { id: 1, text: "1" },
  { id: 2, text: "2" },
  { id: 3, text: "3 to 4" },
  { id: 4, text: "5 or more" }
]

export const P2_Q6: Array<Question> = [
  { id: 1, text: "Breakfast" },
  { id: 2, text: "Lunch" },
  { id: 3, text: "Dinner" },
  { id: 4, text: "Desert" }
]

export const P2_Q7: Array<Question> = [
  { id: 1, text: "Healthier" },
  { id: 2, text: "Saves money" },
  { id: 3, text: "Convenient" },
  { id: 4, text: "Gives me more control" },
  { id: 5, text: "Better food choices" },
  { id: 6, text: "Allows creativity" }
]

export const P2_Q8: Array<Question> = [
  { id: 1, text: "No" },
  { id: 2, text: "Vegetarian" },
  { id: 3, text: "Gluten-Free" },
  { id: 4, text: "Diabetic" },
  { id: 5, text: "Lactose" },
  { id: 6, text: "Peanut Allergy" },
  { id: 7, text: "Intolerance" },
  { id: 8, text: "Others" }
]

export const P2_Q9_MODEL: Array<Question> = [
  { id: 1, text: "TM31" },
  { id: 2, text: "TM5" },
  { id: 3, text: "TM6" },
]

//Questionnaire two
export const Q1_DATA: Array<Question> = [
  { id: 1, text: 'Technology' },
  { id: 2, text: "Auto cooking/Auto washing" },
  { id: 3, text: "Faster, easier cooking" },
  { id: 4, text: "Multi-function" },
  { id: 5, text: "Easier and healthier cooking" },
  { id: 6, text: "I can cook too" },
  { id: 7, text: "My family can cook too" },
]

export const Q3_DATA: Array<Question> = [
  { id: 1, text: "Weekdays" },
  { id: 2, text: "Weekends" },
  { id: 3, text: "Day Time" },
  { id: 4, text: "Afternoon/Evening" }
]

export const Q4_DATA: Array<Question> = [
  { id: 1, text: "Full payment with gift" },
  { id: 2, text: "Financing" }
]

export const Q5_DATA: Array<Question> = [
  { id: 1, text: "Yes" },
  { id: 2, text: "No" }
]

//Naep
export const Q3_NAEP: Array<Question> = [
  { id: 1, text: "Fulltime" },
  { id: 2, text: "Part Time" },
  { id: 3, text: "Not Working" },
  { id: 4, text: "Other Direct Sales" }
]

export const Q4_NAEP: Array<Question> = [
  { id: 1, text: "Extra Income" },
  { id: 2, text: "Quality of Thermomix" },
  { id: 3, text: "Career" },
  { id: 4, text: "I have time" },
  { id: 5, text: "Meeting people" }
]

export const Q4A_NAEP: Array<Question> = [
  { id: 1, text: "$1000" },
  { id: 2, text: "$2000" },
  { id: 3, text: "$3000" },
  { id: 4, text: "$4000" },
  { id: 5, text: "$10.000" },
  { id: 6, text: "Other,"}
]

export const Q5_NAEP: Array<Question> = [
  { id: 1, text: "3 Hours/day" },
  { id: 2, text: "Morning" },
  { id: 3, text: "Afternoon" },
  { id: 4, text: "Weekdays" },
  { id: 5, text: "Weekends only" },
  { id: 6, text: "Everyday free"}
]

//Question questionnaire
export const QUESTION_QUESTIONNAIRE: Array<Question> = [
  { id: 1, text: '"(Pre-demo) For you, cooking should be"' },
  { id: 2, text: '"How do you feel about eating out?"' },
  { id: 3, text: '"What products do you normally buy which are ready-made?"'},
  { id: 4, text: '"How often do you cook per week?"' },
  { id: 5, text: '"For how many people?"'},
  { id: 6, text: '"Which meals do you prepare every day?"'},
  { id: 7, text: '"What do you enjoy about cooking?"'},
  { id: 8, text: '"Do you and/or your family follow a special diet?"'},
  { id: 9, text: '"Do you own a Thermomix?"'},
  { id: 10, text: '"(Post-demo) What impresses you the MOST from this Thermomix® Cooking Experience? (You may choose more than one)"'},
  { id: 11, text: '"What would you make with your first Thermomix®?"'},
  { id: 12, text: '"I would like to recommend Thermomix® to my friends. My preferred show time with my friends:"'},
  { id: 13, text: '"Which of the following is best for you?"'},
  { id: 14, text: '"Would you like to know more about a career with Thermomix®?"'},
]

