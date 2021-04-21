const { Store } = require('../models');
// Validation
const checkStoreFields = require("../validation/store");
const models = require("../models");

exports.pagination = async (req, res) => {
	let {page, limit, sort, order, by, search} = req.query

	page = Number(page || 1)
	limit = Number(limit || 10)
	let offset = (page - 1) * (limit)

	const array = ['name', 'phone', 'email', 'createdAt', 'updatedAt']
	if (array.indexOf(by) > 0) {
			order = by
	} else if (array.indexOf(order) < 0) {
			order = 'createdAt'
	}

	if (sort !== 'asc' && sort !== 'ASC') sort = 'DESC'
	else sort = 'ASC'

	let where = { deletedAt: null }
	
	if(search){
	Object.assign(where, {
		name: {
			[Op.iLike]: `%${search}%`
		}
	});
	}

	const data = await Store.findAndCountAll({
		order: [[order, sort]],
		limit: limit,
		offset: offset,
		distinct: true,
		where,
		include: [
				{
						model: models.Manager,
						as: 'Manager',
						required: false,
						attributes: {
								exclude: ['deletedAt']
						},
				}
		],
		attributes: {
				exclude: ['deletedAt']
		},
	})

	const item = data.rows
	const count = data.count
	const lastpage = Math.ceil(count / limit)
	let pagination = null
	if (page && limit) {
			pagination = {
				page: page,
				lastpage: lastpage,
				totalData: count,
				recordsPerPage: limit,
				orderBy: order,
				sort: sort
			}
	}
	return res
		.status(200)
		.json({	
				status: true,
				pagination,
				data: item
		})
    
};

exports.create = (req, res) => {
		const { errors, isValid } = checkStoreFields(req.body);
		if (!isValid) {
			return res.status(422).json({message: errors});
		}

    Store.create(req.body)
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

exports.update = (req, res) => {
	const { errors, isValid } = checkStoreFields(req.body);
	if (!isValid) {
		return res.status(422).json({message: errors});
	}

  const id = req.params.id;

  Store.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Store was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Store!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Store with id="
      });
    });
  
};


exports.delete = (req, res) => {
  
  const id = req.params.id;

  Store.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Store was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Store`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Store"
      });
    });

};