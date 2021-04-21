const { User } = require('../models');

module.exports = (req, res, next) => {
  switch(req.query.mode) {
    case 'async':
      deleteWithAsync(req, res, next)
      break;

    case 'promise':
      deleteWithPromise(req, res, next)
      break;

    case 'callback':
      deleteWithCallback(req, res, next)
      break;

    default:
      deleteWithPromise(req, res, next)
      break;
  }
}

deleteWithAsync = async (req, res, next) => {
  const id = req.params.id;
  try {
    const num = await User.destroy({ where: { id: id } });
    if (num == 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete User`
      });
    }
  } catch (err) {
    return res.send(err);
  }
}


deleteWithPromise = (req, res, next) => {
  const id = req.params.id;
  function user() {
    return new Promise((resolve, reject) => {
      try {
          const data = User.destroy({ where: { id: id } }).then({})
          resolve(data)
      } catch (err) {
          reject(err)
      }
    })
  }
  user().then(function(num) {
    if (num == 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete User`
      });
    }
  });
}

deleteWithCallback = (req, res, next) => {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User 1"
        });
      });
    
}