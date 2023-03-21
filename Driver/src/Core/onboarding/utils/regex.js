export const validateAadhar = text => {
    const reg = new RegExp(
      /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
    )
    return reg.test(text) ? true : false
  }

  
  export const validatePhoneNumber = text => {
    let reg = /^(\+\d{1,3}[- ]?)?\d{10}$/
    return reg.test(text) ? true : false
  }