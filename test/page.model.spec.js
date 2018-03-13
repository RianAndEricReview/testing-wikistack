const expect = require('chai').expect
var chai = require('chai')
var spies = require('chai-spies')
chai.use(spies)
chai.should()
chai.use(require('chai-things'))
const {Page, User} = require('../models')

describe('Page model', function () {
  let builtPage
  let title = 'the title'
  let content = '# the content'
  let status = 'closed'
  let urlTitle = 'the_title'
  let tags = ['the', 'content']
  beforeEach(function() {
    builtPage = Page.build({
      title,
      content,
      status,
      urlTitle
    })
  })

  describe('page creation', function() {
    it('builds a new page', function() {
      expect(builtPage.title).to.exist
      expect(builtPage.content).to.equal(content)
      expect(builtPage.status).to.be.oneOf(['open', 'closed'])
    })
  })

  describe('Virtuals', function () {
    describe('route', function () {
      it('returns the urlTitle prepended by "/wiki/"', function() {
        expect(builtPage.route).to.equal('/wiki/the_title')
      })
    });

    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function() {
        expect(builtPage.renderedContent.trim()).to.equal('<h1 id="the-content">the content</h1>')
      })
    })
  })

  describe('Class methods', function () {
    before(function(done) {
      Page.sync({force: true})
      .then(()=>{
        Page.create({
          title,
          content,
          status,
          urlTitle,
          tags
        })
      })
      .then(function() {
        done()
      })
      .catch(done)
    })


    describe('findByTag', function () {
      it('gets pages with the search tag', function(done) {
        Page.findByTag('the')
        .then(function(pageArr) {
          expect(pageArr.length).to.equal(1)
          done()
        })
      })

      it('does not get pages without the search tag', function(done) {
        Page.findByTag('scooby')
        .then(function(pageArr) {
          expect(pageArr.length).to.equal(0)
          done()
        })
      })
    })
  })

  describe('Instance methods', function () {
    let pageToTest
    let pageNotMatch
    let pageMatch
    // = Page.create({
    //       title: `page 1`,
    //       content: `this is page 1`,
    //       status: `open`,
    //       tags: ['tag1'],
    //     })
    // let page2 = Page.create({
    //   title: `page 2`,
    //   content: `this is page 2`,
    //   status: `open`,
    //   tags: ['tag2'],
    // })
    // let page3 = Page.create({
    //   title: `page 3`,
    //   content: `this is page 3`,
    //   status: `open`,
    //   tags: ['tag1'],
    // })
    let arrOfPromises = []
    before(function(done){
      for (let i = 1; i <=3 ; i++){
        let tagList = !(i % 2) ? ['oddtag'] : ['eventag']
        let pushedPromise = Page.create({
          title: `page${i}`,
          content: `this is page ${i}`,
          status: `open`,
          tags: tagList,
        })
        arrOfPromises.push(pushedPromise)
      }
      Promise.all(arrOfPromises)
      .then(function (pages) {
        pageToTest = pages[0]
        pageNotMatch = pages[1]
        pageMatch = pages[2]
        done()
      })
      .catch(done)
    })

    describe('findSimilar', function () {
      it('never gets itself', function (done){
        pageToTest.findSimilar('oddtag')
        .then((similarPages) => {
          expect(similarPages).to.have.lengthOf(1)
          expect(similarPages).to.not.contain.thing.with.property('id', pageToTest.id)
          done()
        })
      })
      it('gets other pages with any common tags', function (done){
        pageToTest.findSimilar('oddtag')
        .then((similarPages) => {
        expect(similarPages).to.contain.thing.with.property('id', pageMatch.id)
        done()
        })
      });

      it('does not get other pages without any common tags', function (done){
        pageToTest.findSimilar('oddtag')
        .then((similarPages) => {
          expect(similarPages).to.not.contain.thing.with.property('id', pageNotMatch.id)
          done()
        })
      })
    });
  });

  describe('Validations', function () {
    it('errors without title', function(done){
      let testPage = Page.build({
          title: null,
          content: 'fsljflsh',
          status: `open`,
        })
        testPage.validate()
        .catch((error) => {
          expect(error.errors[0].path).to.equal('title')
          done()
        })
        .then(page => {
          expect(page).to.not.exist
        })
        .catch(done)
    });
    it('errors without content', function(done){
      let testPage = Page.build({
        title: 'title',
        content: null,
        status: `open`,
      })
      testPage.validate()
      .catch((error) => {
        expect(error.errors[0].path).to.equal('content')
        done()
      })
      .then(page => {
        expect(page).to.not.exist
      })
      .catch(done)
    });
    it('errors given an invalid status', function(done){
      let testPage = Page.create({
        title: 'title',
        content: 'fsljflsh',
        status: `garbage`,
      })
      .catch((error) => {
        console.log(error.message)
        expect(error).to.exist
        expect(error.message).to.contain('status')
        done()
      })
      .then(page => {
        expect(page).to.not.exist
      })
      .catch(done)
    });
  });

  describe('Hooks', function () {
    it('the URL title errors if no title is put in', function(done){
      let testPage = Page.build({
          title: null,
          content: 'fsljflsh',
          status: `open`,
        })
        testPage.validate()
        .catch((error) => {
          expect(error.errors[1].path).to.equal('urlTitle')
          done()
        })
        .then(page => {
          expect(page).to.not.exist
        })
        .catch(done)
    });

    it('it sets urlTitle based on title before validating', function(done){
      let testPage = Page.build({
          title: 'title and stuff',
          content: 'fsljflsh',
          status: `open`,
        })
        testPage.validate()
        .then(page => {
          expect(page.urlTitle).to.equal('title_and_stuff')
          done()
        })
        .catch(done)
    });
  });

});
