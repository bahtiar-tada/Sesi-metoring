const Validator = require("validator");
const ifEmpty = require("./checkForEmpty");

module.exports = function checkManagerFields(data) {
    
  let errors = {};
  data.storeId = !ifEmpty(data.storeId) ? data.storeId : "";
  data.name = !ifEmpty(data.name) ? data.name : "";
  data.phone = !ifEmpty(data.phone) ? data.phone : "";
  data.workingSince = !ifEmpty(data.workingSince) ? data.workingSince : "";

  if (!data.storeId) {
    errors.storeId = "Store ID is mandatory";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is mandatory";
  }
  if (Validator.isEmpty(data.age)) {
    errors.age = "Age is mandatory";
  }
	if (Validator.isEmpty(data.workingSince)) {
		errors.workingSince = "Working Since is mandatory";
	}

  return {
    errors,
    isValid: ifEmpty(errors)
  }

}
