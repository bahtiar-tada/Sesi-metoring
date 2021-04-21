const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function checkUserFields(data, type) {
    
  let errors = {};
  data.email = !ifEmpty(data.email) ? data.email : "";
  data.name = !ifEmpty(data.name) ? data.name : "";
  data.phone = !ifEmpty(data.phone) ? data.phone : "";
  data.password = !ifEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is mandatory";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is mandatory";
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone is mandatory";
  }

  if(type == 'create'){
      if (Validator.isEmpty(data.password)) {
        errors.password = "Password is mandatory";
      }
  }

  return {
    errors,
    isValid: ifEmpty(errors)
  };
};
