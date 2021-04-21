const bcrypt = require('bcryptjs');
const { User } = require('../models');
// Validation
const checkUserFields = require("../validation/user");

module.exports = (req, res, next) => {
	const { errors, isValid } = checkUserFields(req.body, 'create');
	
	if (!isValid) {
		return res.status(422).json({message: errors});
	}

  switch(req.query.mode) {
    case 'async':
      createWithAsync(req, res, next)
      break;

    case 'promise':
      createWithPromise(req, res, next)
      break;

    case 'callback':
      createWithCallback(req, res, next)
      break;

    default:
      createWithPromise(req, res, next)
      break;
  }

}

createWithAsync = async (req, res, next) => {
  try {
		const UserData = {
			email: req.body.email,
			name: req.body.name,
			phone: req.body.phone,
			password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
		};
    const users = await User.create(UserData);
    return res.send(users);
  } catch (err) {
    return res.send(err);
  }
}


createWithPromise = (req, res, next) => {
  function user() {
    return new Promise((resolve, reject) => {
      try {
					const UserData = {
						email: req.body.email,
						name: req.body.name,
						phone: req.body.phone,
						password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
					};
					const data = User.create(UserData).then({})
          resolve(data)
      } catch (err) {
          reject(err)
      }
    })
  }
  user().then(function(data) {
    return res.send(data);
  });
}

createWithCallback = (req, res, next) => {
    const UserData = {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    };
  
      User.create(UserData)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message
        });
      });
}