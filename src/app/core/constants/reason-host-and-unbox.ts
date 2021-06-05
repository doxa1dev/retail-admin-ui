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
