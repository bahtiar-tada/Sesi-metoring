const bcrypt = require('bcryptjs');
const { User } = require('../models');
// Validation
const checkUserFields = require("../validation/user");

module.exports = (req, res, next) => {
	const { errors, isValid } = checkUserFields(req.body, 'update');
	
	if (!isValid) {
		return res.status(422).json({message: errors});
	}

  switch(req.query.mode) {
    case 'async':
      updateWithAsync(req, res, next)
      break;

    case 'promise':
      updateWithPromise(req, res, next)
      break;

    case 'callback':
      updateWithCallback(req, res, next)
      break;

    default:
      updateWithPromise(req, res, next)
      break;
  }
}

updateWithAsync = async (req, res, next) => {
  const id = req.params.id;
  try {
    const num = await User.update(req.body, { where: { id: id }});
    if (num == 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update User!`
      });
    }
  } catch (err) {
    return res.send(err);
  }
}


updateWithPromise = (req, res, next) => {
  const id = req.params.id;
  function user() {
    return new Promise((resolve, reject) => {
      try {
          const data =User.update(req.body, { where: { id: id }}).then({})
          resolve(data)
      } catch (err) {
          reject(err)
      }
    })
  }
  user().then(function(num) {
    if (num == 1) {
      res.send({
        message: "User was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update User!`
      });
    }
  });
}

updateWithCallback = (req, res, next) => {
  const id = req.params.id;
  
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id="
      });
    });
  
}