const chai = require("chai");
const assert = chai.assert;
const sinon = require("sinon");
const { Manager, Store } = require('../models');
const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("../managerRoutes")(app);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
});

describe('GET /api/manager', function() {

    it('view list api/manager', function(done) {
		const dataStore = {
			email: "bahtiar@usetada.com",
			name: "Test Store",
			phone: "002231233333",
			pic: "test test"
		};
		const StoreCreate = sinon.stub(Store, 'create').resolves(dataStore);
		Store.create(dataStore)
		.then((store) => {
			const dataManager = {
				storeId: store.id,
				name: 'Test Manager gogogogo',
				age: '26',
				workingSince: '2020-10-10 08:20'
			};
			const ManagerCreate = sinon.stub(Manager, 'create').resolves(dataManager);
			Manager.create(dataManager)
			.then(function() {
				request(app)
				.get('/api/manager')
				.query({ 
					limit: 2, 
					page: 1
				})
				.expect(200)
				.end(function(err, res) {
					assert.lengthOf(res.body.data, 2);
					assert.equal(res.body.pagination.page, 1);
					StoreCreate.restore();
					ManagerCreate.restore();
					done();
				});
			});
		});

    });
});

describe('PUT /api/manager/:id', function() {
    it('update data manager', async function() {
	  const manager = await Manager.findOne({ where: { createdAt: {[Op.ne]: null} } });
      const stubUpdate = sinon.stub(Manager, 'update').resolves(manager);
	  const requestBody = {
        storeId: 8,
        name: 'Test Manager 123',
        age: '22',
        workingSince: '2020-10-10 08:20'
      };

      const res = await request(app)
        .put('/api/manager/'+manager.id)
        .set('Accept', 'application/json')
        .send(requestBody)
		.expect(200);
	
	  console.log(res.body);
        
      assert.equal("Manager was updated successfully.", res.body.message);      
      stubUpdate.restore();

    });
});



describe('PUT /api/manager/:id', function() {
    it('update data manager', async function() {
	  const manager = await Manager.findOne({ where: { createdAt: {[Op.ne]: null} } });
      const stubUpdate = sinon.stub(Manager, 'update').resolves(manager);
	  const requestBody = {
        storeId: 8,
        name: 'Test Manager 123',
        age: '22',
        workingSince: '2020-10-10 08:20'
      };

      const res = await request(app)
        .put('/api/manager/'+manager.id)
        .set('Accept', 'application/json')
        .send(requestBody)
		.expect(200);
	
	  console.log(res.body);
        
      assert.equal("Manager was updated successfully.", res.body.message);      
      stubUpdate.restore();

    });
});

describe('destroy manager', function() {
    it('return destroy manager', function(done) {
      Manager.create({
        storeId: 7,
        name: 'Test Manager Destroy',
        age: '28',
        workingSince: '2020-10-10 08:20'
      })
        .then(function(data){
          request(app)
            .delete('/api/manager/'+data.id)
			.set('Accept', 'application/json')
            .send()
            .expect(200)
            .end(function() {
              done();
            });
        });
    });
});