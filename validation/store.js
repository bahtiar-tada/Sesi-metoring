const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function checkStoreFields(data) {
    
  let errors = {};
  data.name = !ifEmpty(data.name) ? data.name : "";
  data.pic = !ifEmpty(data.pic) ? data.pic : "";
  data.phone = !ifEmpty(data.phone) ? data.phone : "";
  data.email = !ifEmpty(data.email) ? data.email : "";
	
	if (Validator.isEmpty(data.name)) {
		errors.name = "Name is mandatory";
	}
  if (Validator.isEmpty(data.pic)) {
    errors.pic = "PIC is mandatory";
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone is mandatory";
  }
	if (Validator.isEmpty(data.email)) {
		errors.email = "Email is mandatory";
	}

  return {
    errors,
    isValid: ifEmpty(errors)
  }

}
