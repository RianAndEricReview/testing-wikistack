const expect = require('chai').expect
const supertest = require('supertest')
const app = require('../app')
const agent = supertest(app)
const {Page, User} = require('../models')

describe('http requests', function () {

  describe('GET /wiki', function () {
    it('gets 200 on index', function (done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('gets 200 on add', function (done) {
      agent
      .get('/wiki/add')
      .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle', function () {
    before(function(done) {
      Page.sync({force: true})
      .then(function() {
        Page.create({
          title: 'page title',
          content: 'page content',
          status: 'open'
        })
      })
      .then(() => {
        done()
      })
      .catch(done)
    })
    it('responds with 404 on page that does not exist', function(done) {
      agent
      .get('/wiki/page_not_existing')
      .expect(404, done)
    });
    it('gets 200 on page that exists', function (done) {
      agent
      .get('/wiki/page_title')
      .expect(200, done);
    });
  });

  // describe('GET /wiki/search/:tag', function () {
  //   it('responds with 200');
  // });

  // describe('GET /wiki/:urlTitle/similar', function () {
  //   it('responds with 404 for page that does not exist');
  //   it('responds with 200 for similar page');
  // });

  // describe('POST /wiki', function () {
  //   it('responds with 302');
  //   it('creates a page in the database');
  // });

});
