const { Manager } = require('../models');
// Validation
const checkManagerFields = require("../validation/manager");
const models = require("../models");

exports.pagination = async (req, res) => {
	let {page, limit, sort, order, by, search} = req.query

	page = Number(page || 1)
	limit = Number(limit || 10)
	let offset = (page - 1) * (limit)

	const array = ['name', 'age', 'workingSince', 'createdAt', 'updatedAt']
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

	const data = await Manager.findAndCountAll({
		order: [[order, sort]],
		limit: limit,
		offset: offset,
		distinct: true,
		where,
		include: [
				{
          model: models.Store,
          as: 'Store',
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
    
}

exports.create = (req, res) => {
    const { errors, isValid } = checkManagerFields(req.body);
    if (!isValid) {
        return res.status(422).json({message: errors});
    }

    Manager.create(req.body)
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
  const { errors, isValid } = checkManagerFields(req.body);
  if (!isValid) {
      return res.status(422).json({message: errors});
  }
  
  const id = req.params.id;

  Manager.update(req.body, {
    where: { id: id }
  })
    .then(manager => {
      res.send({
        message: "Manager was updated successfully.",
        manager
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Manager with id="
      });
    });
  
};


exports.delete = (req, res) => {
  
  const id = req.params.id;

  Manager.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Manager was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Manager`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Manager"
      });
    });

};