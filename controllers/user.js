const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email is mandatory"
    });
    return;
  }
  if (!req.body.name) {
    res.status(400).send({
      message: "Name is mandatory"
    });
    return;
  }
  if (!req.body.phone) {
    res.status(400).send({
      message: "Phone is mandatory"
    });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({
      message: "Password is mandatory"
    });
    return;
  }
  
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
};

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message
      });
    });
  
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(422).send({
        message: "Error ....="
      });
    });
  
};


exports.update = (req, res) => {
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
  
};


exports.delete = (req, res) => {
  
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
        message: "Could not delete User"
      });
    });

};