const { User } = require('../models');

module.exports = (req, res, next) => {
  switch(req.query.mode) {
    case 'async':
      showWithAsync(req, res, next)
      break;

    case 'promise':
      showWithPromise(req, res, next)
      break;

    case 'callback':
      showWithCallback(req, res, next)
      break;

    default:
      showWithPromise(req, res, next)
      break;
  }
}

showWithAsync = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if(user){
      return res.send(user);
    } else {
      return res.status(422).send({message: "not found data"});
    }
  } catch (err) {
    return res.send(err);
  }
}


showWithPromise = (req, res, next) => {
  const id = req.params.id;
  function user() {
    return new Promise((resolve, reject) => {
      try {
          const data = User.findByPk(id).then({})
          resolve(data)
      } catch (err) {
          reject(err)
      }
    })
  }
  user().then(function(data) {
    if(data){
      return res.send(data);
    } else {
      return res.status(422).send({message: "not found data"});
    }
  });
}

showWithCallback = (req, res, next) => {
  const id = req.params.id;

  return User.findByPk(id)
    .then(data => {
      if(data){
        return res.send(data);
      } else {
        return res.status(422).send({message: "not found data"});
      }
    })
    .catch(err => {
      res.status(422).send({
        message: "Error data"
      });
    });
}