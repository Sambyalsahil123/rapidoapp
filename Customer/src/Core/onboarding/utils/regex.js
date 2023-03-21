  export const validatePhoneNumber = text => {
    let reg = /^(\+\d{1,3}[- ]?)?\d{10}$/
    return reg.test(text) ? true : false
  }