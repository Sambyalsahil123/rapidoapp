const LOG_OUT = 'logout'
const UPDATE_SELECTED_PAYMENT_METHOD = 'UPDATE_SELECTED_PAYMENT_METHOD'
const UPDATE_PAYMENT_METHODS = 'UPDATE_PAYMENT_METHODS'
const REMOVE_PAYMENT_METHOD = 'REMOVE_PAYMENT_METHOD'
const UPDATE_CARD_NUMBERS_ENDING = 'UPDATE_CARD_NUMBERS_ENDING'

const icons = {
  visaPay: require('../../assets/icons/visa.png'),
  americanExpress: require('../../assets/icons/american-express.png'),
  dinersClub: require('../../assets/icons/diners-club.png'),
  discover: require('../../assets/icons/discover.png'),
  jcb: require('../../assets/icons/jcb.png'),
  mastercard: require('../../assets/icons/mastercard.png'),
  unionpay: require('../../assets/icons/unionpay.png'),
  cash: require('../../assets/icons/cash.png'),
}
const cardIconSource = {
  Visa: icons.visaPay,
  MasterCard: icons.mastercard,
  'American Express': icons.americanExpress,
  '	Diners Club': icons.dinersClub,
  Discover: icons.discover,
  JCB: icons.jcb,
  UnionPay: icons.unionpay,
}

const cashPaymentMethod = {
  title: 'Cash',
  key: 'cash',
  last4: 'cash',
  iconSource: icons.cash,
}

export const setSelectedPaymentMethod = data => ({
  type: UPDATE_SELECTED_PAYMENT_METHOD,
  data,
})

export const updatePaymentMethods = data => ({
  type: UPDATE_PAYMENT_METHODS,
  data,
})

export const removePaymentMethod = data => ({
  type: REMOVE_PAYMENT_METHOD,
  data,
})

export const updateCardNumbersEnding = data => ({
  type: UPDATE_CARD_NUMBERS_ENDING,
  data,
})

const initialState = {
  paymentMethods: [],
  selectedPaymentMethod: {},
}

export const payment = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_PAYMENT_METHOD:
      return {
        ...state,
        selectedPaymentMethod: action.data,
      }

    case REMOVE_PAYMENT_METHOD:
      return removeUserPaymentMethods(state, action.data)
    case UPDATE_PAYMENT_METHODS:
      return updateUserPaymentMethods(state, action.data)
    case UPDATE_CARD_NUMBERS_ENDING:
      return addCardNumberEnding(state, action.data)
    case LOG_OUT:
      return initialState
    default:
      return state
  }
}

const updateUserPaymentMethods = (state, methods) => {
  if (methods) {
    const updatedMethods = methods.map(method => {
      return {
        ...method,
        title: `**** ${method.last4}`,
        key: method.id,
        iconSource: cardIconSource[method.brand],
      }
    })

    return {
      ...state,
      paymentMethods: [cashPaymentMethod, ...updatedMethods],
    }
  } else {
    return state
  }
}

const removeUserPaymentMethods = (state, method) => {
  const newPaymentMethods = state.paymentMethods.filter(existingMethod => {
    return existingMethod?.cardId !== method.cardId
  })

  if (newPaymentMethods) {
    return {
      ...state,
      paymentMethods: [...newPaymentMethods],
    }
  } else {
    return state
  }
}

const addCardNumberEnding = (state, newCardNumberEnding) => {
  const doesExist = state.cardNumbersEnding.find(number => {
    return newCardNumberEnding === number
  })

  if (!doesExist) {
    return {
      ...state,
      cardNumbersEnding: [...state.cardNumbersEnding, newCardNumberEnding],
    }
  } else {
    return state
  }
}
