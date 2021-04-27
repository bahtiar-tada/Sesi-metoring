const chai = require("chai");
const assert = chai.assert;
const sinon = require("sinon");
const { Manager } = require('../models');
// const checkManagerFields = require("../validation/manager");
const request = require('supertest');
const express = require('express');
const app = express();

app.post('/api/manager', function(req, res) {
    
	// const { errors, isValid } = checkManagerFields(req.body);
	// if (!isValid) {
	//     return res.status(422).json({message: errors});
	// }

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

});

app.get('/api/manager', async (req, res) => {
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

});

describe('POST /api/manager', function() {
    it('create new manager', async function() {
      const requestBody = {
        storeId: 8,
        name: 'Test Manager',
        age: '26',
        workingSince: '2020-10-10 08:20'
      };
      const stubCreate = sinon.stub(Manager, 'create').resolves(requestBody);

      const res = await request(app)
        .post('/api/manager')
        .set('Accept', 'application/json')
        .send(requestBody)
        .expect(200);
        
      assert.equal(requestBody.storeId, res.body.storeId);
      assert.equal(requestBody.name, res.body.name);
      assert.equal(requestBody.age, res.body.age);
      assert.equal(requestBody.workingSince, res.body.workingSince);
      
      stubCreate.restore();
    });

    it('view list api/manager', async function(done) {
        const res = await request(app)
          .get('/api/manager')
          .expect(200, done);
  
      	assert.equal(true, res.body.status);
      });
});