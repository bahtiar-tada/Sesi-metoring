const { User } = require('../models');

module.exports = (req, res, next) => {
  switch(req.query.mode) {
    case 'async':
      listWithAsync(req, res, next)
      break;

    case 'promise':
      listWithPromise(req, res, next)
      break;

    case 'callback':
      listWithCallback(req, res, next)
      break;

    default:
      listWithPromise(req, res, next)
      break;
  }
}

listWithAsync = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.send(users);
  } catch (err) {
    return res.send(err);
  }
}


listWithPromise = (req, res, next) => {
  function user() {
    return new Promise((resolve, reject) => {
      try {
          const data = User.findAll().then({})
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

listWithCallback = (req, res, next) => {
  User.findAll()
    .then(data => {
      return res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message
      });
    });
}